import { IsNotEmpty, IsString } from 'class-validator';

export class FindWithUserDto {
  @IsString()
    localId: string;

  @IsString()
    firstName?: string;

  @IsString()
    lastName?: string;

  @IsString()
    externalId?: string;

  @IsString()
  @IsNotEmpty()
    service: string;
}
