import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query } from 'mongoose';

import { UsersService } from '@/users/users.service';

import { WsFormatException } from '@/ws/exceptions/ws.format.exception';

import {
  Chat, ChatDocument, ChatMember,
} from './schemas/chats.schema';

import { GetChatByUserDto } from './dto/get-chat-by-user.dto';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private readonly usersService: UsersService,
  ) {}

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
    return this.cut<ChatDocument>(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.chatModel.findById(id, { name: 1, members: 1, lastMessage: 1 }),
      options.extended,
    );
  }

  async findByMembers(
    members: ChatMember[],
    additional: FilterQuery<ChatDocument> = {},
    options = { extended: false, skip: 0, limit: 10 },
  ): Promise<Array<ChatDocument>> {
    return this.chatModel.find({ ...additional, members: { $in: members } }).skip(options.skip).limit(options.limit);
  }

  // async create(creator: string, data: {
  //   type: ConversationType;
  //   members: ChatMember[];
  // }) {
  //   return this.conversationModel.create({
  //     ...data,
  //     roles: data.type === ConversationType.group ? [{
  //       user: creator,
  //       role: Role.creator,
  //     }] : undefined,
  //   });
  // }

  async updateName(id: string, value: string) {
    await this.chatModel.updateOne({ _id: id }, { $set: { name: value } }).exec();
  }

  async exists(id: string) {
    return this.chatModel.exists({ _id: id }).exec();
  }

  // async existsWithMembers(members: Array<string>) {
  //   return this.conversationModel.exists({ type: ConversationType.direct, members }).exec();
  // }

  async extractConversationType(id: string) {
    const c = await this.chatModel.findById(id, { type: 1 });
    return c.type;
  }

  // async hasAccess(conversation: string, user: string) {
  //   const r = await this.conversationModel.findById(conversation, { members: 1 }).populate('members', ['_id']).exec();
  //   return r.members.findIndex((e) => e._id.toString() === user) !== -1;
  // }

  // async hasRights(conversation: string, user: string, role: Role) {
  //   const r = await this.conversationModel.findById(conversation, { roles: 1 }).exec();
  //   return r.roles.find((e) => e.user === user)?.value >= role;
  // }

  async getChats(currentUserId: string) {
    return '';
  }

  async getPrivateChatIdByUsers(user: GetChatByUserDto, currentUserId: string, evenName: string): Promise<string> {
    let foundedUserId: string;

    if (user.type === 'userTypeUnLinked') {
      const externalUser = await this.usersService.externalFindUserById(user.id);
      foundedUserId = (await this.usersService.findByExternalIdOrCreate({
        firstName: externalUser.firstName,
        externalAccounts: [{ service: 'volsu', id: externalUser.id }],
      }))._id.toString();
    } else {
      foundedUserId = (await this.usersService.existsWithId(user.id)).toString();
    }

    if (!foundedUserId) {
      throw new WsFormatException({ event: evenName, message: 'User not found' });
    }

    let [foundedChat] = await this.findByMembers([{ userId: currentUserId }, { userId: foundedUserId }], {
      type: 'chatTypePrivate',
    });

    this.logger.log(`id1: ${currentUserId}, id2: ${foundedUserId}`);

    if (!foundedChat) {
      foundedChat = await this.chatModel.create({
        type: 'chatTypePrivate',
        members: [
          { userId: currentUserId },
          { userId: foundedUserId },
        ],
      });
    }

    return foundedChat._id.toString();
  }
}
