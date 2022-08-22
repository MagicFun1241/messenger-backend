import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { UsersService } from './users.service';
import { FindOneUserDto } from './dto/find-one-user.dto';

@WebSocketGateway(8080, {
  cors: true,
})
export class UsersGateway {
  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('findOneUser')
  async findOneUserHandler(
    @MessageBody() id: string,
  ): Promise<FindOneUserDto & { id: string }> {
    const result = await this.usersService.findById(id);
    return {
      id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
    };
  }

  @SubscribeMessage('findMe')
  async findMe(
    @ConnectedSocket() client: WebSocketEntity,
  ): Promise<any> {
    const me = await this.usersService.findById(client.id);

    // TODO: Реализовать когда-нибудь двухфакторную аутентификацию
    return {
      id: me._id,
      firstName: me.firstName,
      lastName: me.lastName,
    };
  }
}
