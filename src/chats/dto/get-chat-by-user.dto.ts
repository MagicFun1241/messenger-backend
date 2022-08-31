import { ExternalAccount } from '@/users/schemas/user.schema';
import { IsString, IsArray } from 'class-validator';

export class GetChatByUserDto {
  @IsString()
    id?: string;

  @IsArray()
    externalAccounts?: ExternalAccount[];
}
