import { Module } from '@nestjs/common';
import { AuthGateway } from '@/auth/auth.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenExternal, TokenExternalSchema } from '@/auth/schemas/token-external.schema';
import { Session, SessionSchema } from '@/auth/schemas/session.schema';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthGateway, AuthService],
})
export class AuthModule {}
