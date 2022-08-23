import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { FindByQueryDto } from '@/users/dto/findByQuery.dto';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { UsersService } from './users.service';
import { FindByIdDto } from './dto/findById.dto';

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;

  photo?: string;
  tags: Array<string>;

  dateOfBirth?: Date;

  policy?: any;
}

@WebSocketGateway(8080, {
  cors: true,
})
export class UsersGateway {
  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('findUserById')
  async findOneUserHandler(
    @MessageBody() body: FindByIdDto,
  ): Promise<UserItem> {
    const result = await this.usersService.findById(body.id);
    if (result == null) {
      throw new WsFormatException('Not found');
    }

    return {
      id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      tags: result.tags,
    };
  }

  @SubscribeMessage('findMe')
  async findMe(
    @ConnectedSocket() client: WebSocketEntity,
  ): Promise<UserItem> {
    const me = await this.usersService.findById(client.id);

    // TODO: Реализовать когда-нибудь двухфакторную аутентификацию
    return {
      id: me._id,
      firstName: me.firstName,
      lastName: me.lastName,
      tags: me.tags,
    };
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
