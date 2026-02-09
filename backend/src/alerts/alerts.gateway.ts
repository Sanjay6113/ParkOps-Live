import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AdminAlert } from '../entities/admin-alert.entity';

@WebSocketGateway({ namespace: '/admin-alerts', cors: true })
export class AlertsGateway {
  @WebSocketServer()
  server: Server;

  broadcastAlert(alert: AdminAlert) {
    this.server.emit('alert', alert);
  }

  // Simple ping for clients to verify connection
  @SubscribeMessage('ping')
  handlePing(@MessageBody() payload: string) {
    return { event: 'pong', data: payload ?? 'ok' };
  }
}