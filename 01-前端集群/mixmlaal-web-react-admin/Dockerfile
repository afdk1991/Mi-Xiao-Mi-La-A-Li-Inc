# ============================================
# React 管理后台 Dockerfile
# ============================================

# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build --legacy-peer-deps

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/build /usr/share/nginx/admin

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]