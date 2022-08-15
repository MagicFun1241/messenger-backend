import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { WsModule } from '@/ws/ws.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthenticationController } from './authenticationController';
import { AuthenticationService } from './auth.service';
import { TokenExternal } from './schemas/token-external.schema';
import { Session } from './schemas/session.schema';

describe('AuthController', () => {
  let controller: AuthenticationController;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongoServer.getUri(),
          }),
        }),
        ConfigModule,
        JwtModule,
        UsersModule,
        WsModule,
      ],
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        { provide: getModelToken(TokenExternal.name), useValue: TokenExternal },
        { provide: getModelToken(Session.name), useValue: Session },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  afterEach(async () => {
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
