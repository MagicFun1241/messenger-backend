import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query } from 'mongoose';

import {
  Conversation, ConversationDocument, ConversationType, Role,
} from '@/conversations/schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(@InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>) {}

  private cut<T>(query: Query<T, any>, extended: boolean) {
    if (extended) {
      return query
        .populate('lastMessage', ['_id', 'sender', 'text'])
        .populate('members', ['_id', 'firstName', 'lastName'])
        .exec();
    }
    return query
      .populate('lastMessage', ['_id'])
      .populate('members', ['_id'])
      .exec();
  }

  async findById(id: string, options: {
    extended?: boolean;
  } = { extended: false }) {
    return this.cut<ConversationDocument>(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.conversationModel.findById(id, { name: 1, members: 1, lastMessage: 1 }),
      options.extended,
    );
  }

  async findByMembers(
    members: string[],
    additional: FilterQuery<ConversationDocument> = {},
    options = { extended: false },
  ) {
    return this.cut<Array<ConversationDocument>>(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.conversationModel.find({ ...additional, members: { $in: members } }),
      options.extended,
    );
  }

  async create(creator: string, data: {
    type: ConversationType;
    name?: string;
    members: string[];
  }) {
    return this.conversationModel.create({
      ...data,
      roles: data.type === ConversationType.group ? [{
        user: creator,
        role: Role.creator,
      }] : undefined,
    });
  }

  async updateName(id: string, value: string) {
    await this.conversationModel.updateOne({ _id: id }, { $set: { name: value } }).exec();
  }

  async exists(id: string) {
    return this.conversationModel.exists({ _id: id }).exec();
  }

  async existsWithMembers(members: Array<string>) {
    return this.conversationModel.exists({ type: ConversationType.direct, members }).exec();
  }

  async extractConversationType(id: string) {
    const c = await this.conversationModel.findById(id, { type: 1 });
    return c.type;
  }

  async hasAccess(conversation: string, user: string) {
    const r = await this.conversationModel.findById(conversation, { members: 1 }).populate('members', ['_id']).exec();
    return r.members.findIndex((e) => e._id === user) !== -1;
  }

  async hasRights(conversation: string, user: string, role: Role) {
    const r = await this.conversationModel.findById(conversation, { roles: 1 }).exec();
    return r.roles.find((e) => e.user === user)?.value >= role;
  }
}
