import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

interface VerificationCode {
  code: string;
  expire: number;
}

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, VerificationCode> = new Map();
  private users: any[] = [
    { id: 1, account: 'admin', password: '123456', nickname: '管理员', phone: null, email: null, thirdPartyPlatform: null, thirdPartyOpenid: null },
    { id: 2, account: 'user', password: '123456', nickname: '用户', phone: null, email: null, thirdPartyPlatform: null, thirdPartyOpenid: null },
  ];

  private generateUserId(): number {
    const maxId = this.users.reduce((max, u) => Math.max(max, u.id), 0);
    return maxId + 1;
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateVerifyCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private validatePhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone);
  }

  private validateEmail(email: string): boolean {
    return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);
  }

  async sendCode(phone?: string, email?: string): Promise<{ code: string; expire: number; message: string } | null> {
    try {
      const code = this.generateVerifyCode();
      const expire = Date.now() + 300000;

      if (phone) {
        if (!this.validatePhone(phone)) {
          return null;
        }
        this.verificationCodes.set(phone, { code, expire });
        return {
          code,
          expire: 300,
          message: `验证码已发送至手机 ${phone.substring(0, 3)}****${phone.substring(7)}`
        };
      }

      if (email) {
        if (!this.validateEmail(email)) {
          return null;
        }
        this.verificationCodes.set(email, { code, expire });
        return {
          code,
          expire: 300,
          message: `验证码已发送至邮箱 ${email.substring(0, 3)}****${email.split('@')[0].substring(-3)}`
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async register(data: {
    account?: string;
    nickname?: string;
    password?: string;
    phone?: string;
    email?: string;
    verifyCode?: string;
    registerType: string;
  }): Promise<{ success: boolean; data?: any; message: string }> {
    try {
      if (data.registerType === 'account') {
        if (!data.account || !data.password) {
          return { success: false, message: '账号和密码不能为空' };
        }

        const existing = this.users.find(u => u.account === data.account);
        if (existing) {
          return { success: false, message: '账号已存在' };
        }

        const userId = this.generateUserId();
        this.users.push({
          id: userId,
          account: data.account,
          password: data.password,
          nickname: data.nickname || data.account,
          phone: null,
          email: null,
          thirdPartyPlatform: null,
          thirdPartyOpenid: null
        });

        return {
          success: true,
          data: { userId, account: data.account, nickname: data.nickname || data.account },
          message: '注册成功'
        };
      } else if (data.registerType === 'phone') {
        if (!data.phone || !data.verifyCode) {
          return { success: false, message: '手机号和验证码不能为空' };
        }

        const storedCode = this.verificationCodes.get(data.phone);
        if (!storedCode || storedCode.code !== data.verifyCode || storedCode.expire < Date.now()) {
          return { success: false, message: '验证码错误或已过期' };
        }
        this.verificationCodes.delete(data.phone);

        const existing = this.users.find(u => u.phone === data.phone);
        if (existing) {
          return { success: false, message: '该手机号已注册' };
        }

        const userId = this.generateUserId();
        this.users.push({
          id: userId,
          account: null,
          password: data.password || null,
          nickname: data.nickname || `用户${data.phone.substring(7)}`,
          phone: data.phone,
          email: null,
          thirdPartyPlatform: null,
          thirdPartyOpenid: null
        });

        return {
          success: true,
          data: { userId, phone: data.phone, nickname: data.nickname || `用户${data.phone.substring(7)}` },
          message: '注册成功'
        };
      } else if (data.registerType === 'email') {
        if (!data.email || !data.verifyCode) {
          return { success: false, message: '邮箱和验证码不能为空' };
        }

        const storedCode = this.verificationCodes.get(data.email);
        if (!storedCode || storedCode.code !== data.verifyCode || storedCode.expire < Date.now()) {
          return { success: false, message: '验证码错误或已过期' };
        }
        this.verificationCodes.delete(data.email);

        const existing = this.users.find(u => u.email === data.email);
        if (existing) {
          return { success: false, message: '该邮箱已注册' };
        }

        const userId = this.generateUserId();
        this.users.push({
          id: userId,
          account: null,
          password: data.password || null,
          nickname: data.nickname || data.email.split('@')[0],
          phone: null,
          email: data.email,
          thirdPartyPlatform: null,
          thirdPartyOpenid: null
        });

        return {
          success: true,
          data: { userId, email: data.email, nickname: data.nickname || data.email.split('@')[0] },
          message: '注册成功'
        };
      }

      return { success: false, message: '不支持的注册类型' };
    } catch (error) {
      return { success: false, message: '注册失败' };
    }
  }

  async login(data: {
    account?: string;
    password?: string;
    phone?: string;
    email?: string;
    verifyCode?: string;
    loginType: string;
  }): Promise<{ success: boolean; data?: any; message: string }> {
    try {
      if (data.loginType === 'account') {
        if (!data.account || !data.password) {
          return { success: false, message: '账号和密码不能为空' };
        }

        const user = this.users.find(u => u.account === data.account && u.password === data.password);
        if (!user) {
          return { success: false, message: '账号或密码错误' };
        }

        const token = this.generateToken();
        return {
          success: true,
          data: {
            token,
            userInfo: { userId: user.id, account: user.account, nickname: user.nickname },
            loginType: 'account'
          },
          message: '登录成功'
        };
      } else if (data.loginType === 'phone') {
        if (!data.phone || !data.verifyCode) {
          return { success: false, message: '手机号和验证码不能为空' };
        }

        const storedCode = this.verificationCodes.get(data.phone);
        if (!storedCode || storedCode.code !== data.verifyCode || storedCode.expire < Date.now()) {
          return { success: false, message: '验证码错误或已过期' };
        }
        this.verificationCodes.delete(data.phone);

        const user = this.users.find(u => u.phone === data.phone);
        if (!user) {
          return { success: false, message: '该手机号未注册' };
        }

        const token = this.generateToken();
        return {
          success: true,
          data: {
            token,
            userInfo: { userId: user.id, phone: user.phone, nickname: user.nickname },
            loginType: 'phone'
          },
          message: '登录成功'
        };
      } else if (data.loginType === 'email') {
        if (!data.email || !data.verifyCode) {
          return { success: false, message: '邮箱和验证码不能为空' };
        }

        const storedCode = this.verificationCodes.get(data.email);
        if (!storedCode || storedCode.code !== data.verifyCode || storedCode.expire < Date.now()) {
          return { success: false, message: '验证码错误或已过期' };
        }
        this.verificationCodes.delete(data.email);

        const user = this.users.find(u => u.email === data.email);
        if (!user) {
          return { success: false, message: '该邮箱未注册' };
        }

        const token = this.generateToken();
        return {
          success: true,
          data: {
            token,
            userInfo: { userId: user.id, email: user.email, nickname: user.nickname },
            loginType: 'email'
          },
          message: '登录成功'
        };
      }

      return { success: false, message: '不支持的登录类型' };
    } catch (error) {
      return { success: false, message: '登录失败' };
    }
  }

  async thirdPartyLogin(data: {
    platform: string;
    openId: string;
    nickname?: string;
    avatar?: string;
  }): Promise<{ success: boolean; data?: any; message: string; isNewUser?: boolean }> {
    try {
      if (!data.platform || !data.openId) {
        return { success: false, message: '平台和openId不能为空' };
      }

      let user = this.users.find(
        u => u.thirdPartyPlatform === data.platform && u.thirdPartyOpenid === data.openId
      );

      if (user) {
        const token = this.generateToken();
        return {
          success: true,
          data: {
            token,
            userInfo: { userId: user.id, nickname: user.nickname, avatar: user.avatar },
            loginType: `thirdparty_${data.platform}`,
            isNewUser: false
          },
          message: '登录成功',
          isNewUser: false
        };
      } else {
        const userId = this.generateUserId();
        const newNickname = data.nickname || `${data.platform}用户${Math.floor(Math.random() * 10000)}`;
        const newAvatar = data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

        this.users.push({
          id: userId,
          account: null,
          password: null,
          nickname: newNickname,
          phone: null,
          email: null,
          thirdPartyPlatform: data.platform,
          thirdPartyOpenid: data.openId,
          avatar: newAvatar
        });

        const token = this.generateToken();
        return {
          success: true,
          data: {
            token,
            userInfo: { userId, nickname: newNickname, avatar: newAvatar },
            loginType: `thirdparty_${data.platform}`,
            isNewUser: true
          },
          message: '注册成功',
          isNewUser: true
        };
      }
    } catch (error) {
      return { success: false, message: '第三方登录失败' };
    }
  }

  async bindPhone(phone: string, code: string): Promise<boolean> {
    const storedCode = this.verificationCodes.get(phone);
    if (!storedCode || storedCode.code !== code || storedCode.expire < Date.now()) {
      return false;
    }
    this.verificationCodes.delete(phone);
    return true;
  }

  async bindEmail(email: string, code: string): Promise<boolean> {
    const storedCode = this.verificationCodes.get(email);
    if (!storedCode || storedCode.code !== code || storedCode.expire < Date.now()) {
      return false;
    }
    this.verificationCodes.delete(email);
    return true;
  }

  async resetPassword(data: {
    phone?: string;
    email?: string;
    code: string;
    newPassword: string;
  }): Promise<boolean> {
    if (data.phone) {
      const storedCode = this.verificationCodes.get(data.phone);
      if (!storedCode || storedCode.code !== data.code || storedCode.expire < Date.now()) {
        return false;
      }
      this.verificationCodes.delete(data.phone);

      const user = this.users.find(u => u.phone === data.phone);
      if (user) {
        user.password = data.newPassword;
        return true;
      }
      return false;
    } else if (data.email) {
      const storedCode = this.verificationCodes.get(data.email);
      if (!storedCode || storedCode.code !== data.code || storedCode.expire < Date.now()) {
        return false;
      }
      this.verificationCodes.delete(data.email);

      const user = this.users.find(u => u.email === data.email);
      if (user) {
        user.password = data.newPassword;
        return true;
      }
      return false;
    }
    return false;
  }
}
