import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModuleModule } from '@/test-module/test-module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/configs/.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb://'
            + `${String(configService.get('MONGO_USER'))}:`
            + `${String(configService.get('MONGO_PASSWORD'))}@`
            + `${String(configService.get('MONGO_HOST'))}:`
            + `${String(configService.get('MONGO_PORT'))}/${
              String(configService.get('MONGO_DATABASE'))
            }?readPreference=primary`,
      }),
      inject: [ConfigService],
    }),
    TestModuleModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
