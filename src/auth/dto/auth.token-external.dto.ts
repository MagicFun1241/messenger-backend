import { IsNotEmpty } from 'class-validator';

export class AuthTokenExternalDto {
  @IsNotEmpty()
    tokenExternal: string;
}
