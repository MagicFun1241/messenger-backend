import { ConversationType } from '@/conversations/schemas/conversation.schema';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsIn, Validate,
} from 'class-validator';
import { IsUniqueItemsArray } from '@/validation/unique';

export class CreateConversationDto {
  @IsIn(Object.keys(ConversationType))
    type: ConversationType;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(30)
  @Validate(IsUniqueItemsArray, {
    message: 'Members must be unique',
  })
    members: Array<string>;
}
