import { IsBoolean, IsNotEmpty } from 'class-validator';

export class FindConversationByIdDto {
  @IsNotEmpty()
    id: string;

  @IsBoolean()
    extended: boolean;
}
