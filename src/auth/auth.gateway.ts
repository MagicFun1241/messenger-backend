import { UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { WsFilterException } from '@/ws/exceptions/ws-filter.exception';
import { MessageMetaData } from '@/ws/ws-message-meta-data.decorator';
import { AuthService } from './auth.service';
import { AuthWsJwtGuard } from './guards/auth.ws-jwt.guard';
import { WebSocketAuthEntity } from './entities/web-socket-auth.entity';

@WebSocketGateway(8081, { cors: true })
export class AuthGateway {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @SubscribeMessage('auth')
  authHandler(@ConnectedSocket() client: WebSocket): WsResponse<unknown> {
    AuthService.setAuthTokenToConnection((client as WebSocketAuthEntity), '1234');
    return {
      event: 'auth',
      data: {
        status: true,
      },
    };
  }

  @UseFilters(WsFilterException)
  @UseGuards(AuthWsJwtGuard)
  @MessageMetaData('auth-test')
  @SubscribeMessage('auth-test')
  authTestHandler(): WsResponse<unknown> {
    return {
      event: 'auth-test',
      data: {
        test: 'okay!',
      },
    };
  }
}
