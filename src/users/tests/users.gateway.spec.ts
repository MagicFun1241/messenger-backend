import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersGateway } from '../users.gateway';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { userStub } from './stubs/user.stub';
import { FindByIdDto } from '../dto/findById.dto';

jest.mock('../users.service');

describe('UsersGateway', () => {
  let usersGateway: UsersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

  describe('findOneUser', () => {
    describe('When findOneUser is called', () => {
      let user: FindByIdDto & { id: string };

      beforeEach(async () => {
        user = await usersGateway.findOneUserHandler({
          id: userStub()._id,
        });
      });

      test('then is should param _id equal return _id', () => {
        expect(user.id).toEqual(userStub()._id);
      });
    });
  });
});
