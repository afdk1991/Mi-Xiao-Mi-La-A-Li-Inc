import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response } from 'express';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    // 转发Java微服务
    if (req.path.startsWith('/api/java')) {
      createProxyMiddleware({
        target: process.env.JAVA_GATEWAY_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/java': '' },
      })(req, res, next);
    }
    // 转发Python数据服务
    else if (req.path.startsWith('/api/python')) {
      createProxyMiddleware({
        target: process.env.PYTHON_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/python': '' },
      })(req, res, next);
    } else {
      next();
    }
  }
}
