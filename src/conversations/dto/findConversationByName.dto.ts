import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class FindConversationByNameDto {
  @IsString()
  @IsNotEmpty()
    value: string;

  @IsBoolean()
    extended?: boolean;
}
