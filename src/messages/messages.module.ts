import { Module } from '@nestjs/common';
import { MessagesGateway } from '@/messages/messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '@/messages/schemas/message.schema';
import { MessagesService } from '@/messages/messages.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
