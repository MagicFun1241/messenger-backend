import { IsNotEmpty } from 'class-validator';

export class AuthTokenExternalDto {
  @IsNotEmpty()
    service: string;

  @IsNotEmpty()
    tokenExternal: string;
}
