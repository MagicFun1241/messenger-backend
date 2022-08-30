import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@/users/users.module';

import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { ConversationsGateway } from './conversations.gateway';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
    UsersModule,
  ],
  providers: [ConversationsGateway, ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
