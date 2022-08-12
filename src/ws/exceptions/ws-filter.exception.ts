import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { pack } from 'msgpackr';
import { WsFormatExceptionInterface } from '../interfaces/ws-format-exception.interface';

@Catch()
export class WsFilterException extends BaseWsExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(exception: { error: WsFormatExceptionInterface, message: string }, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<WebSocket>();

    client.send(pack({
      event: exception.error.event,
      data: exception.error.message,
    }));

    if (exception.error.isCloseWs) {
      client.close(exception.error.code);
    }
  }
}
