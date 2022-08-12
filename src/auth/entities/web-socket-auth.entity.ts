import { WebSocket } from 'ws';

export class WebSocketAuthEntity extends WebSocket {
  public auth: string | undefined;
}
