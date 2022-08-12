import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WsAdapterModule } from './ws-adapter/ws-adapter.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/configs/.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const containsUserCredentials = configService.get('MONGO_USER') != null
          && configService.get('MONGO_PASSWORD') != null;

        const uri = `mongodb://${
          containsUserCredentials
            ? `${configService.get<string>('MONGO_USER')}:${configService.get<string>('MONGO_PASSWORD')}` : ''
          // eslint-disable-next-line max-len
        }@${configService.get<string>('MONGO_HOST')}/${configService.get<string>('MONGO_DATABASE')}?readPreference=primary`;

        Logger.log(`DB URI: ${uri}`);
        return uri;
      },
      inject: [ConfigService],
    }),
    WsAdapterModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
