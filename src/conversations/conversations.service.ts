import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Conversation, ConversationDocument, ConversationRole, ConversationType, Role,
} from '@/conversations/schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(@InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>) {}

  async findById(id: string, extended = false) {
    if (extended) {
      return this.conversationModel.findById(id).populate('members', ['_id', 'firstName', 'lastName']).exec();
    }
    return this.conversationModel.findById(id).populate('members', ['_id']).exec();
  }

  async create(creator: string, data: {
    type: ConversationType;
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

  async exists(id: string) {
    return this.conversationModel.exists({ _id: id }).exec();
  }

  async existsWithMembers(members: Array<string>) {
    return this.conversationModel.exists({ type: ConversationType.direct, members }).exec();
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
