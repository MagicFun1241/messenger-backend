import { IsNotEmpty, IsString } from 'class-validator';

export class PrivateMethod {
  @IsString()
  @IsNotEmpty()
    secret: string;
}
