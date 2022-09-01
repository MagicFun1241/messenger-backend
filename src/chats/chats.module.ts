import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@/users/users.module';

import { Chat, ChatSchema } from './schemas/chats.schema';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatApiFormattingInterceptor } from './interceptors/chat-api-formatting.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UsersModule,
  ],
  providers: [ChatsGateway, ChatsService, ChatApiFormattingInterceptor],
  exports: [ChatsService],
})
export class ChatsModule {}
