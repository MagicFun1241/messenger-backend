import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/configs/.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
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
    UsersModule,
    AuthModule,
    WsModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
