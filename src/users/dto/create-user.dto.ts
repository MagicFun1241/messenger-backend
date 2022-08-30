import { ExternalAccount, User } from '../schemas/user.schema';

export class CreateUserDto {
  firstName: string;

  lastName?: string;

  middleName?: string;

  email?: string;

  dateOfBirth?: Date;

  externalAccounts: Array<ExternalAccount>;
}
