import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@WebSocketGateway(8080, {
  cors: true,
})
export class UsersGateway {
  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('findOneUser')
  async findOne(@MessageBody() id: number) {
    const result = await this.usersService.findOne(id);
    return result;
  }
}
