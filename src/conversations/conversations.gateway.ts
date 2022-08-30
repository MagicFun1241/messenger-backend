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
import { GetConversationsDto } from '@/conversations/dto/getConversations.dto';
import { FindWithUserDto } from '@/conversations/dto/findWithUser.dto';
import { UsersService } from '@/users/users.service';

interface ConversationItem {
  id?: string;
  type: ConversationType;
  name?: string;
  members: Array<string> | Array<{ id: string; firstName: string; lastName: string; }>;
  lastMessage?: string | { id: string; text?: string; sender: string; };
}

@WebSocketGateway(8080, {
  cors: true,
})
export class ConversationsGateway {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  private formatItem(item: ConversationDocument, extended: boolean) {
    const r: ConversationItem = {
      type: item.type,
      name: item.name,
    } as any;

    if (extended) {
      // @ts-ignore
      r.lastMessage = item.lastMessage == null ? undefined : {
        id: item.lastMessage._id,
        text: item.lastMessage.text,
        sender: item.lastMessage.sender._id,
      };

      r.members = item.members.map((e) => ({
        id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
      }));
    } else {
      r.lastMessage = item.lastMessage._id.toString();
      r.members = item.members.map((e) => (e._id.toString()));
    }

    return r;
  }

  @SubscribeMessage('createConversation')
  async create(
  @MessageBody() body: CreateConversationDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const members = !body.members.includes(client.userId) ? body.members.concat(client.userId) : body.members;

    if (body.type !== 'group' && body.name != null) {
      delete body.name;
    }

    const doc = await this.conversationsService.create(client.userId, {
      type: body.type,
      name: body.name,
      members,
    });

    return {
      id: doc._id,
    };
  }

  @SubscribeMessage('getConversations')
  async getList(
  @MessageBody() body: GetConversationsDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    body.page = body.page || 1;
    body.count = body.count || 10;

    const items = await this.conversationsService.findByMembers([client.userId], {}, {
      extended: body.extended,
      skip: body.page * body.count,
      limit: body.count,
    });
    return items.map((e) => this.formatItem(e, body.extended));
  }

  @SubscribeMessage('findConversationById')
  async findById(
    @MessageBody() body: FindConversationByIdDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<ConversationItem> {
    const hasAccess = await this.conversationsService.hasAccess(body.id, client.userId);
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
    body.page = body.page || 1;
    body.count = body.count || 10;

    const r = await this.conversationsService.findByMembers([client.userId], { $text: { $search: body.value } }, {
      extended: body.extended,
      skip: body.page * body.count,
      limit: body.count,
    });
    return r.map((e) => this.formatItem(e, body.extended));
  }

  @SubscribeMessage('findConversationWithUser')
  async findWithUser(
  @MessageBody() body: FindWithUserDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    if (body.externalId != null && body.localId != null) {
      throw new WsFormatException('Only one id must be passed');
    }

    let peer: string;

    if (body.externalId != null) {
      const r = await this.usersService.existsWithExternalId(body.service, body.externalId);
      if (r == null) {
        if (body.lastName == null || body.firstName == null) {
          throw new WsFormatException('Invalid data to create conversation');
        }

        const searchResults = await this.usersService.searchByExternalService(`${body.firstName} ${body.lastName}`);
        if (searchResults.length === 0) {
          throw new WsFormatException('User not found');
        }

        const user = await this.usersService.create({
          externalAccounts: [{ service: 'volsu', id: searchResults[0].externalId }],
          firstName: body.firstName,
          lastName: body.lastName,
        });

        peer = user._id.toString();
      }
    } else {
      if (body.localId === client.userId) {
        throw new WsFormatException('Ids must be different');
      }

      const found = await this.usersService.existsWithId(body.localId);
      if (found != null) {
        throw new WsFormatException('User not found');
      }

      peer = body.localId;
    }

    const list = await this.conversationsService.findByMembers([client.userId, peer], {
      type: ConversationType.direct,
    });

    const r: ConversationItem = { members: [peer, client.userId], type: ConversationType.direct };

    if (list == null || list.length === 0) {
      const created = await this.conversationsService.create(client.userId, {
        type: ConversationType.direct,
        members: [client.userId, peer],
      });

      r.id = created._id.toString();
    } else {
      r.id = list[0]._id.toString();
    }

    return r;
  }

  @SubscribeMessage('updateConversationName')
  async updateConversationName(
  @MessageBody() body: UpdateConversationNameDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    const hasAccess = await this.conversationsService.hasAccess(body.id, client.userId);
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
