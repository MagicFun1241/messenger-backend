import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { MessagesModule } from '@/messages/messages.module';
import { ConversationsModule } from '@/conversations/conversations.module';
import { ExtensionsModule } from '@/extentions/extensions.module';
import { UsersModule } from '@/users/users.module';
import { AuthenticationModule } from '@/authentication/authentication.module';
import { WsModule } from '@/ws/ws.module';
import { SearchModule } from '@/search/search.module';

import { AuthWsJwtGuard } from '@/authentication/guards/auth.ws-jwt.guard';
import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/configs/.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = 'mongodb://'
          + `${configService.get<string>('MONGO_USER')}:`
          + `${configService.get<string>('MONGO_PASSWORD')}@`
          + `${configService.get<string>('MONGO_HOST')}:`
          + `${configService.get<string>('MONGO_PORT')}/${
            configService.get<string>('MONGO_DATABASE')
          }?readPreference=primary`;

        Logger.log(`DB URI: ${uri}`);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),

    ExtensionsModule,
    UsersModule,
    MessagesModule,
    AuthenticationModule,
    ConversationsModule,
    WsModule,
    SearchModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthWsJwtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: WsFilterException,
    },
  ],
})
export class AppModule {}
