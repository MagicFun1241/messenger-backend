import { ExternalAccount } from '../schemas/user.schema';

export class CreateUserDto {
  firstName: string;

  lastName?: string;

  email?: string;

  dateOfBirth?: Date;

  externalAccounts: Array<ExternalAccount>;
}
