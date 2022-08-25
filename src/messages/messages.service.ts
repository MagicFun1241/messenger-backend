import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Message, MessageDocument } from '@/messages/schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(data: MessageDocument) {
    return this.messageModel.create(data);
  }

  async find(query: FilterQuery<MessageDocument>, options = { offset: 0, count: 10 }) {
    return this.messageModel.find(query).skip(options.offset).limit(options.count).populate('sender', ['_id']).exec();
  }
}
