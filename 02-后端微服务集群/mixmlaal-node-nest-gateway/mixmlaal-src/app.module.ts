import { Module } from '@nestjs/common';
import { ImModule } from './im/im.module';
import { AuthModule } from './auth/auth.module';
import { ProxyMiddleware } from './gateway/proxy.middleware';

@Module({
  imports: [ImModule, AuthModule],
  controllers: [],
  providers: [ProxyMiddleware],
})
export class AppModule {}
