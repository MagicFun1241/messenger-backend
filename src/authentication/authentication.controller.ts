import {
  Body, Controller, Param, Post,
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
}

type AuthenticationServiceCallback = (ctx: AuthenticationServiceCallbackContext) => any;

@Controller('authentication')
export class AuthenticationController {
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

          const customConsole = console;
          ['log', 'warn', 'error'].forEach((key) => {
            customConsole[key] = () => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call,prefer-rest-params
              console[key](`[AuthenticationService ${p}]`, ...arguments);
            };
          });

          interpreter.import({
            console: customConsole,
            services: {
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
            },
          });

          try {
            interpreter.run(readFileSync(path.join(inputDir, p), { encoding: 'utf-8' }));
          } catch (e) {
            throw new Error(`Error evaluating "${p}" authorization service`);
          }
        }
      });
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.error(e);
    }

    this.registeredServices.forEach((service, serviceName) => {
      service.dependencies.forEach((dep) => {
        if (!this.registeredServices.has(dep)) {
          console.error(`No "${dep}" dependency for "${serviceName}" service`);

          this.registeredServices.delete(serviceName);
        }
      });
    });
  }

  @Post('services/:name')
  async usingService(@Param('name') name: string, @Body() body: any): Promise<any> {
    const service = this.registeredServices.get(name);
    if (service == null) {
      return null;
    }

    return service.callback({
      body,
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
