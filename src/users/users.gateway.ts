import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse,
} from '@nestjs/websockets';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { ConfigService } from '@nestjs/config';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { PrivateCreateUser } from '@/users/dto/privateCreateUser';
import { UsersService } from './users.service';

import { ExternalSearchQueryDto } from './dto/externalSearchQuery.dto';
import { UpdateMeDto } from './dto/updateMe.dto';
import { FindByQueryDto } from './dto/findByQuery.dto';
import { FindByIdDto } from './dto/findById.dto';
import { ExternalSearchItem, UserItem } from './@types/users.types';

@WebSocketGateway(8080, {
  cors: true,
})
export class UsersGateway {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  // Приватный метод для создания пользователей
  @SubscribeMessage('createUser')
  async createUser(
  @MessageBody() body: PrivateCreateUser,
  ) {
    if (
      this.configService.get('PRIVATE_ROUTES_ENABLED') !== 'true'
      || body.secret !== this.configService.get('PRIVATE_ROUTES_SECRET')
    ) {
      throw new WsFormatException('Access denied');
    }

    const item = await this.usersService.create(body);
    return { id: item._id.toString() };
  }

  @SubscribeMessage('findUserById')
  async findOneUserHandler(
    @MessageBody() body: FindByIdDto,
  ): Promise<UserItem> {
    const result = await this.usersService.findById(body.id);
    if (result == null) {
      throw new WsFormatException('Not found');
    }

    return {
      id: result._id.toString(),
      firstName: result.firstName,
      lastName: result.lastName,
      tags: result.tags,
    };
  }

  @SubscribeMessage('findMe')
  async findMe(
    @ConnectedSocket() client: WebSocketEntity,
  ): Promise<UserItem> {
    const me = await this.usersService.findById(client.userId);

    // TODO: Реализовать когда-нибудь двухфакторную аутентификацию
    return {
      id: me._id.toString(),
      firstName: me.firstName,
      lastName: me.lastName,
      tags: me.tags,
    };
  }

  @SubscribeMessage('updateMe')
  async updateMe(
  @MessageBody() body: UpdateMeDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    return {};
  }

  @SubscribeMessage('findUsersByQuery')
  async search(
  @MessageBody() body: FindByQueryDto,
  ) {
    const r = await this.usersService.search(body.query, body.tags);
    return r.map((e) => ({
      id: e._id,
      firstName: e.firstName,
      lastName: e.lastName,
      tags: e.tags,
    }));
  }

  @SubscribeMessage('findExternalUsersByQuery')
  async externalSearch(
    @MessageBody() body: ExternalSearchQueryDto,
  ): Promise<
      WsResponse<Array<ExternalSearchItem>>
      > {
    const externalSearchResult = await this.usersService.searchByExternalService(body.query);

    return {
      event: 'get-access-token',
      data: externalSearchResult,
    };
  }
}
