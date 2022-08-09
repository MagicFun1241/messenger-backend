import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

@Injectable()
export class WsAdapterService {
  /**
   * 0 — guest
   *
   * 1-∞ — authorized users id
   * */
  private socketState = new Map<number, WebSocket>();

  public get(userId: number): WebSocket | undefined {
    const webSockets = this.socketState.get(userId);
    return this.socketState.get(userId);
  }
}
