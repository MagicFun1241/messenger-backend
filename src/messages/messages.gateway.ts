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

@WebSocketGateway(8080, {
  cors: true,
})
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService,
  ) {}

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
