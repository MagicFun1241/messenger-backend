import { Module } from '@nestjs/common';
import { AuthGateway } from '@/auth/auth.gateway';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthGateway, AuthService],
})
export class AuthModule {}
