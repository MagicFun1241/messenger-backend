import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
    conversation: string;
}
