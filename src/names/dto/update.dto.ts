import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShortnameDto {
  @IsString()
    botId?: string;

  @IsString()
  @IsNotEmpty()
    value: string;
}
