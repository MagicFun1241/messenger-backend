import {
  Logger, UseFilters, UseGuards, UseInterceptors,
} from '@nestjs/common';

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
import { UserApiFormattingInterceptor } from '@/names/interceptors/user-api-formatting.interceptor';
import { UserDocument } from '@/users/schemas/user.schema';
import { UsersService } from './users.service';

import { UpdateMeDto } from './dto/updateMe.dto';
import { FindByQueryDto } from './dto/findByQuery.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';

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
  ): Promise<WsResponse<UserDocument>> {
    const user = await this.usersService.findById(body.id);
    if (!user) {
      throw new WsFormatException({ event: 'get-user-by-id', message: 'User not found' });
    }

    return {
      event: 'get-user-by-id',
      data: {
        status: true,
        data: user,
      },
    };
  }

  @UseInterceptors(UserApiFormattingInterceptor)
  @SubscribeMessage('get-me')
  async findCurrent(
    @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<UserDocument>> {
    const me = await this.usersService.findById(client.userId);

    // TODO: Реализовать когда-нибудь двухфакторную аутентификацию
    return {
      event: 'get-me',
      data: {
        status: true,
        data: me,
      },
    };
  }

  @SubscribeMessage('update-me')
  async updateMe(
  @MessageBody() body: UpdateMeDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    return {};
  }
}
