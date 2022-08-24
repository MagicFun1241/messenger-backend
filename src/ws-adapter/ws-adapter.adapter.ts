import { INestApplicationContext, Logger } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { AbstractWsAdapter } from '@nestjs/websockets';
import {
  CLOSE_EVENT,
  CONNECTION_EVENT,
  ERROR_EVENT,
} from '@nestjs/websockets/constants';
import { MessageMappingProperties } from '@nestjs/websockets/gateway-metadata-explorer';
import * as http from 'http';
import { EMPTY, fromEvent, Observable } from 'rxjs';
import {
  filter, first, mergeMap, share, takeUntil,
} from 'rxjs/operators';
import { pack, unpack } from 'msgpackr';

let wsPackage: any = {};

enum ReadyState {
  CONNECTING_STATE = 0,
  OPEN_STATE = 1,
  CLOSING_STATE = 2,
  CLOSED_STATE = 3,
}

type HttpServerRegistryKey = number;
type HttpServerRegistryEntry = any;
type WsServerRegistryKey = number;
type WsServerRegistryEntry = any[];

const UNDERLYING_HTTP_SERVER_PORT = 0;

export class WsAdapter extends AbstractWsAdapter {
  protected readonly logger = new Logger(WsAdapter.name);

  protected readonly httpServersRegistry = new Map<
  HttpServerRegistryKey,
  HttpServerRegistryEntry
  >();

  protected readonly wsServersRegistry = new Map<
  WsServerRegistryKey,
  WsServerRegistryEntry
  >();

  constructor(appOrHttpServer?: INestApplicationContext | any) {
    super(appOrHttpServer);
    wsPackage = loadPackage('ws', 'WsAdapter', () => require('ws'));
  }

  public create(
    port: number,
    options?: Record<string, any> & { namespace?: string; server?: any },
  ) {
    const { server, ...wsOptions } = options;
    if (wsOptions?.namespace) {
      const error = new Error(
        '"WsAdapter" does not support namespaces.'
        + 'If you need namespaces in your project, consider using the "@nestjs/platform-socket.io" package instead.',
      );
      this.logger.error(error);
      throw error;
    }

    this.logger.log(`Starting on port: ${port}`);

    if (port === UNDERLYING_HTTP_SERVER_PORT && this.httpServer) {
      this.ensureHttpServerExists(port, this.httpServer);
      const wsServer = this.bindErrorHandler(
        new wsPackage.Server({
          noServer: true,
          ...wsOptions,
        }),
      );

      this.addWsServerToRegistry(wsServer, port, options.path || '/');
      return wsServer;
    }

    if (server) {
      return server;
    }
    if (options.path && port !== UNDERLYING_HTTP_SERVER_PORT) {
      // Multiple servers with different paths
      // sharing a single HTTP/S server running on different port
      // than a regular HTTP application
      const httpServer = this.ensureHttpServerExists(port);
      httpServer?.listen(port);

      const wsServer = this.bindErrorHandler(
        new wsPackage.Server({
          noServer: true,
          ...wsOptions,
        }),
      );
      this.addWsServerToRegistry(wsServer, port, options.path);
      return wsServer;
    }

    const wsServer = this.bindErrorHandler(
      new wsPackage.Server({
        port,
        ...wsOptions,
      }),
    );
    return wsServer;
  }

  public bindMessageHandlers(
    client: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ) {
    const close$ = fromEvent(client, CLOSE_EVENT).pipe(share(), first());
    const source$ = fromEvent(client, 'message').pipe(
      mergeMap((data) => this.bindMessageHandler(data, handlers, transform).pipe(
        filter((result) => result),
      )),
      takeUntil(close$),
    );
    const onMessage = (response: any) => {
      if (client.readyState !== ReadyState.OPEN_STATE) {
        return;
      }
      client.send(pack(response));
    };

    source$.subscribe(onMessage);
  }

  public bindMessageHandler(
    buffer: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ): Observable<any> {
    try {
      const message = unpack(buffer.data);
      const messageHandler = handlers.find(
        (handler) => handler.message === message.event,
      );
      const { callback } = messageHandler;
      return transform(callback(message.data));
    } catch {
      return EMPTY;
    }
  }

  public bindErrorHandler(server: any) {
    server.on(CONNECTION_EVENT, (ws: any) => ws.on(ERROR_EVENT, (err: any) => this.logger.error(err)));
    server.on(ERROR_EVENT, (err: any) => this.logger.error(err));
    return server;
  }

  bindClientConnect(server: any, callback: Function) {
    super.bindClientConnect(server, callback);
    server.on(CONNECTION_EVENT, (ws: any, req: any, client: unknown) => {
      ws.remoteAddress = req.socket.remoteAddress;
      this.logger.log(`socket.remoteAddress: ${req.socket.remoteAddress}`);
      if (req.headers['x-forwarded-for']) {
        this.logger.log(`headers x-forwarded-for: ${req.headers['x-forwarded-for']}`);
        ws.remoteAddress = req.headers['x-forwarded-for'].split(',')[0].trim();
      }
    });
  }

  public bindClientDisconnect(client: any, callback: Function) {
    client.on(CLOSE_EVENT, callback);
  }

  public async dispose() {
    const closeEventSignals = Array.from(this.httpServersRegistry)
      .filter(([port]) => port !== UNDERLYING_HTTP_SERVER_PORT)
      .map(([_, server]) => new Promise((resolve) => server.close(resolve)));

    await Promise.all(closeEventSignals);
    this.httpServersRegistry.clear();
    this.wsServersRegistry.clear();
  }

  protected ensureHttpServerExists(
    port: number,
    httpServer = http.createServer(),
  ) {
    if (this.httpServersRegistry.has(port)) {
      return;
    }
    this.httpServersRegistry.set(port, httpServer);

    httpServer.on('upgrade', (request, socket, head) => {
      const baseUrl = `ws://${request.headers.host}/`;
      const { pathname } = new URL(request.url, baseUrl);
      const wsServersCollection = this.wsServersRegistry.get(port);

      let isRequestDelegated = false;
      for (const wsServer of wsServersCollection) {
        if (pathname === wsServer.path) {
          wsServer.handleUpgrade(request, socket, head, (ws: unknown) => {
            wsServer.emit('connection', ws, request);
          });
          isRequestDelegated = true;
          break;
        }
      }
      if (!isRequestDelegated) {
        socket.destroy();
      }
    });
    return httpServer;
  }

  protected addWsServerToRegistry<T extends Record<'path', string> = any>(
    wsServer: T,
    port: number,
    path: string,
  ) {
    const entries = this.wsServersRegistry.get(port) ?? [];
    entries.push(wsServer);

    wsServer.path = path;
    this.wsServersRegistry.set(port, entries);
  }
}
