"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let UserService = class UserService {
    constructor() {
        this.users = [
            { id: 1, account: 'admin', password: '123456', nickname: '管理员' },
            { id: 2, account: 'user', password: '123456', nickname: '用户' },
        ];
    }
    async findAll() {
        return this.users.map(({ password, ...rest }) => rest);
    }
    async findById(id) {
        const user = this.users.find((u) => u.id === id);
        if (user) {
            const { password, ...rest } = user;
            return rest;
        }
        return null;
    }
    async register(data) {
        const id = this.users.length + 1;
        this.users.push({ id, ...data });
        return true;
    }
    async login(account, password) {
        const user = this.users.find((u) => u.account === account && u.password === password);
        if (user) {
            return crypto.randomBytes(32).toString('hex');
        }
        return null;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map