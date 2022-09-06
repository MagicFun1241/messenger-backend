import { IsArray, IsString, Validate } from 'class-validator';
import { Attachment } from '@/messages/@types/api/messages.type';
import { AttachmentsArray } from '@/@global/validation/attachments';

export class CreateMessageDto {
  @IsString()
    text?: string;

  @IsArray()
  @Validate(AttachmentsArray, {
    message: 'Invalid attachments',
  })
    attachments?: Array<Attachment>;
}

export class CreateMessageWithConversationDto extends CreateMessageDto {
  @IsString()
    conversation: string;
}

export class CreateMessageWithUserDto extends CreateMessageDto {
  @IsString()
    user: string;
}
