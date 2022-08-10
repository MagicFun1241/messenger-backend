import {
  Controller, Post, Body, Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  externalLogin(
  @Ip() ip: string,
    @Body() createTokenExternalDto: CreateTokenExternalDto,
  ) {
    return [];
  }
}
