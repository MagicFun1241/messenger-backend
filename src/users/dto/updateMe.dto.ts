import { IsString } from 'class-validator';

export class UpdateMeDto {
  @IsString()
    userName?: string;
}
