import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Result } from '../common/result';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body() body: { phone?: string; email?: string }) {
    if (!body.phone && !body.email) {
      return Result.fail('请提供手机号或邮箱', 400);
    }
    const result = await this.authService.sendCode(body.phone, body.email);
    if (result) {
      return Result.success(result, '验证码已发送');
    }
    return Result.fail('发送失败', 500);
  }

  @Post('register')
  async register(@Body() body: {
    account?: string;
    nickname?: string;
    password?: string;
    phone?: string;
    email?: string;
    verifyCode?: string;
    registerType: string;
  }) {
    const result = await this.authService.register(body);
    if (result.success) {
      return Result.success(result.data, result.message);
    }
    return Result.fail(result.message, 400);
  }

  @Post('login')
  async login(@Body() body: {
    account?: string;
    password?: string;
    phone?: string;
    email?: string;
    verifyCode?: string;
    loginType: string;
  }) {
    const result = await this.authService.login(body);
    if (result.success) {
      return Result.success(result.data, '登录成功');
    }
    return Result.fail(result.message, 401);
  }

  @Post('third-party-login')
  async thirdPartyLogin(@Body() body: {
    platform: string;
    openId: string;
    nickname?: string;
    avatar?: string;
  }) {
    const result = await this.authService.thirdPartyLogin(body);
    if (result.success) {
      return Result.success(result.data, result.isNewUser ? '注册成功' : '登录成功');
    }
    return Result.fail(result.message, 401);
  }

  @Get('third-party-url')
  async getThirdPartyUrl(@Query('platform') platform: string) {
    const urls = {
      wechat: 'https://open.weixin.qq.com/connect/qrconnect?appid=wx&response_type=code&redirect_uri=...',
      qq: 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101&redirect_uri=...',
      weibo: 'https://api.weibo.com/oauth2/authorize?response_type=code&client_id=123&redirect_uri=...',
      alipay: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021&scope=auth_user&redirect_uri=...',
      baidu: 'https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=...',
      douyin: 'https://open.douyin.com/oauth/authorize?client_key=...&redirect_uri=...',
      xiaomi: 'https://account.xiaomi.com/oauth2/authorize?client_id=...&redirect_uri=...',
      apple: 'https://appleid.apple.com/auth/authorize?client_id=...&redirect_uri=...'
    };

    if (!urls[platform]) {
      return Result.fail('不支持的第三方平台', 400);
    }

    return Result.success({ platform, url: urls[platform], message: '请使用此URL进行授权' });
  }

  @Post('logout')
  async logout() {
    return Result.success({ message: '登出成功' });
  }

  @Post('bind-phone')
  async bindPhone(@Body() body: { phone: string; code: string }) {
    const result = await this.authService.bindPhone(body.phone, body.code);
    if (result) {
      return Result.success({ message: '手机号绑定成功' });
    }
    return Result.fail('绑定失败', 400);
  }

  @Post('bind-email')
  async bindEmail(@Body() body: { email: string; code: string }) {
    const result = await this.authService.bindEmail(body.email, body.code);
    if (result) {
      return Result.success({ message: '邮箱绑定成功' });
    }
    return Result.fail('绑定失败', 400);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: {
    phone?: string;
    email?: string;
    code: string;
    newPassword: string;
  }) {
    const result = await this.authService.resetPassword(body);
    if (result) {
      return Result.success({ message: '密码重置成功' });
    }
    return Result.fail('密码重置失败', 400);
  }

  @Get('profile')
  async getProfile() {
    return Result.success({ userId: 1, account: 'admin', nickname: '管理员' });
  }
}
