import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { WsModule } from '@/ws/ws.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthGateway } from './auth.gateway';
import { TokenExternal } from './schemas/token-external.schema';
import { Session } from './schemas/session.schema';
import { AuthService } from './auth.service';

describe('AuthGateway', () => {
  let gateway: AuthGateway;
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
      providers: [
        AuthGateway,
        AuthService,
        { provide: getModelToken(TokenExternal.name), useValue: TokenExternal },
        { provide: getModelToken(Session.name), useValue: Session },
      ],
    }).compile();

    gateway = module.get<AuthGateway>(AuthGateway);
  });

  afterEach(async () => {
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
