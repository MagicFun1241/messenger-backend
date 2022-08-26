import {
  Body, Controller, Ip, Logger, Post
} from '@nestjs/common';

import { Public } from './guards/auth.public.decorator';
import { AuthenticationService } from './authentication.service';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly authService: AuthenticationService,
  ) {}

  @Public()
  @Post('services/volsu')
  async usingVolsu(
    @Body() createTokenExternalDto: CreateTokenExternalDto,
  ): Promise<{ tokenExternal: string }> {
    const tokenExternal = await this.authService.createTokenExternal(createTokenExternalDto);
    return {
      tokenExternal,
    };
  }

  @Public()
  @Post('services/volsu-test')
  async createSessionTokenForTestAccount(
    @Ip() requestIp: string,
  ): Promise<{ tokenExternal: string }> {
    const tokenExternal = await this.authService.createTokenExternalForTestAccount(requestIp);
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
