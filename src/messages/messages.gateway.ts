import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesService } from '@/messages/messages.service';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import {
  CreateMessageDto,
  CreateMessageWithConversationDto,
  CreateMessageWithUserDto,
} from '@/messages/dto/createMessage';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { MessageDocument } from '@/messages/schemas/message.schema';
import { ChatsService } from '@/chats/chats.service';
import { GetMessagesDto } from '@/messages/dto/getList';

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

  @SubscribeMessage('postMessageToGroup')
  async postMessageToGroup(
  @MessageBody() body: CreateMessageWithConversationDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const hasAccess = await this.chatsService.hasAccess(body.conversation, client.userId);
    if (!hasAccess) {
      throw new WsFormatException('Conversation not found');
    }

    const r = await this.create(body.conversation, client.userId, body);
    return r;
  }

  // @SubscribeMessage('postMessageToDirect')
  // async postMessageToDirect(
  // @MessageBody() body: CreateMessageWithUserDto,
  //   @ConnectedSocket() client: WebSocketEntity,
  // ) {
  //   const conversation = await this.findDirectOrCreate(client.userId, body.user);
  //   const r = await this.create(conversation.toString(), client.userId, body);
  //   return r;
  // }

  private async create(chat: string, sender: string, data: CreateMessageDto) {
    const doc: MessageDocument = {
      sender,
      chat,
    } as any;

    // if (data.text != null && data.something != null) {
    //   throw new WsFormatException('Attachments of only one type is supported');
    // }

    if (data.text != null) {
      doc.content.text = data.text;
    }

    const r = await this.messagesService.create(doc);
    return {
      id: r._id,
    };
  }
  //
  // private async findDirectOrCreate(first: string, second: string) {
  //   const members = [first, second];
  //
  //   try {
  //     const d = await this.chatsService.existsWithMembers(members);
  //     return d._id;
  //   } catch (e) {
  //     const d = await this.chatsService.create(first, { type: ConversationType.direct, members });
  //     return d._id;
  //   }
  // }
}
