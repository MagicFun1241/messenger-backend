import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { WsResponse } from '@/ws/interfaces/ws.response.interface';

import { UsersGateway } from '../users.gateway';
import { UsersService } from '../users.service';
import { User, UserDocument } from '../schemas/user.schema';
import { userStub } from './stubs/user.stub';

jest.mock('../users.service');

describe('UsersGateway', () => {
  let usersGateway: UsersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        UsersGateway,
        UsersService,
        { provide: getModelToken(User.name), useValue: User },
      ],
    }).compile();

    usersGateway = module.get<UsersGateway>(UsersGateway);
    jest.clearAllMocks();
  });

  test('should be defined', () => {
    expect(usersGateway).toBeDefined();
  });

  describe('findById', () => {
    describe('When findById is called', () => {
      let user: WsResponse<UserDocument>;

      beforeEach(async () => {
        user = await usersGateway.findOneUserHandler({
          id: userStub()._id,
        });
      });

      test('then is should param _id equal return _id', () => {
        expect(user.data.data._id).toEqual(userStub()._id);
      });
    });
  });
});
