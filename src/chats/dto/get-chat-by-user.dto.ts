import { ExternalAccount, User, UserType } from '@/users/schemas/user.schema';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetChatByUserDto extends User {
  @IsString()
    localId?: string;

  @IsString()
    externalId?: string;

  @IsNotEmpty()
  @IsString()
    service: string;
}
