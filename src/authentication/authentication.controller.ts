import {
  Body, Controller, Ip, Logger, Post, Get,
} from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly authService: AuthenticationService,
  ) {}

  @Post('services/volsu')
  async usingVolsu(
    @Body() createTokenExternalDto: CreateTokenExternalDto,
  ): Promise<{ tokenExternal: string }> {
    const tokenExternal = await this.authService.createTokenExternal(createTokenExternalDto);
    return {
      tokenExternal,
    };
  }

  @Get('services/volsu-test')
  async createSessionTokenForTestAccount(
    @Ip() requestIp: string,
  ): Promise<{ tokenExternal: string }> {
    let ip = requestIp;
    if (ip === '127.0.0.1') {
      ip = '::1';
    }
    const tokenExternal = await this.authService.createTokenExternalForTestAccount(ip);
    return {
      tokenExternal,
    };
  }

  // @Post('services/:name')
  // async usingService(@Param('name') name: string, @Body() body: any): Promise<any> {
  //   if (!this.extensions.has(name)) {
  //     throw new HttpException('Authorization service not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   return this.extensions.executeAuthenticationCallback(AuthenticationSource.http, name, body);
  // }
}
