import { WebSocket } from 'ws';

export class WebSocketEntity extends WebSocket {
  public id: string;

  public tokenAccess: string | undefined;

  public remoteAddress: string;
}
