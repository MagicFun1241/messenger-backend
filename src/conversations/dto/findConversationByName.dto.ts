import {IsBoolean, IsInt, IsNotEmpty, IsString, Max, Min} from 'class-validator';

export class FindConversationByNameDto {
  @IsString()
  @IsNotEmpty()
    value: string;

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
    extended?: boolean;
}
