import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
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
        const containsUserCredentials = configService.get('MONGO_USER') != null && configService.get('MONGO_PASSWORD') != null;
        const uri = `mongodb://${containsUserCredentials ? `${String(configService.get('MONGO_USER'))}:${String(configService.get('MONGO_PASSWORD'))}` : ''}@${String(configService.get('MONGO_HOST'))}/${String(configService.get('MONGO_DATABASE'))}?readPreference=primary`;

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
