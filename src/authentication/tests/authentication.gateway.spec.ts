import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WsModule } from '@/ws/ws.module';
import { UsersService } from '@/users/users.service';
import { AuthenticationGateway } from '../authentication.gateway';
import { TokenExternal } from '../schemas/token-external.schema';
import { Session } from '../schemas/session.schema';
import { AuthenticationService } from '../authentication.service';

jest.mock('../../users/users.service');

describe('AuthGateway', () => {
  let authGateway: AuthenticationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule,
        WsModule,
      ],
      providers: [
        AuthenticationGateway,
        AuthenticationService,
        UsersService,
        { provide: getModelToken(TokenExternal.name), useValue: TokenExternal },
        { provide: getModelToken(Session.name), useValue: Session },
      ],
    }).compile();

    authGateway = module.get<AuthenticationGateway>(AuthenticationGateway);
  });

  it('should be defined', () => {
    expect(authGateway).toBeDefined();
  });
});
