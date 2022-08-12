import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { TokenExternal, TokenExternalSchema } from './schemas/token-external.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { AuthGateway } from './auth.gateway';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthWsJwtGuard } from './guards/auth.ws-jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TokenExternal.name,
        schema: TokenExternalSchema,
        collection: 'token-external',
      },
      {
        name: Session.name,
        schema: SessionSchema,
      },
    ]),
    JwtModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthGateway, AuthWsJwtGuard, AuthService],
  exports: [AuthWsJwtGuard],
})
export class AuthModule {}
