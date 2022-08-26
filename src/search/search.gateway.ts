import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { WsResponse } from '@/ws/interfaces/ws.response.interface';
import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';

import { SearchService } from './search.service';

@WebSocketGateway(8080, {
  cors: true,
})
export class SearchGateway {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @MessageMetaData('global-search')
  @SubscribeMessage('global-search')
  async globalSearchHandler(
    @MessageBody() messageBody: string,
  ): Promise<WsResponse<string>> {
    return {
      event: 'global-search',
      data: {
        status: true,
        data: '',
      },
    };
  }
}
