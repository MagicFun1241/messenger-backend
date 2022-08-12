import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { PickOnly } from '@/helpers';
import { UserDocument } from '@/users/schemas/user.schema';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@WebSocketGateway(8080, {
  cors: true,
})
export class UsersGateway {
  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('findOneUser')
  async findOne(
    @MessageBody() id: string,
      @MessageBody() extended: boolean,
  ): Promise<PickOnly<UserDocument, 'id' | 'firstName' | 'lastName'>> {
    const result = await this.usersService.findOne(id);
    return {
      id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
    };
  }

  @SubscribeMessage('findMe')
  async findMe() {

  }
}
