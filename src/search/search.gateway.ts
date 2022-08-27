import { UseFilters, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { AuthWsJwtGuard } from '@/authentication/guards/auth.ws-jwt.guard';
import { WsResponse } from '@/ws/interfaces/ws.response.interface';
import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';

import { SearchService } from './search.service';

@UseFilters(WsFilterException)
@UseGuards(AuthWsJwtGuard)
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
