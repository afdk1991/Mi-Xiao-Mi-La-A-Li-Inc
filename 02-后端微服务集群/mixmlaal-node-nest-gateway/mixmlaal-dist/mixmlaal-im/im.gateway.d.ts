import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
export declare class ImGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private onlineUsers;
    private userSockets;
    private messageHistory;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleLogin(client: Socket, data: {
        userId: string;
        username: string;
        avatar?: string;
    }): {
        success: boolean;
    };
    handleSendMessage(client: Socket, data: {
        to?: string;
        content: string;
        type: 'private' | 'group' | 'system';
    }): {
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message: Message;
    };
    handleGetOnlineUsers(client: Socket): {
        success: boolean;
        onlineUsers: User[];
    };
    handleGetMessageHistory(client: Socket, data: {
        page?: number;
        pageSize?: number;
    }): {
        success: boolean;
        messages: Message[];
        total: number;
        page: number;
        pageSize: number;
    };
    handleMarkAsRead(client: Socket, data: {
        messageId: string;
    }): {
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    };
    handleTyping(client: Socket, data: {
        to: string;
        isTyping: boolean;
    }): {
        success: boolean;
    };
    handleJoinGroup(client: Socket, data: {
        groupId: string;
    }): {
        success: boolean;
        groupId: string;
    };
    handleLeaveGroup(client: Socket, data: {
        groupId: string;
    }): {
        success: boolean;
        groupId: string;
    };
    handleSendGroupMessage(client: Socket, data: {
        groupId: string;
        content: string;
    }): {
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message: Message;
    };
    private findUserBySocketId;
}
export {};
