import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';

import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsResponse } from '@/ws/interfaces/ws.response.interface';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';

import { AuthWsJwtGuard } from '@/authentication/guards/auth.ws-jwt.guard';

import { SearchService } from './search.service';

@WebSocketGateway(8080, {
  cors: true,
})
export class SearchGateway {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @UseFilters(WsFilterException)
  @UseGuards(AuthWsJwtGuard)
  @MessageMetaData('auth-test')
  @SubscribeMessage('auth-test')
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
