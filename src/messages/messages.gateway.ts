import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesService } from '@/messages/messages.service';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import {
  CreateMessageDto,
  CreateMessageWithChatDto,
  CreateMessageWithUserDto,
} from '@/messages/dto/create.dto';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { MessageDocument } from '@/messages/schemas/message.schema';
import { ChatsService } from '@/chats/chats.service';
import { GetMessagesDto } from '@/messages/dto/get-list.dto';
import { ChatMember, ChatTypeEnum } from '@/chats/schemas/chats.schema';
import { WsService } from '@/ws/ws.service';
import { UpdateMessageDto } from '@/messages/dto/update.dto';

interface MessageItem {
  id: string;
  text?: string;
  sender: string;
}

@WebSocketGateway(8080, {
  cors: true,
})
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
    private readonly wsService: WsService,
  ) {}

  @SubscribeMessage('get-messages-by-conversation')
  async getList(
    @MessageBody() body: GetMessagesDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<Array<MessageItem>> {
    const hasAccess = await this.chatsService.hasAccess(body.conversation, client.userId);
    if (!hasAccess) {
      throw new WsFormatException('Conversation not found');
    }

    body.count = body.count || 10;
    body.page = body.page || 1;

    const items = await this.messagesService.find({
      conversation: body.conversation,
    }, {
      offset: body.page * body.count,
      count: body.count,
    });

    return items.map((e) => ({
      id: e._id.toString(),
      text: e.content.text,
      sender: e.sender._id.toString(),
    }));
  }

  @SubscribeMessage('post-message-to-group')
  async postMessageToGroup(
  @MessageBody() body: CreateMessageWithChatDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const hasAccess = await this.chatsService.hasAccess(body.chat, client.userId);
    if (!hasAccess) {
      throw new WsFormatException('Conversation not found');
    }

    const r = await this.create(body.chat, client.userId, body);
    return r;
  }

  @SubscribeMessage('post-message-to-direct')
  async postMessageToDirect(
  @MessageBody() body: CreateMessageWithUserDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const chat = await this.findDirectOrCreate(client.userId, body.user);
    const r = await this.create(chat.toString(), client.userId, body);
    return r;
  }

  @SubscribeMessage('update-message')
  async updateMessage(
  @MessageBody() body: UpdateMessageDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    if (body.text == null && (body.attachments == null || body.attachments.length === 0)) {
      throw new WsFormatException('No fields to update');
    }

    const o = await this.messagesService.findById(body.id);
    const chatId = o.chat._id.toString();
    const hasAccess = await this.chatsService.hasAccess(chatId, client.userId);
    if (!hasAccess) {
      throw new WsFormatException('Access denied');
    }

    let modified = 0;

    if (body.text != null) {
      o.content.text = body.text;
      modified += 1;
    }

    if (modified > 0) {
      await o.save();

      const chat = await this.chatsService.findById(chatId);

      chat.fullInfo.members.forEach((member) => {
        this.wsService.emitToAllUserSessions(member.userId.toString(), {
          event: 'message-update',
          data: {
            id: body.id,
            chat: chatId,
            text: o.content.text,
            attachments: o.content.attachments,
          },
        });
      });
    }

    return {
      modified,
    };
  }

  private async create(chat: string, sender: string, data: CreateMessageDto) {
    const doc: MessageDocument = {
      sender,
      chat,
    } as any;

    if (data.text == null && (data.attachments == null || data.attachments.length === 0)) {
      throw new WsFormatException('Attachments of only one type is supported');
    }

    const c = await this.chatsService.findById(chat);

    if (data.text != null) {
      doc.content.text = data.text;
    }

    const r = await this.messagesService.create(doc);
    c.fullInfo.members.forEach((member) => {
      this.wsService.emitToAllUserSessions(member.userId.toString(), {
        event: 'message-new',
        data: {
          id: r._id.toString(),
          sender,
          chat,
          text: data.text,
        },
      });
    });
    return {
      id: r._id.toString(),
    };
  }

  private async findDirectOrCreate(first: string, second: string) {
    const members: Array<ChatMember> = [{ userId: first as any }, { userId: second as any }];

    try {
      const d = await this.chatsService.existsWithMembers(members);
      return d._id;
    } catch (e) {
      const d = await this.chatsService.create(first, { type: ChatTypeEnum.chatTypePrivate, members });
      return d._id;
    }
  }
}
