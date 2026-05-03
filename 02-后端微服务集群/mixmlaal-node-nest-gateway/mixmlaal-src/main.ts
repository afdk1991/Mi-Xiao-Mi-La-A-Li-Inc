import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  const port = process.env.SERVER_PORT || 8002;
  await app.listen(port);
  console.log(`NestJS网关服务运行在: http://localhost:${port}`);
  console.log(`WebSocket端点: ws://localhost:${port}/im`);
}

bootstrap();
