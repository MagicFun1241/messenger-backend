import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket, MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WsFilterException } from '@/ws/exceptions/ws.filter.exception';
import { MessageMetaData } from '@/ws/ws.message-meta-data.decorator';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { AuthenticationService } from './auth.service';
import { AuthWsJwtGuard } from './guards/auth.ws-jwt.guard';
import { AuthTokenExternalDto } from './dto/auth.token-external.dto';

@WebSocketGateway(8080, { cors: true })
export class AuthenticationGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(AuthenticationGateway.name);

  constructor(
    private readonly authService: AuthenticationService,
  ) {}

  @UseFilters(WsFilterException)
  @SubscribeMessage('get-access-token')
  async getAccessTokenHandler(
    @MessageBody() messageBody: AuthTokenExternalDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<unknown>> {
    const accessToken = await this.authService.createSession(
      messageBody.tokenExternal,
      client.remoteAddress,
      'get-access-token',
    );
    return {
      event: 'get-access-token',
      data: {
        accessToken,
      },
    };
  }

  @UseFilters(WsFilterException)
  @SubscribeMessage('auth')
  async authHandler(
    @MessageBody() messageBody: AuthTokenExternalDto,
      @ConnectedSocket() client: WebSocketEntity,
  ): Promise<WsResponse<{ status: boolean }>> {
    const result = await this.authService.setTokenAccessToConnection(client, messageBody.tokenExternal);
    return {
      event: 'auth',
      data: {
        status: result,
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

  handleDisconnect(@ConnectedSocket() client: WebSocketEntity) {
    this.authService.deleteConnectionFromState(client);
  }
}