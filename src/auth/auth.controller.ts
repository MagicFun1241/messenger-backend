import {
  Controller, Post, Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
