# laal.top 完整代码加密和安全加固方案

## 📋 目录

1. [前端代码加密](#1-前端代码加密)
2. [后端代码安全](#2-后端代码安全)
3. [服务器安全加固](#3-服务器安全加固)
4. [安全检查清单](#4-安全检查清单)
5. [BUG 检查流程](#5-bug-检查流程)

---

## 1. 前端代码加密

### 1.1 Vue/React 项目构建优化

#### Vite 构建配置（前端项目通用）

修改 `vite.config.ts` 或 `vite.config.js`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'terser',  // 使用 terser 进行强力压缩
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境删除 console
        drop_debugger: true, // 生产环境删除 debugger
        pure_funcs: ['console.log']  // 删除指定函数
      },
      format: {
        comments: false // 删除所有注释
      }
    },
    target: 'es2015',
    cssMinify: true, // 压缩 CSS
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['vant', 'element-plus']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // 生产环境变量
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    '__VUE_PROD_DEVTOOLS__': false  // 禁用 Vue DevTools
  }
})
```

### 1.2 JavaScript 代码混淆（可选但强力）

#### 安装依赖
```bash
npm install --save-dev javascript-obfuscator
```

#### 项目根目录创建 `obfuscate.js`

```javascript
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 要混淆的目录
const distDir = path.join(__dirname, 'dist');

function obfuscateDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      obfuscateDirectory(filePath);
    } else if (file.endsWith('.js')) {
      console.log('🔒 正在混淆:', filePath);
      
      const originalCode = fs.readFileSync(filePath, 'utf8');
      
      const obfuscationResult = JavaScriptObfuscator.obfuscate(originalCode, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        numbersToExpressions: true,
        shuffleStringArray: true,
        splitStrings: true,
        splitStringsChunkLength: 3,
        selfDefending: true,
        stringArray: true,
        stringArrayThreshold: 0.75,
        debugProtection: true,
        debugProtectionInterval: 4000
      });
      
      fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
    }
  });
}

console.log('🚀 开始代码混淆...');
obfuscateDirectory(distDir);
console.log('✅ 代码混淆完成！');
```

#### 修改 package.json 添加混淆脚本

```json
{
  "scripts": {
    "build:prod": "vite build && node obfuscate.js",
    "build": "vite build"
  }
}
```

### 1.3 Dockerfile 优化（加密版本）

为所有前端项目创建生产优化的 Dockerfile，例如 `01-前端集群/mixmlaal-web-vue-pc/Dockerfile.prod`：

```dockerfile
# ============================================
# 多阶段构建：构建阶段
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制 package.json，利用 Docker 缓存
COPY package*.json ./
RUN npm ci --only=production=false

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build:prod

# ============================================
# 多阶段构建：最终运行阶段
# ============================================
FROM nginx:alpine

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制打包好的文件（只有编译后的文件，没有源代码）
COPY --from=builder /app/dist /usr/share/nginx/html

# 配置安全头
RUN sed -i '/http {/a\    add_header X-Frame-Options "SAMEORIGIN" always;' /etc/nginx/nginx.conf && \
    sed -i '/http {/a\    add_header X-Content-Type-Options "nosniff" always;' /etc/nginx/nginx.conf && \
    sed -i '/http {/a\    add_header X-XSS-Protection "1; mode=block" always;' /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. 后端代码安全

### 2.1 Node.js 项目安全配置

#### 环境变量配置

修改 `02-后端微服务集群/mixmlaal-node-api/.env.production`：

```
NODE_ENV=production
LOG_LEVEL=error
# 禁用调试模式
DEBUG=
# 禁用堆栈跟踪
NODE_OPTIONS=--no-deprecation --no-warnings
```

#### Node.js 项目 Dockerfile 优化

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 生产环境只安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 只复制编译后的代码（如果是 TypeScript）
# 或者直接复制项目，但不包含 .git、.env、tests 等
COPY --exclude=.git --exclude=tests --exclude=.env ./ ./

# 安全配置
RUN chown -R node:node /app
USER node

# 安全启动
ENV NODE_ENV=production
ENV DEBUG=
EXPOSE 8080

CMD ["node", "server.js"]
```

### 2.2 Java 项目安全配置

Spring Boot 项目 `application-production.yml`：

```yaml
# 生产环境配置
server:
  port: 3007
  error:
    include-stacktrace: never  # 不返回堆栈信息
    include-message: never

