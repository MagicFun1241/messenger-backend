import { Attachment } from '@/messages/@types/api/messages.type';
import {
  IsArray, IsNotEmpty, IsString, Validate,
} from 'class-validator';
import { AttachmentsArray } from '@/@global/validation/attachments';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
    id: string;

  @IsString()
    text?: string;

  @IsArray()
  @Validate(AttachmentsArray, {
    message: 'Invalid attachments',
  })
    attachments?: Array<Attachment>;
}
