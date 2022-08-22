import {
  Body, Controller, HttpException, HttpStatus, Logger, Param, Post,
} from '@nestjs/common';

import path from 'path';

import Interpreter from 'sval';

import { existsSync, readdirSync, readFileSync } from 'fs';

import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authService: AuthenticationService) {

  }

  @Post('services/:name')
  async usingService(@Param('name') name: string, @Body() body: any): Promise<any> {
    const service = this.registeredServices.get(name);
    if (service == null) {
      throw new HttpException('Authorization service not found', HttpStatus.NOT_FOUND);
    }

    return service.callback({
      body,
    });
  }
}
