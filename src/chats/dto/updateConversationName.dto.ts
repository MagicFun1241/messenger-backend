import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConversationNameDto {
  @IsString()
  @IsNotEmpty()
    id: string;

  @IsString()
  @IsNotEmpty()
    value: string;
}
