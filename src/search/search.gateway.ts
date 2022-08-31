import { UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { ApiUserSearch } from '@/users/@types/api/users.types';

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

  @MessageMetaData('search-global-users')
  @SubscribeMessage('search-global-users')
  async globalSearchUsersHandler(
    @MessageBody() body: string,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<ApiUserSearch[]>> {
    const searchGlobalUsersResult = await this.searchService.usersSearch(body, client.userId);

    return {
      event: 'search-global-users',
      data: {
        status: true,
        data: searchGlobalUsersResult,
      },
    };
  }

  @MessageMetaData('search-global-chats')
  @SubscribeMessage('search-global-chats')
  async globalSearchChatsHandler(
    @MessageBody() body: string,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<unknown>> {
    const searchGlobalChatsResult = [];

    return {
      event: 'search-global-chats',
      data: {
        status: true,
        data: searchGlobalChatsResult,
      },
    };
  }
}
