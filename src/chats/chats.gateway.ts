import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';

import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';
import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { AuthWsJwtGuard } from '@/authentication/guards/auth.ws-jwt.guard';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { WsResponse } from '@/ws/interfaces/ws.response.interface';

import { ChatsService } from './chats.service';
import { ChatDocument } from './schemas/chats.schema';

import { CreateConversationDto } from './dto/createConversation';
import { FindConversationByIdDto } from './dto/findConversationById.dto';
import { UpdateConversationNameDto } from './dto/updateConversationName.dto';
import { FindConversationByNameDto } from './dto/findConversationByName.dto';
import { GetChatByUserDto } from './dto/get-chat-by-user.dto';

@UseFilters(WsFilterException)
@UseGuards(AuthWsJwtGuard)
@WebSocketGateway(8080, {
  cors: true,
})
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,
  ) {}

  // private formatItem(item: ChatDocument, extended: boolean) {
  //   const r: ChatDocument = {
  //     type: item.type,
  //     name: item.name,
  //   } as any;
  //
  //   if (extended) {
  //     // @ts-ignore
  //     r.lastMessage = item.lastMessage == null ? undefined : {
  //       id: item.lastMessage._id,
  //       text: item.lastMessage.text,
  //       sender: item.lastMessage.sender._id,
  //     };
  //
  //     r.members = item.members.map((e) => ({
  //       id: e._id.toString(),
  //       firstName: e.firstName,
  //       lastName: e.lastName,
  //     }));
  //   } else {
  //     r.lastMessage = item.lastMessage._id.toString();
  //     r.members = item.members.map((e) => (e._id.toString()));
  //   }
  //
  //   return r;
  // }

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

  @MessageMetaData('get-chat-id-by-user')
  @SubscribeMessage('get-chat-id-by-user')
  async onGetChatByUserHandler(
    @MessageBody() body: GetChatByUserDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<string>> {
    const getChatByUserResult = await this.chatsService.getPrivateChatIdByUsers(
      body,
      client.userId,
      'get-chat-id-by-user',
    );

    return {
      event: 'get-chat-id-by-user',
      data: {
        status: true,
        data: getChatByUserResult,
      },
    };
  }

  // TODO: реализовать получение чатов для infinity scroll
  @MessageMetaData('get-chats')
  @SubscribeMessage('get-chats')
  async onGetChats(
    @MessageBody() body: GetChatByUserDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<unknown>> {
    const getChatByUserResult = await this.chatsService.getChats(client.userId);

    return {
      event: 'get-chats',
      data: {
        status: true,
        data: getChatByUserResult,
      },
    };
  }

  // @SubscribeMessage('getConversations')
  // async getList(
  // @MessageBody() body: GetConversationsDto,
  //   @ConnectedSocket() client: WebSocketEntity,
  // ) {
  //   body.page = body.page || 1;
  //   body.count = body.count || 10;
  //
  //   const items = await this.conversationsService.findByMembers([client.userId], {}, {
  //     extended: body.extended,
  //     skip: body.page * body.count,
  //     limit: body.count,
  //   });
  //   return items.map((e) => this.formatItem(e, body.extended));
  // }

  // @SubscribeMessage('findConversationById')
  // async findById(
  //   @MessageBody() body: FindConversationByIdDto,
  //     @ConnectedSocket() client: WebSocketEntity,
  // ): Promise<ConversationItem> {
  //   const hasAccess = await this.conversationsService.hasAccess(body.id, client.userId);
  //   if (!hasAccess) {
  //     throw new WsFormatException('Not found');
  //   }
  //
  //   const item = await this.conversationsService.findById(body.id, { extended: body.extended });
  //   return this.formatItem(item, body.extended);
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
