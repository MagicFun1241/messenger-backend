import {
  Body, Controller, HttpException, HttpStatus, Logger, Param, Post,
} from '@nestjs/common';

import Interpreter from 'sval';

import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import { CreateTokenExternalDto } from './dto/create-token-external.dto';
import { AuthenticationService } from './authentication.service';

interface ServiceInstance {
  dependencies: Array<string>;
  run: () => void;
}

interface AuthenticationServiceCallbackContext {
  body: any;
  database: {
    externalTokens: {
      insert: (doc) => void;
    };
  };
}

type AuthenticationServiceCallback = (ctx: AuthenticationServiceCallbackContext) => any;

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  private registeredServices = new Map<string, {
    dependencies: Array<string>;
    callback: AuthenticationServiceCallback;
  }>();

  constructor(private readonly authService: AuthenticationService) {
    try {
      const inputDir = path.join(process.cwd(), 'services');

      readdirSync(inputDir).forEach((p) => {
        if (path.extname(p) === '.js') {
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

          globalObject.HttpException = HttpException;

          globalObject.services = {
            register: (name: string, callback: AuthenticationServiceCallback): ServiceInstance => {
              const dependencies = [];
              return {
                dependencies,
                run: () => {
                  if (this.registeredServices.has(name)) return;

                  this.registeredServices.set(name, {
                    callback,
                    dependencies,
                  });
                },
              };
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

    this.registeredServices.forEach((service, serviceName) => {
      service.dependencies.forEach((dep) => {
        if (!this.registeredServices.has(dep)) {
          this.logger.error(`No "${dep}" dependency for "${serviceName}" service`);

          this.registeredServices.delete(serviceName);
        }
      });
    });
  }

  @Post('services/:name')
  async usingService(@Param('name') name: string, @Body() body: any): Promise<any> {
    const service = this.registeredServices.get(name);
    if (service == null) {
      throw new HttpException('Authorization service not found', HttpStatus.NOT_FOUND);
    }

    return service.callback({
      body,
      database: {
        externalTokens: {
          insert(p1) {
          },
        },
      },
    });
  }

  @Post('create-token-external')
  async externalLogin(
    @Body() createTokenExternalDto: CreateTokenExternalDto,
  ): Promise<{ tokenExternal: string }> {
    const tokenExternal = await this.authService.createTokenExternal(createTokenExternalDto);
    return {
      tokenExternal,
    };
  }
}
