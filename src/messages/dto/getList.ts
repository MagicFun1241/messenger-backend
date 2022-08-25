import {
  IsInt, IsNotEmpty, IsString, Max, Min,
} from 'class-validator';

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
    conversation: string;

  @IsInt()
  @Min(1)
  @Max(30)
    count: number;

  @IsInt()
  @Min(1)
    page: number;
}
