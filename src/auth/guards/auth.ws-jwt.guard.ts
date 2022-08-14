import { Reflector } from '@nestjs/core';
import {
  CanActivate, ExecutionContext, Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthWsJwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<WebSocketEntity>();
    const event = this.reflector.get<string>('ws-message', context.getHandler());

    if (await this.jwtService.verifyAsync(
      client.tokenAccess,
      { secret: this.configService.get<string>('TOKEN_ACCESS_SECRET') },
    )) {
      return true;
    }

    throw new WsFormatException({
      event,
      code: 3401,
      message: 'Token is invalid',
      isCloseWs: true,
    });
  }
}
