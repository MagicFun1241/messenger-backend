import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { PickOnly } from '@/helpers';
import { UserDocument } from '@/users/schemas/user.schema';
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
    const result = await this.usersService.findOne(id);
    return {
      id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
    };
  }

  @SubscribeMessage('findMe')
  async findMe(): Promise<PickOnly<UserDocument, 'firstName' | 'lastName' | 'photo'>> {
    return null;
  }
}
