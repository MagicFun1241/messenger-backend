import { IsBoolean, IsNotEmpty } from 'class-validator';

export class FindConversation {
  @IsNotEmpty()
    id: string;

  @IsBoolean()
    extended: boolean;
}
