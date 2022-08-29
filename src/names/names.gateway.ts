import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { NamesService } from '@/names/names.service';
import { ResolveNameDto } from '@/names/dto/resolve.dto';

@WebSocketGateway(8080, {
  cors: true,
})
export class NamesGateway {
  constructor(
    private readonly namesService: NamesService,
  ) {}

  @SubscribeMessage('resolveShortName')
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
