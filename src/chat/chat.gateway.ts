/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket'] }) // Enable CORS for frontend connection
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway');

  private activeUsers: Set<string> = new Set();

  server: Server;

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { sender: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(`Received message from ${data.sender}: ${data.message}`);
    this.server.emit('message', data); // Broadcast message to all clients
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Client ${username} joined the chat`);
    this.activeUsers.add(username);
    client.emit('joined', { username, message: 'Welcome to the chat!' });
    this.server.emit('activeUsers', Array.from(this.activeUsers));
  }

  @SubscribeMessage('leave')
  handleLeave(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.activeUsers.delete(username);
    this.server.emit('activeUsers', Array.from(this.activeUsers));
  }
}
