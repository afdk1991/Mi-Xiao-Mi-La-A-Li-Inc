import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface User {
  id: string;
  username: string;
  avatar?: string;
  socketId: string;
}

interface Message {
  id: string;
  from: string;
  to?: string;
  content: string;
  type: 'private' | 'group' | 'system';
  timestamp: Date;
  read: boolean;
}

@WebSocketGateway(8003, {
  cors: {
    origin: '*',
    credentials: true
  },
  namespace: '/im'
})
export class ImGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ImGateway');
  private onlineUsers: Map<string, User> = new Map();
  private userSockets: Map<string, string> = new Map();
  private messageHistory: Message[] = [];

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.userSockets.delete(userId);

        this.server.emit('userOffline', {
          userId,
          timestamp: new Date()
        });

        break;
      }
    }
  }

  @SubscribeMessage('login')
  handleLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; username: string; avatar?: string }
  ) {
    const user: User = {
      id: data.userId,
      username: data.username,
      avatar: data.avatar,
      socketId: client.id
    };

    this.onlineUsers.set(data.userId, user);
    this.userSockets.set(data.userId, client.id);

    client.emit('loginSuccess', {
      user,
      onlineUsers: Array.from(this.onlineUsers.values()),
      messageHistory: this.messageHistory.slice(-50)
    });

    this.server.emit('userOnline', {
      user,
      timestamp: new Date()
    });

    this.logger.log(`User logged in: ${data.username}`);

    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to?: string; content: string; type: 'private' | 'group' | 'system' }
  ) {
    const sender = this.findUserBySocketId(client.id);
    if (!sender) {
      return { success: false, message: 'User not found' };
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: sender.id,
      to: data.to,
      content: data.content,
      type: data.type,
      timestamp: new Date(),
      read: false
    };

    this.messageHistory.push(message);

    if (this.messageHistory.length > 1000) {
      this.messageHistory = this.messageHistory.slice(-500);
    }

    if (data.type === 'private' && data.to) {
      const recipientSocket = this.userSockets.get(data.to);
      if (recipientSocket) {
        this.server.to(recipientSocket).emit('newMessage', message);
      }
      client.emit('messageSent', message);
    } else {
      this.server.emit('newMessage', message);
    }

    this.logger.log(`Message sent from ${sender.username}: ${data.content}`);

    return { success: true, message };
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    return {
      success: true,
      onlineUsers: Array.from(this.onlineUsers.values())
    };
  }

  @SubscribeMessage('getMessageHistory')
  handleGetMessageHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { page?: number; pageSize?: number }
  ) {
    const page = data.page || 1;
    const pageSize = data.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      success: true,
      messages: this.messageHistory.slice(start, end),
      total: this.messageHistory.length,
      page,
      pageSize
    };
  }

  @SubscribeMessage('markAsRead')
  handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string }
  ) {
    const message = this.messageHistory.find(m => m.id === data.messageId);
    if (message) {
      message.read = true;
      return { success: true };
    }
    return { success: false, message: 'Message not found' };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; isTyping: boolean }
  ) {
    const sender = this.findUserBySocketId(client.id);
    if (!sender) {
      return { success: false };
    }

    const recipientSocket = this.userSockets.get(data.to);
    if (recipientSocket) {
      this.server.to(recipientSocket).emit('userTyping', {
        from: sender.id,
        username: sender.username,
        isTyping: data.isTyping
      });
    }

    return { success: true };
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string }
  ) {
    client.join(`group_${data.groupId}`);
    return { success: true, groupId: data.groupId };
  }

  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string }
  ) {
    client.leave(`group_${data.groupId}`);
    return { success: true, groupId: data.groupId };
  }

  @SubscribeMessage('sendGroupMessage')
  handleSendGroupMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string; content: string }
  ) {
    const sender = this.findUserBySocketId(client.id);
    if (!sender) {
      return { success: false, message: 'User not found' };
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: sender.id,
      to: data.groupId,
      content: data.content,
      type: 'group',
      timestamp: new Date(),
      read: false
    };

    this.messageHistory.push(message);
    this.server.to(`group_${data.groupId}`).emit('newGroupMessage', message);

    return { success: true, message };
  }

  private findUserBySocketId(socketId: string): User | undefined {
    for (const user of this.onlineUsers.values()) {
      if (user.socketId === socketId) {
        return user;
      }
    }
    return undefined;
  }
}
