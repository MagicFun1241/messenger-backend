import { IsBoolean, IsNotEmpty } from 'class-validator';

export class GetChatByIdDto {
  @IsNotEmpty()
    id: string;

  @IsBoolean()
    extended?: boolean;
}
