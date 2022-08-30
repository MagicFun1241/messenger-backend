import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { pack } from 'msgpackr';
import { WsFormatExceptionInterface } from '../interfaces/ws.format-exception.interface';

@Catch()
export class WsFilterException extends BaseWsExceptionFilter {
  catch(exception: { error: WsFormatExceptionInterface, message: string }, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<WebSocketEntity>();

    if (exception.error) {
      client.send(pack({
        event: exception.error.event,
        data: {
          status: false,
          errors: exception.error.message,
        },
      }));

      if (exception.error.isCloseWs && exception.error.code) {
        client.close(exception.error.code);
      }
    } else {
      client.send(pack({
        event: 'exception',
        data: {
          status: false,
          errors: exception.message,
        },
      }));
    }
  }
}
