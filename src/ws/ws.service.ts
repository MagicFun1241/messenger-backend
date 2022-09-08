import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { pack } from 'msgpackr';
import { WebSocketEntity } from './entities/ws.web-socket.entity';
import { WsStateValueInterface } from './interfaces/ws.state-value.interface';

@Injectable()
export class WsService {
  /**
   * 1-∞ — authorized users id
   * */
  private webSocketState = new Map<string, WsStateValueInterface[]>();

  // Пользователи, события которых мы будем отправлять
  private hotUsers = new Map<string, Set<string>>();

  public getConnectedWebSocketsByUserId(userId: string): WsStateValueInterface[] | undefined {
    const webSockets = this.webSocketState.get(userId);
    return webSockets;
  }

  public setConnectedWebSocketByUserId(userId: string, webSocket: WebSocketEntity): string {
    if (!this.webSocketState.has(userId)) {
      this.webSocketState.set(userId, []);
    }

    const id = randomUUID();

    this.webSocketState.get(userId).push({ id, client: webSocket });

    return id;
  }

  public emitHotUsers(userId: string, data: any) {
    if (!this.hotUsers.has(userId)) {
      return;
    }

    const list = this.hotUsers.get(userId);
    list.forEach((v) => {
      this.emitToAllUserSessions(v, data);
    });
  }

  public addHotUser(selfId: string, userId: string) {
    if (!this.hotUsers.has(selfId)) {
      this.hotUsers.set(selfId, new Set());
    }

    this.hotUsers.get(selfId).add(userId);
  }

  public emitToAllUserSessions(userId: string, data: any) {
    this.webSocketState.get(userId)?.forEach((item) => {
      item.client.send(pack(data));
    });
  }

  public deleteConnectedWebSocketByUserIdAndClientId(userId: string, clientId: string) {
    const connections = this.webSocketState.get(userId);

    if (connections) {
      const index = connections.findIndex((connection) => connection.id === clientId);

      if (index > -1) {
        const newConnections = connections.slice(index, 1);
        if (newConnections.length > 0) {
          this.webSocketState.set(userId, newConnections);
        } else {
          this.webSocketState.delete(userId);
        }

        return true;
      }
    }

    return false;
  }
}
