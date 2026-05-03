import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Result } from '../common/result';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  async findAll() {
    const users = await this.userService.findAll();
    return Result.success(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(parseInt(id));
    return Result.success(user);
  }

  @Post('register')
  async register(@Body() body: { account: string; password: string; nickname?: string }) {
    await this.userService.register(body);
    return Result.success(null, '注册成功');
  }

  @Post('login')
  async login(@Body() body: { account: string; password: string }) {
    const token = await this.userService.login(body.account, body.password);
    if (token) {
      return Result.success({ token }, '登录成功');
    }
    return Result.fail('账号或密码错误');
  }
}
