import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { WsModule } from '@/ws/ws.module';
import { UsersService } from '@/users/users.service';

import { AuthenticationService } from '../authentication.service';
import { TokenExternal } from '../schemas/token-external.schema';
import { Session } from '../schemas/session.schema';

jest.mock('../../users/users.service');

describe('AuthService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule,
        WsModule,
      ],
      providers: [
        AuthenticationService,
        UsersService,
        { provide: getModelToken(TokenExternal.name), useValue: TokenExternal },
        { provide: getModelToken(Session.name), useValue: Session },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
