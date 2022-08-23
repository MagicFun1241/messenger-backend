import { ArrayMaxSize, IsArray, IsString } from 'class-validator';

export class FindByQueryDto {
  @IsString()
    query?: string;

  @IsArray()
  @ArrayMaxSize(5)
    tags?: Array<string>;
}
