import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { ConversationsService } from '@/conversations/conversations.service';
import { ConversationDocument, ConversationType } from '@/conversations/schemas/conversation.schema';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { CreateConversationDto } from '@/conversations/dto/createConversation';
import { FindConversationByIdDto } from '@/conversations/dto/findConversationById.dto';
import { UpdateConversationNameDto } from '@/conversations/dto/updateConversationName.dto';
import { FindConversationByNameDto } from '@/conversations/dto/findConversationByName.dto';

interface ConversationItem {
  id?: string;
  type: ConversationType;
  name?: string;
  members: Array<string> | Array<{ id: string; firstName: string; lastName: string; }>;
}

@WebSocketGateway(8080, {
  cors: true,
})
export class ConversationsGateway {
  constructor(private readonly conversationsService: ConversationsService) {}

  private formatItem(item: ConversationDocument, extended: boolean) {
    const r: ConversationItem = {
      type: item.type,
      name: item.name,
    } as any;

    if (extended) {
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

  @SubscribeMessage('createConversation')
  async create(
  @MessageBody() body: CreateConversationDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const members = !body.members.includes(client.id) ? body.members.concat(client.id) : body.members;

    if (body.type !== 'group' && body.name != null) {
      delete body.name;
    }

    const doc = await this.conversationsService.create(client.id, {
      type: body.type,
      name: body.name,
      members,
    });

    return {
      id: doc._id,
    };
  }

  @SubscribeMessage('findConversationById')
  async findById(
    @MessageBody() body: FindConversationByIdDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<ConversationItem> {
    const hasAccess = await this.conversationsService.hasAccess(body.id, client.id);
    if (!hasAccess) {
      throw new WsFormatException('Not found');
    }

    const item = await this.conversationsService.findById(body.id, { extended: body.extended });
    return this.formatItem(item, body.extended);
  }

  @SubscribeMessage('findConversationsByName')
  async findByName(
    @MessageBody() body: FindConversationByNameDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<Array<ConversationItem>> {
    const r = await this.conversationsService.findByMembers([client.id], { $text: { $search: body.value } });
    return r.map((e) => this.formatItem(e, body.extended));
  }

  @SubscribeMessage('updateConversationName')
  async updateConversationName(
  @MessageBody() body: UpdateConversationNameDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const hasAccess = await this.conversationsService.hasAccess(body.id, client.id);
    if (!hasAccess) {
      throw new WsFormatException('Not found');
    }

    const conversationType = await this.conversationsService.extractConversationType(body.id);
    if (conversationType !== ConversationType.group) {
      throw new WsFormatException('Name changing is not supported for this conversation type');
    }

    await this.conversationsService.updateName(body.id, body.value);

    return {};
  }
}
