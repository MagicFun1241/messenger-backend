import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-redis';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
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
    // RedisModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => {
    //     const port = configService.get<string>('REDIS_PORT');
    //     return {
    //       host: configService.get<string>('REDIS_HOST'),
    //       port: port == null ? undefined : parseInt(port, 10),
    //       username: configService.get<string>('REDIS_USER'),
    //       password: configService.get<string>('REDIS_PASSWORD'),
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    UsersModule,
    AuthenticationModule,
    WsModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
