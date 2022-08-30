import { ChatTypeEnum } from '@/chats/schemas/chats.schema';

import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsString, Validate,
} from 'class-validator';
import { IsUniqueItemsArray } from '@/@global/validation/unique';

export class CreateConversationDto {
  @IsIn(Object.keys(ChatTypeEnum))
    type: ChatTypeEnum;

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
