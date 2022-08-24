import {
  Body, Controller, HttpException, HttpStatus, Logger, Param, Post,
} from '@nestjs/common';

import { ExtensionsService } from '@/extentions/extensions.service';
import { AuthenticationSource } from '@/@types/extensions';
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

  // @Post('services/:name')
  // async usingService(@Param('name') name: string, @Body() body: any): Promise<any> {
  //   if (!this.extensions.has(name)) {
  //     throw new HttpException('Authorization service not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   return this.extensions.executeAuthenticationCallback(AuthenticationSource.http, name, body);
  // }
}
