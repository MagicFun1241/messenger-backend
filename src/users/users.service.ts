import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type User = {
  id: number,
  name: string,
  surname: string,
  username: string,
  externalId: number,
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Maxim',
      surname: 'Mostovoy',
      username: 'int1m',
      externalId: 1,
    },
    {
      id: 2,
      name: 'Ivan',
      surname: 'Ivanov',
      username: 'ivanov321',
      externalId: 2,
    },
  ];

  findOne(userId: number): Promise<User | undefined> {
    return new Promise((resolve) => {
      resolve(this.users.find((user) => user.id === userId));
    });
  }
}
