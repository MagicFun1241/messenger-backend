import {
  IsNotEmpty, IsString,
} from 'class-validator';

export class FindByIdDto {
  @IsString()
  @IsNotEmpty()
    id: string;
}
