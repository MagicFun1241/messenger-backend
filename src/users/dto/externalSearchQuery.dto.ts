import { IsNotEmpty, IsString } from 'class-validator';

export class ExternalSearchQueryDto {
  @IsString()
  @IsNotEmpty()
    query: string;
}
