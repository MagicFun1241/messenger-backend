import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { CreateMessageDto } from '@/messages/dto/createMessage';
import { UsersService } from '@/users/users.service';

@WebSocketGateway(8080, {
  cors: true,
})
export class MessagesGateway {
  constructor(private readonly usersService: UsersService) {
  }

  @UseFilters(WsFilterException)
  @SubscribeMessage('post-message')
  async postMessage(@MessageBody() messageBody: CreateMessageDto) {

  }
}
