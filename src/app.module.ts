import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from '@/messages/messages.module';
import { ConversationsModule } from '@/conversations/conversations.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { WsModule } from './ws/ws.module';
import {ExtensionsModule} from "@/extentions/extensions.module";

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
