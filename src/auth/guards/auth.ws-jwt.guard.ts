import { Reflector } from '@nestjs/core';
import {
  CanActivate, ExecutionContext, Injectable, Logger,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Observable } from 'rxjs';
import { WebSocketAuthEntity } from '@/auth/entities/web-socket-auth.entity';
import { WsFormatException } from '@/ws/exceptions/ws-format.exception';

@Injectable()
export class AuthWsJwtGuard implements CanActivate {
  private readonly logger = new Logger(AuthWsJwtGuard.name);

  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient<WebSocketAuthEntity>();
    const event = this.reflector.get<string>('ws-message', context.getHandler());
    if (client.auth === '1234') {
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
