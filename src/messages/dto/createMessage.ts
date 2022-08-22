import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
    text?: string;
}

export class CreateMessageWithConversationDto extends CreateMessageDto {
  @IsString()
    conversation: string;
}

export class CreateMessageWithUserDto extends CreateMessageDto {
  @IsString()
    user: string;
}
