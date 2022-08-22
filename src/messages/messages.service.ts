import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message, MessageDocument } from '@/messages/schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private conversationModel: Model<MessageDocument>) {}

  async create(data: MessageDocument) {
    return this.conversationModel.create(data);
  }
}
