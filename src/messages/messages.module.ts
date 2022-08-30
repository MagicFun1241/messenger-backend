import { Module } from '@nestjs/common';
import { MessagesGateway } from '@/messages/messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@/users/users.module';
import { ChatsModule } from '@/chats/chats.module';

import { Message, MessageSchema } from './schemas/message.schema';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    ChatsModule,
  ],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
