import { Logger, UseFilters, UseGuards } from '@nestjs/common';

import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';

import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { ConfigService } from '@nestjs/config';

import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';
import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { WsResponse } from '@/ws/interfaces/ws.response.interface';
import { AuthWsJwtGuard } from '@/authentication/guards/auth.ws-jwt.guard';
import { PrivateCreateUser } from '@/users/dto/privateCreateUser';
import { UsersService } from './users.service';

import { UpdateMeDto } from './dto/updateMe.dto';
import { FindByQueryDto } from './dto/findByQuery.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';

import { UserItem } from './@types/users.types';
import { ApiUser } from './@types/api/users.types';

@UseFilters(WsFilterException)
@UseGuards(AuthWsJwtGuard)
@WebSocketGateway(8080, {
  cors: true,
})
export class UsersGateway {
  private readonly logger = new Logger(UsersGateway.name);

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

  @MessageMetaData('get-user-by-id')
  @SubscribeMessage('get-user-by-id')
  async findOneUserHandler(
    @MessageBody() body: GetUserByIdDto,
  ): Promise<WsResponse<ApiUser>> {
    const user = await this.usersService.findById(body.id);
    if (!user) {
      throw new WsFormatException({ event: 'get-user-by-id', message: 'User not found' });
    }

    return {
      event: 'get-user-by-id',
      data: {
        status: true,
        data: {
          id: user._id.toString(),
          type: user.type,
          firstName: user.firstName,
          lastName: user.lastName,
          tags: user.tags,
        },
      },
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
}
