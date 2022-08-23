import { ConversationType } from '@/conversations/schemas/conversation.schema';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsString, Validate,
} from 'class-validator';
import { IsUniqueItemsArray } from '@/validation/unique';

export class CreateConversationDto {
  @IsIn(Object.keys(ConversationType))
    type: ConversationType;

  @IsString()
    name?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(30)
  @Validate(IsUniqueItemsArray, {
    message: 'Members must be unique',
  })
    members: Array<string>;
}
