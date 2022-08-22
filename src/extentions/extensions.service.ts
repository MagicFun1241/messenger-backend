import {
  HttpException, HttpStatus, Injectable, Logger,
} from '@nestjs/common';
import path from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
import Interpreter from 'sval';
import { AuthenticationService } from '@/authentication/authentication.service';
import { AuthenticationServiceCallback, ServiceInstance } from '@/@types/extensions';

@Injectable()
export class ExtensionsService {
  private readonly logger = new Logger(ExtensionsService.name);

  private registered = new Map<string, {
    dependencies: Array<string>;
    callback: AuthenticationServiceCallback;
  }>();

  constructor(private readonly authenticationService: AuthenticationService) {
    try {
      const inputDir = path.join(process.cwd(), 'services');

      readdirSync(inputDir).forEach((p) => {
        const ext = path.extname(p);
        if (ext === '.js') {
          const serviceName = path.basename(p, ext);

          let config: { [name: string]: any; } = {};

          const configPath = path.join('services', `${serviceName}.json`);
          if (existsSync(configPath)) {
            config = JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }));
          }

          const interpreter = new Interpreter({
            ecmaVer: 9,
          });

          const customConsole = this.logger;
          ['log', 'warn', 'error'].forEach((key) => {
            customConsole[key] = () => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call,prefer-rest-params
              this.logger[key](`[${p}]`, ...arguments);
            };
          });

          const globalObject: { [name: string]: any; } = {};
          globalObject.console = customConsole;
          globalObject.config = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            get: (key) => config[key],
          };

          globalObject.jwt = {
            verify: (token: string, secret: string) => this.authenticationService.verifyJwt(token, secret),
            decode: (token: string) => this.authenticationService.decodeJwt(token),
          };

          globalObject.HttpException = HttpException;
          globalObject.HttpStatus = HttpStatus;

          globalObject.http = {
            authentication: {
              register: (name: string, callback: AuthenticationServiceCallback): ServiceInstance => {
                const dependencies = [];
                return {
                  dependencies,
                  run: () => {
                    if (this.registered.has(name)) return;

                    this.registered.set(name, {
                      callback,
                      dependencies,
                    });
                  },
                };
              },
            },
          };

          interpreter.import(globalObject);

          try {
            interpreter.run(readFileSync(path.join(inputDir, p), { encoding: 'utf-8' }));
          } catch (e) {
            throw new Error(`Error evaluating "${p}" authorization service`);
          }
        }
      });
      // eslint-disable-next-line no-empty
    } catch (e) {
      this.logger.error(e);
    }

    this.registered.forEach((service, serviceName) => {
      service.dependencies.forEach((dep) => {
        if (!this.registered.has(dep)) {
          this.logger.error(`No "${dep}" dependency for "${serviceName}" service`);

          this.registered.delete(serviceName);
        }
      });
    });
  }

  has(name: string) {
    return this.registered.has(name);
  }

  executeHttpAuthenticationCallback(service: string, body: any): any {
    const item = this.registered.get(service);
    return item.callback({
      body,
      database: {
        users: {
          findByExternalId: this.authenticationService.findByExternalId,
        },
        externalTokens: {
          // eslint-disable-next-line consistent-return
          insert(p1, cb = null) {
            const action = () => {};

            if (cb == null) {
              return new Promise<any>((resolve) => {
                action();
                resolve({});
              });
            }

            action();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            cb({});
          },
        },
      }
    });
  }
}
