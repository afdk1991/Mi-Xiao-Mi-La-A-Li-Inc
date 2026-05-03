import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private users = [
    { id: 1, account: 'admin', password: '123456', nickname: '管理员' },
    { id: 2, account: 'user', password: '123456', nickname: '用户' },
  ];

  async findAll() {
    return this.users.map(({ password, ...rest }) => rest);
  }

  async findById(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async register(data: { account: string; password: string; nickname?: string }) {
    const id = this.users.length + 1;
    this.users.push({ id, ...data });
    return true;
  }

  async login(account: string, password: string) {
    const user = this.users.find((u) => u.account === account && u.password === password);
    if (user) {
      return crypto.randomBytes(32).toString('hex');
    }
    return null;
  }
}
