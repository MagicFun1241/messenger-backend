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
import { ConversationsService } from '@/conversations/conversations.service';
import { ConversationType } from '@/conversations/schemas/conversation.schema';
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
    private readonly conversationsService: ConversationsService,
  ) {}

  @SubscribeMessage('getMessagesByConversation')
  async getList(
    @MessageBody() body: GetMessagesDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<Array<MessageItem>> {
    const hasAccess = await this.conversationsService.hasAccess(body.conversation, client.id);
    if (!hasAccess) {
      throw new WsFormatException('Conversation not found');
    }

    body.count = body.count || 10;
    body.page = body.page || 1;

    const items = await this.messagesService.find({
      conversation: body.conversation,
    }, body.page * body.count);

    return items.map((e) => ({
      id: e._id,
      text: e.text,
      sender: e.sender._id,
    }));
  }

  @SubscribeMessage('postMessageToGroup')
  async postMessageToGroup(
  @MessageBody() body: CreateMessageWithConversationDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const hasAccess = await this.conversationsService.hasAccess(body.conversation, client.id);
    if (!hasAccess) {
      throw new WsFormatException('Conversation not found');
    }

    const r = await this.create(body.conversation, client.id, body);
    return r;
  }

  @SubscribeMessage('postMessageToDirect')
  async postMessageToDirect(
  @MessageBody() body: CreateMessageWithUserDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const conversation = await this.findDirectOrCreate(client.id, body.user);
    const r = await this.create(conversation, client.id, body);
    return r;
  }

  private async create(conversation: string, sender: string, data: CreateMessageDto) {
    const doc: MessageDocument = {
      sender,
      conversation,
    } as any;

    if (data.text == null) {
      throw new WsFormatException('Text must be passed');
    }

    const r = await this.messagesService.create(doc);
    return {
      id: r._id,
    };
  }

  private async findDirectOrCreate(first: string, second: string) {
    const members = [first, second];

    try {
      const d = await this.conversationsService.existsWithMembers(members);
      return d._id;
    } catch (e) {
      const d = await this.conversationsService.create(first, { type: ConversationType.direct, members });
      return d._id;
    }
  }
}
