import { IsNotEmpty, IsString } from 'class-validator';

export class ResolveNameDto {
  @IsString()
  @IsNotEmpty()
    value: string;
}
