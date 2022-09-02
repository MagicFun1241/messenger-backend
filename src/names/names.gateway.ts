import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { NamesService } from '@/names/names.service';
import { ResolveNameDto } from '@/names/dto/resolve.dto';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { UpdateShortnameDto } from '@/names/dto/update.dto';

@WebSocketGateway(8080, {
  cors: true,
})
export class NamesGateway {
  constructor(
    private readonly namesService: NamesService,
  ) {}

  @SubscribeMessage('change-short-name')
  async updateMy(
  @MessageBody() body: UpdateShortnameDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    try {
      if (body.botId == null) {
        await this.namesService.updateForUser(client.userId, body.value);
      } // Иначе меняем имя для бота
    } catch (e) {
      throw new WsFormatException('Name already taken');
    }
  }

  @SubscribeMessage('resolve-short-name')
  async resolveByValue(@MessageBody() body: ResolveNameDto) {
    const item = await this.namesService.findByValue(body.value);
    if (item.user != null) {
      return {
        user: {
          id: item.user._id.toString(),
        },
      };
    }

    return { unknown: null };
  }
}
