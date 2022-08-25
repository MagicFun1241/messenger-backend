import {
  IsBoolean,
  IsInt, IsNotEmpty, Max, Min,
} from 'class-validator';

export class GetConversationsDto {
  @IsInt()
  @Min(1)
  @Max(20)
  @IsNotEmpty()
    count: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
    page: number;

  @IsBoolean()
    extended: boolean;
}
