import { WebSocket } from 'ws';

export class WebSocketEntity extends WebSocket {
  public userId: string | undefined;

  public socketId: string | undefined;

  public tokenAccess: string | undefined;

  public remoteAddress: string;
}
