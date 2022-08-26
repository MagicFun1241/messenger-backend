import { Reflector } from '@nestjs/core';
import {
  CanActivate, ExecutionContext, Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';

import { IS_PUBLIC_KEY } from './auth.public.decorator';

@Injectable()
export class AuthWsJwtGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<WebSocketEntity>();
    const event = this.reflector.get<string>('ws-message', context.getHandler());
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (client.tokenAccess) {
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
