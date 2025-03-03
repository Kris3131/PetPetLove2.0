import { WebSocket } from 'ws';

import logger from './logger';

class WebSocketManager {
  private clients = new Map<string, WebSocket>();

  registerClient(userId: string, ws: WebSocket): void {
    this.clients.set(userId, ws);
    logger.info(`[WebSocket]: User ${userId} registered`);
  }

  getClient(userId: string): WebSocket | undefined {
    return this.clients.get(userId);
  }

  removeClient(userId: string): boolean {
    const result = this.clients.delete(userId);
    if (result) {
      logger.info(`[WebSocket]: User ${userId} unregistered`);
    }
    return result;
  }

  isClientConnected(userId: string): boolean {
    const ws = this.clients.get(userId);
    return ws !== undefined && ws.readyState === WebSocket.OPEN;
  }

  checkClientConnection(userId: string): boolean {
    const ws = this.clients.get(userId);
    if (ws) {
      return ws.readyState === WebSocket.OPEN;
    }
    return false;
  }

  findAndRemoveClient(ws: WebSocket): void {
    this.clients.forEach((client, userId) => {
      if (client === ws) {
        this.removeClient(userId);
      }
    });
  }

  getConnectedClientIds(): string[] {
    const connectedIds: string[] = [];
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        connectedIds.push(userId);
      }
    });
    return connectedIds;
  }

  dumpClientIds(): void {
    logger.info('[WebSocket] All registered client IDs:');
    this.clients.forEach((_, id) => {
      logger.info(`- ${id}`);
    });
  }
}

export const webSocketManager = new WebSocketManager();
