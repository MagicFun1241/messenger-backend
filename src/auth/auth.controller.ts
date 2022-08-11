import {
  Controller, Post, Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('external-login')
  async externalLogin(
    @Body() createTokenExternalDto: CreateTokenExternalDto,
  ): Promise<{ status: boolean }> {
    await this.authService.create(createTokenExternalDto);
    return {
      status: true,
    };
  }
}
