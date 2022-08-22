import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { ConversationsService } from '@/conversations/conversations.service';
import { ConversationType } from '@/conversations/schemas/conversation.schema';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { CreateConversationDto } from '@/conversations/dto/createConversation';
import { FindConversation } from '@/conversations/dto/findConversation';

interface ConversationItem {
  id?: string;
  type: ConversationType;
  members: Array<string> | Array<{ id: string; firstName: string; lastName: string; }>;
}

@WebSocketGateway(8080, {
  cors: true,
})
export class ConversationsGateway {
  constructor(private readonly conversationsService: ConversationsService) {}

  @SubscribeMessage('createConversation')
  async create(
  @MessageBody() body: CreateConversationDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const members = !body.members.includes(client.id) ? body.members.concat(client.id) : body.members;

    const doc = await this.conversationsService.create(client.id, {
      type: body.type,
      members,
    });

    return {
      id: doc._id,
    };
  }

  @SubscribeMessage('findOneConversation')
  async findById(
    @MessageBody() body: FindConversation,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<ConversationItem> {
    const hasAccess = await this.conversationsService.hasAccess(body.id, client.id);
    if (!hasAccess) {
      throw new WsFormatException('Not found');
    }

    const item = await this.conversationsService.findById(body.id, body.extended);

    const r: ConversationItem = {
      type: item.type,
    } as any;

    if (item.type) {
      r.members = item.members.map((e) => ({
        id: e._id,
        firstName: e.firstName,
        lastName: e.lastName,
      }));
    } else {
      r.members = item.members.map((e) => (e._id));
    }

    return r;
  }
}
