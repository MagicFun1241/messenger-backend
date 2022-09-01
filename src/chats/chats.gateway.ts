import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import {
  Logger, UseFilters, UseGuards, UseInterceptors,
} from '@nestjs/common';

import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';
import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { AuthWsJwtGuard } from '@/authentication/guards/auth.ws-jwt.guard';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { WsResponse } from '@/ws/interfaces/ws.response.interface';

import { UserDocument } from '@/users/schemas/user.schema';
import { ChatsService } from './chats.service';
import { ChatDocument } from './schemas/chats.schema';
import { ChatsApiFormattingInterceptor } from './interceptors/chats-api-formatting.interceptor';

import { CreateConversationDto } from './dto/createConversation';
import { UpdateConversationNameDto } from './dto/updateConversationName.dto';
import { FindConversationByNameDto } from './dto/findConversationByName.dto';
import { GetChatByUserDto } from './dto/get-chat-by-user.dto';
import { GetChatByIdDto } from './dto/get-chat-by-id.dto';
import { GetChatsDto } from './dto/get-chats.dto';

@UseFilters(WsFilterException)
@UseGuards(AuthWsJwtGuard)
@WebSocketGateway(8080, {
  cors: true,
})
export class ChatsGateway {
  private readonly logger = new Logger(ChatsGateway.name);

  constructor(
    private readonly chatsService: ChatsService,
  ) {}

  @MessageMetaData('get-chat-id-by-user')
  @SubscribeMessage('get-chat-id-by-user')
  async onGetChatByUserHandler(
    @MessageBody() body: GetChatByUserDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<string>> {
    const chatId = await this.chatsService.getPrivateChatIdByUsers(
      body,
      client.userId,
      'get-chat-id-by-user',
    );

    return {
      event: 'get-chat-id-by-user',
      data: {
        status: true,
        data: chatId,
      },
    };
  }

  @UseInterceptors(ChatsApiFormattingInterceptor)
  @MessageMetaData('get-chat-by-id')
  @SubscribeMessage('get-chat-by-id')
  async onGetChatByIdHandler(
    @MessageBody() body: GetChatByIdDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<ChatDocument>> {
    const hasAccess = await this.chatsService.hasAccess(body.id, client.userId);
    if (!hasAccess) {
      throw new WsFormatException('Not found');
    }

    const chat = (await this.chatsService.findById(body.id, { extended: true })) as ChatDocument;
    const chatTitle = chat.type === 'chatTypePrivate' || chat.type === 'chatTypeSecret'
      ? chat.fullInfo.members
        .find((chatMember) => chatMember.userId._id.toString() !== client.userId).userId as UserDocument
      : undefined;
    if (chatTitle) {
      chat.title = `${chatTitle?.firstName} ${chatTitle?.lastName ? chatTitle?.lastName : ''}`;
    }

    return {
      event: 'get-chat-by-id',
      data: {
        status: true,
        data: chat,
      },
    };
  }

  @MessageMetaData('get-chats')
  @SubscribeMessage('get-chats')
  async onGetChats(
    @MessageBody() body: GetChatsDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<unknown>> {
    const chats = (await this.chatsService.findByMembers([client.userId], {}, {
      extended: body.extended,
      skip: body.page * body.count,
      limit: body.count,
    }));

    return {
      event: 'get-chats',
      data: {
        status: true,
        data: chats,
      },
    };
  }

  // @SubscribeMessage('createConversation')
  // async create(
  // @MessageBody() body: CreateConversationDto,
  //   @ConnectedSocket() client: WebSocketEntity,
  // ) {
  //   const members = !body.members.includes(client.userId) ? body.members.concat(client.userId) : body.members;
  //
  //   if (body.type !== 'group' && body.name != null) {
  //     delete body.name;
  //   }
  //
  //   const doc = await this.conversationsService.create(client.userId, {
  //     type: body.type,
  //     name: body.name,
  //     members,
  //   });
  //
  //   return {
  //     id: doc._id,
  //   };
  // }

  // @SubscribeMessage('findConversationsByName')
  // async findByName(
  //   @MessageBody() body: FindConversationByNameDto,
  //     @ConnectedSocket() client: WebSocketEntity,
  // ): Promise<Array<ConversationItem>> {
  //   body.page = body.page || 1;
  //   body.count = body.count || 10;
  //
  //   const r = await this.conversationsService.findByMembers([client.userId], { $text: { $search: body.value } }, {
  //     extended: body.extended,
  //     skip: body.page * body.count,
  //     limit: body.count,
  //   });
  //   return r.map((e) => this.formatItem(e, body.extended));
  // }

  // @SubscribeMessage('updateConversationName')
  // async updateConversationName(
  // @MessageBody() body: UpdateConversationNameDto,
  //   @ConnectedSocket() client: WebSocketEntity,
  // ) {
  //   const hasAccess = await this.conversationsService.hasAccess(body.id, client.userId);
  //   if (!hasAccess) {
  //     throw new WsFormatException('Not found');
  //   }
  //
  //   const conversationType = await this.conversationsService.extractConversationType(body.id);
  //   if (conversationType !== ConversationType.group) {
  //     throw new WsFormatException('Name changing is not supported for this conversation type');
  //   }
  //
  //   await this.conversationsService.updateName(body.id, body.value);
  //
  //   return {};
  // }
}