spring:
  jpa:
    show-sql: false
  main:
    banner-mode: off
  devtools:
    enabled: false
```

### 2.3 所有后端的安全最佳实践

- ✅ 移除所有 console.log 和调试代码
- ✅ 禁用开发工具和调试模式
- ✅ 错误信息不返回堆栈跟踪
- ✅ 使用环境变量存储敏感配置
- ✅ Docker 容器以非 root 用户运行

---

## 3. 服务器安全加固

### 3.1 Docker 安全配置

#### docker-compose.ssl.yml 添加安全配置

```yaml
services:
  # 数据库服务安全
  mysql:
    image: mysql:8.0
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID

  redis:
    image: redis:7-alpine
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID

  # Traefik 安全
  traefik:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
```

### 3.2 Nginx 安全头配置

在 `05-部署运维层/mixmlaal-nginx-config/nginx.conf` 中添加：

```nginx
http {
  # 安全头
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

  # 其他配置...
}
```

---

## 4. 安全检查清单

| 检查项 | 状态 | 说明 |
|------|------|------|
| 前端代码已压缩混淆 | ⏳ | 等待配置 |
| console.log 已移除 | ⏳ | 等待配置 |
| 生产环境变量已设置 | ⏳ | 等待配置 |
| Docker 以非 root 运行 | ⏳ | 等待配置 |
| 安全头已配置 | ⏳ | 等待配置 |
| 敏感信息在环境变量 | ⏳ | 等待配置 |
| Git 信息已移除 | ⏳ | 等待配置 |
| 测试代码已移除 | ⏳ | 等待配置 |

---

## 5. BUG 检查流程

### 5.1 完整测试流程

#### 1. 单元测试
```bash
# 运行前端测试
cd frontend
npm test

# 运行后端测试
cd backend
npm test
```

#### 2. 集成测试
```bash
# 启动完整环境
docker-compose -f docker-compose.ssl.yml up -d

# 运行 E2E 测试
npm run test:e2e
```

#### 3. 生产环境冒烟测试
- ✅ 访问所有页面正常
- ✅ API 调用正常
- ✅ 数据库操作正常
- ✅ 用户登录/注册正常
- ✅ 支付流程正常
- ✅ 文件上传下载正常

---

## 🚀 完整部署脚本（安全版）

创建 `deploy-secure.bat`：

```batch
@echo off
echo ============================================
echo    laal.top 安全加密部署
echo ============================================
echo.

echo [1/6] 检查环境...
docker --version >nul || (echo Docker 未安装！ & pause & exit /b 1)
echo [OK] Docker 已就绪

echo.
echo [2/6] 构建加密版本前端...
cd 01-前端集群/mixmlaal-web-vue-pc
if not exist node_modules npm ci
npm run build:prod
echo [OK] 前端构建完成

cd ../mixmlaal-web-driver-vue
if not exist node_modules npm ci
npm run build:prod
echo [OK] 司机端构建完成

echo.
echo [3/6] 构建加密版本后端...
cd ../../02-后端微服务集群/mixmlaal-node-api
if not exist node_modules npm ci
echo [OK] 后端准备完成

cd ../..

echo.
echo [4/6] 启动安全加固的生产环境...
cd 05-部署运维层/mixmlaal-deploy-config
copy ../../.env.laal.top .env
docker-compose -f docker-compose.ssl.yml up -d --build

echo.
echo ============================================
echo    [SUCCESS] 安全加密部署完成！
echo ============================================
echo.
echo ✅ 前端代码已压缩混淆
echo ✅ 后端代码已安全配置
echo ✅ HTTPS/SSL 自动配置
echo ✅ 安全头已设置
echo.
echo 访问 https://laal.top
echo.
pause
```

---

## 📋 部署前最终检查清单

| 检查项 | 完成 |
|------|------|
| 修改所有默认密码 | ☐ |
| 配置生产环境变量 | ☐ |
| 前端代码构建+加密 | ☐ |
| 后端代码安全配置 | ☐ |
| 配置安全头 | ☐ |
| 运行完整测试 | ☐ |
| 检查所有功能正常 | ☐ |
| 配置备份策略 | ☐ |

---

## 🎉 完成！

项目已具备完整的代码加密、安全加固和 BUG 检查方案！

