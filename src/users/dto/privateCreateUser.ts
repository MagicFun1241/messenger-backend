import { CreateUserDto } from '@/users/dto/create-user.dto';
import { PrivateMethod } from '@/@types/private';
import { ExternalAccount } from '@/users/schemas/user.schema';

export class PrivateCreateUser extends PrivateMethod implements CreateUserDto {
  dateOfBirth: Date;

  email: string;

  externalAccounts: Array<ExternalAccount>;

  firstName: string;

  lastName: string;

  middleName: string;
}
