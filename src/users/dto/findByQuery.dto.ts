import {
  ArrayMaxSize, IsArray, IsString, Validate,
} from 'class-validator';
import { IsUniqueItemsArray } from '@/@global/validation/unique';

export class FindByQueryDto {
  @IsString()
    query?: string;

  @IsArray()
  @ArrayMaxSize(5)
  @Validate(IsUniqueItemsArray, {
    message: 'Tags must be unique',
  })
    tags?: Array<string>;
}
