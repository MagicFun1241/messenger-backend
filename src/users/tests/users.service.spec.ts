import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';

import { NamesModule } from '@/names/names.module';

import { User } from '../schemas/user.schema';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
      ],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: User },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('search', () => {
  //   describe('When search is called', () => {
  //     let searchedUsers: Array<UserDocument>;
  //
  //     const searchFullName = 'Мостовой';
  //   });
  // });
});
