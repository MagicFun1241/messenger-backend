import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { WsModule } from '@/ws/ws.module';
import { TokenExternal, TokenExternalSchema } from './schemas/token-external.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { AuthenticationGateway } from './authentication.gateway';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
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
    WsModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationGateway, AuthWsJwtGuard, AuthenticationService],
  exports: [AuthWsJwtGuard],
})
export class AuthenticationModule {}
