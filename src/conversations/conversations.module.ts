import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from '@/conversations/schemas/conversation.schema';
import { ConversationsGateway } from '@/conversations/conversations.gateway';
import { ConversationsService } from '@/conversations/conversations.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }])],
  providers: [ConversationsGateway, ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
