import { Module } from '@nestjs/common';
import { MessagesGateway } from '@/messages/messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@/users/users.module';
import { ConversationsModule } from '@/conversations/conversations.module';

import { Message, MessageSchema } from './schemas/message.schema';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    ConversationsModule,
  ],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
