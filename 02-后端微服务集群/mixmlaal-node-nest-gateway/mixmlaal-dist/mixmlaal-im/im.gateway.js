"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let ImGateway = class ImGateway {
    constructor() {
        this.logger = new common_1.Logger('ImGateway');
        this.onlineUsers = new Map();
        this.userSockets = new Map();
        this.messageHistory = [];
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
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
    handleLogin(client, data) {
        const user = {
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
    handleSendMessage(client, data) {
        const sender = this.findUserBySocketId(client.id);
        if (!sender) {
            return { success: false, message: 'User not found' };
        }
        const message = {
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
        }
        else {
            this.server.emit('newMessage', message);
        }
        this.logger.log(`Message sent from ${sender.username}: ${data.content}`);
        return { success: true, message };
    }
    handleGetOnlineUsers(client) {
        return {
            success: true,
            onlineUsers: Array.from(this.onlineUsers.values())
        };
    }
    handleGetMessageHistory(client, data) {
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
    handleMarkAsRead(client, data) {
        const message = this.messageHistory.find(m => m.id === data.messageId);
        if (message) {
            message.read = true;
            return { success: true };
        }
        return { success: false, message: 'Message not found' };
    }
    handleTyping(client, data) {
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
    handleJoinGroup(client, data) {
        client.join(`group_${data.groupId}`);
        return { success: true, groupId: data.groupId };
    }
    handleLeaveGroup(client, data) {
        client.leave(`group_${data.groupId}`);
        return { success: true, groupId: data.groupId };
    }
    handleSendGroupMessage(client, data) {
        const sender = this.findUserBySocketId(client.id);
        if (!sender) {
            return { success: false, message: 'User not found' };
        }
        const message = {
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
    findUserBySocketId(socketId) {
        for (const user of this.onlineUsers.values()) {
            if (user.socketId === socketId) {
                return user;
            }
        }
        return undefined;
    }
};
exports.ImGateway = ImGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ImGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('login'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleLogin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineUsers'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getMessageHistory'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleGetMessageHistory", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinGroup'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleJoinGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveGroup'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleLeaveGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendGroupMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ImGateway.prototype, "handleSendGroupMessage", null);
exports.ImGateway = ImGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8003, {
        cors: {
            origin: '*',
            credentials: true
        },
        namespace: '/im'
    })
], ImGateway);
//# sourceMappingURL=im.gateway.js.map