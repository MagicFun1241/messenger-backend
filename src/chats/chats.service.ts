import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query } from 'mongoose';

import { UsersService } from '@/users/users.service';

import { WsFormatException } from '@/ws/exceptions/ws.format.exception';

import {
  Chat, ChatDocument, ChatMember, ChatType, ChatTypeEnum,
} from './schemas/chats.schema';

import { ApiChat } from './@types/api/chats.type';

import { GetChatByUserDto } from './dto/get-chat-by-user.dto';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    @InjectModel(Chat.name) private ChatModel: Model<ChatDocument>,
    private readonly usersService: UsersService,
  ) {}

  private static async cut<T>(query: Query<unknown, unknown, unknown, T>, extended: boolean) {
    if (extended) {
      const result = await query
        .populate('fullInfo.members.userId', ['_id', 'firstName', 'lastName'])
        .exec();
      return result;
    }
    const result = await query
      .exec();
    return result;
  }

  async findById(id: string, options: {
    extended?: boolean;
  } = { extended: false }) {
    const result = await ChatsService.cut<ChatDocument>(
      this.ChatModel.findById(id),
      options.extended,
    );
    return result;
  }

  async countChatsByMembers(
    members: Array<string>,
  ): Promise<number> {
    const result = await this.ChatModel
      .countDocuments({ 'fullInfo.members.userId': { $all: members } })
      .exec();

    return result;
  }

  async findByMembers(
    members: Array<string>,
    additional: FilterQuery<ChatDocument> = {},
    options = { extended: false, skip: 0, limit: 10 },
  ): Promise<ChatDocument[]> {
    const result = (await ChatsService.cut<ChatDocument>(
      this.ChatModel.find({ ...additional, 'fullInfo.members.userId': { $all: members } })
        .skip(options.skip)
        .limit(options.limit),
      options.extended,
    )) as ChatDocument[];

    return result;
  }

  async create(creator: string, data: {
    type: ChatType;
    members: ChatMember[];
  }) {
    return this.ChatModel.create({
      ...data,
      // roles: data.type !== ChatTypeEnum.chatTypePrivate ? [{
      //   user: creator,
      //   role: Role.creator,
      // }] : undefined,
    });
  }

  async updateName(id: string, value: string) {
    await this.ChatModel.updateOne({ _id: id }, { $set: { name: value } }).exec();
  }

  async exists(id: string) {
    return this.ChatModel.exists({ _id: id }).exec();
  }

  async existsWithMembers(members: Array<ChatMember>) {
    return this.ChatModel.exists({
      type: ChatTypeEnum.chatTypePrivate,
      'members.userId': { $in: members.map((e) => e.userId) },
    }).exec();
  }

  async extractConversationType(id: string) {
    const c = await this.ChatModel.findById(id, { type: 1 });
    return c.type;
  }

  async hasAccess(chat: string, userId: string): Promise<boolean> {
    const isAccess = (await this.ChatModel.findById(
      chat,
      { members: 1 },
    ).exec()).fullInfo.members
      ?.findIndex((chatMember) => chatMember.userId.toString() === userId) !== -1;

    return isAccess;
  }

  // async hasRights(conversation: string, user: string, role: Role) {
  //   const r = await this.conversationModel.findById(conversation, { roles: 1 }).exec();
  //   return r.roles.find((e) => e.user === user)?.value >= role;
  // }

  async getPrivateChatIdByUsers(user: GetChatByUserDto, currentUserId: string, eventName: string): Promise<string> {
    if (!user.id && !user.externalAccounts) {
      throw new WsFormatException({ event: eventName, message: 'At least one param must be passed' });
    }

    let foundedUserId: string;
    if (user.id) {
      foundedUserId = (await this.usersService.existsWithId(user.id)).toString();
    } else {
      // Workaround, позже сделать коллекцию сервисом, и переписать тут на forEach
      const externalAccount = user.externalAccounts.find((account) => account.service === 'volsu');
      if (!externalAccount) {
        throw new WsFormatException({ event: eventName, message: 'External account not found' });
      }

      const externalUser = await this.usersService.externalFindUserById(externalAccount.id);

      foundedUserId = (await this.usersService.findByExternalIdOrCreate({
        firstName: externalUser.firstName,
        email: externalUser.email,
        externalAccounts: [{ service: 'volsu', id: externalUser.id }],
      }))._id.toString();
    }

    if (!foundedUserId) {
      throw new WsFormatException({ event: eventName, message: 'User not found' });
    }

    let [foundedChat] = await this.findByMembers(
      [currentUserId, foundedUserId],
      { type: 'chatTypePrivate' },
    );

    if (!foundedChat) {
      foundedChat = await this.ChatModel.create({
        type: 'chatTypePrivate',
        fullInfo: {
          members: [
            { userId: currentUserId },
            { userId: foundedUserId },
          ],
        },
      });
    }

    return foundedChat._id.toString();
  }
}
