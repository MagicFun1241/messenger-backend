import { ExternalAccount, User, UserType } from '@/users/schemas/user.schema';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetChatByUserDto extends User {
  @IsNotEmpty()
  @IsString()
    id: string;

  @IsNotEmpty()
  @IsString()
    type: UserType;

  @IsNotEmpty()
    externalAccounts?: Array<ExternalAccount>;
}
