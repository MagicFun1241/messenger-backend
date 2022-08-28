import { UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { AuthWsJwtGuard } from '@/authentication/guards/auth.ws-jwt.guard';
import { WsResponse } from '@/ws/interfaces/ws.response.interface';
import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';

import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
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

  @MessageMetaData('search-global-chats')
  @SubscribeMessage('search-global-chats')
  async globalSearchHandler(
    @MessageBody() messageBody: string,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<unknown>> {
    const searchGlobalChatsResult = await this.searchService.usersSearch(messageBody, client.userId);

    return {
      event: 'search-global-chats',
      data: {
        status: true,
        data: searchGlobalChatsResult,
      },
    };
  }
}
