# MIXMLAAL 司机端 - 生产部署指南

## 📋 目录
- [环境准备](#环境准备)
- [环境变量配置](#环境变量配置)
- [Docker 部署](#docker-部署)
- [Nginx 直接部署](#nginx-直接部署)
- [云服务器部署](#云服务器部署)
- [安全加固](#安全加固)
- [监控与运维](#监控与运维)
- [故障排查](#故障排查)

---

## 🔧 环境准备

### 系统要求
- **操作系统**: Linux (Ubuntu 20.04+ / CentOS 7+ / 麒麟操作系统)
- **内存**: 最低 2GB，推荐 4GB+
- **磁盘**: 最低 20GB 可用空间
- **网络**: 稳定的互联网连接

### 软件依赖
- **Docker & Docker Compose** (推荐)
  - Docker: 20.10+
  - Docker Compose: 2.0+
- **或使用 Nginx**
  - Nginx: 1.18+
  - Node.js: 18+ (仅构建需要)

---

## ⚙️ 环境变量配置

### 1. 复制环境变量模板
```bash
cp .env.example .env.production
```

### 2. 修改生产环境配置
编辑 `.env.production` 文件，关键配置项：

```bash
# API 地址（根据实际部署修改
VITE_API_BASE_URL=https://your-domain.com/api/v1

# 启用 HTTPS
VITE_USE_HTTPS=true

# 关闭调试
VITE_ENABLE_DEBUG=false
VITE_SHOW_CONSOLE=false
```

---

## 🐳 Docker 部署（推荐）

### 方案一：单容器部署

#### 1. 构建 Docker 镜像
```bash
# 进入项目目录
cd mixmlaal-web-driver-vue

# 构建镜像
docker build -t mixmlaal-driver:latest .
```

#### 2. 运行容器
```bash
docker run -d \
  --name mixmlaal-driver \
  -p 80:80 \
  --restart unless-stopped \
  mixmlaal-driver:latest
```

#### 3. 查看运行状态
```bash
docker ps
docker logs mixmlaal-driver
```

---

### 方案二：Docker Compose 部署

#### 1. 创建 `docker-compose.yml`
```yaml
version: '3.8'

services:
  driver-frontend:
    build: .
    container_name: mixmlaal-driver-frontend
    ports:
      - "80:80"
    networks:
      - mixmlaal-network
    depends_on:
      - driver-api
    restart: unless-stopped

  driver-api:
    image: mixmlaal-node-api:latest
    container_name: mixmlaal-driver-api
    ports:
      - "3000:3000"
    env_file:
      - ../.env.production
    networks:
      - mixmlaal-network
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: mixmlaal-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
    volumes:
      - mysql-data:/var/lib/mysql
      - ../04-数据库层/mixmlaal-mysql-sql/:/docker-entrypoint-initdb.d/
    networks:
      - mixmlaal-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: mixmlaal-redis
    volumes:
      - redis-data:/data
    networks:
      - mixmlaal-network
    restart: unless-stopped

volumes:
  mysql-data:
  redis-data:

networks:
  mixmlaal-network:
    driver: bridge
```

#### 2. 启动服务
```bash
# 进入部署目录
cd ../../05-部署运维层/mixmlaal-deploy-config

# 复制环境变量
cp ../../.env.example .env
# 编辑 .env，填入真实配置

# 启动所有服务
docker-compose -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 3. 停止服务
```bash
docker-compose -f docker-compose.prod.yml down
```

---

## 🌐 Nginx 直接部署

### 1. 构建项目
```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 2. 配置 Nginx

创建 `/etc/nginx/sites-available/mixmlaal-driver`：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/mixmlaal-driver/dist;
    index index.html;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Vue Router 支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 启用站点
```bash
# 复制构建产物
sudo cp -r dist /var/www/mixmlaal-driver/

# 启用站点
sudo ln -s /etc/nginx/sites-available/mixmlaal-driver /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## ☁️ 云服务器部署

### 推荐云服务商
- **阿里云**: 适合国内业务
- **腾讯云**: 适合国内业务
- **华为云**: 适合信创需求
- **AWS / Google Cloud**: 适合国际业务

### 部署步骤（以阿里云为例）

#### 1. 购买云服务器
- 配置: 2核 4GB 起步
- 操作系统: Ubuntu 22.04 LTS
- 带宽: 3Mbps+

#### 2. 配置安全组
开放以下端口：
- `80`: HTTP
- `443`: HTTPS
- `22`: SSH (仅开放给信任 IP)

#### 3. 连接服务器
```bash
ssh root@your-server-ip
```

#### 4. 安装 Docker
```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 安装 Docker Compose
apt install docker-compose -y

# 启动 Docker
systemctl enable docker
systemctl start docker
```

#### 5. 上传并部署
```bash
# 创建项目目录
mkdir -p /opt/mixmlaal
cd /opt/mixmlaal

# 上传项目文件（使用 scp 或 git clone）

# 启动服务
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔒 安全加固

### 1. HTTPS 配置

#### 使用 Let's Encrypt 免费证书
```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx -y

# 获取证书
certbot --nginx -d your-domain.com

# 自动续期
certbot renew --dry-run
```

#### 更新 nginx.conf 支持 HTTPS
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 其他配置同前...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. 防火墙配置
```bash
# 使用 UFW (Ubuntu)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 使用 firewalld (CentOS)
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload
```

### 3. 定期备份
```bash
# 创建备份脚本 /opt/mixmlaal/backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/mixmlaal/backups"

# 备份数据库
docker exec mixmlaal-mysql mysqldump -u root -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > $BACKUP_DIR/db_$DATE.sql

# 备份上传文件
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/mixmlaal-driver/uploads

# 清理 30 天前的备份
find $BACKUP_DIR -type f -mtime +30 -delete

# 添加到 crontab，每天凌晨 2 点执行
crontab -e
# 添加: 0 2 * * * /opt/mixmlaal/backup.sh
```

---

## 📊 监控与运维

### 1. 日志管理
```bash
# 查看容器日志
docker logs mixmlaal-driver-frontend --follow

# 查看 Nginx 访问日志
tail -f /var/log/nginx/access.log

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

### 2. 性能监控
使用项目已有的 Prometheus + Grafana 配置：
```bash
cd ../../05-部署运维层/mixmlaal-monitoring
docker-compose up -d
```

访问 Grafana: `http://your-server-ip:3001`

### 3. 健康检查
```bash
# 创建健康检查脚本
#!/bin/bash
# health-check.sh

# 检查前端
if ! curl -f http://localhost/ > /dev/null; then
    echo "Frontend is down!"
    docker restart mixmlaal-driver-frontend
fi

# 检查 API
if ! curl -f http://localhost:3000/health > /dev/null; then
    echo "API is down!"
    docker restart mixmlaal-driver-api
fi
```

---

## 🔍 故障排查

### 常见问题

#### 1. 页面白屏
- 检查浏览器控制台是否有错误
- 确认 API 地址配置正确
- 检查 Nginx 错误日志: `tail -f /var/log/nginx/error.log`

#### 2. API 请求失败
- 确认后端服务正常运行: `docker ps`
- 检查后端日志: `docker logs mixmlaal-driver-api`
- 确认 CORS 配置正确

#### 3. 静态资源 404
- 检查构建是否成功: `ls -la dist/`
- 确认 Nginx root 路径配置正确
- 检查文件权限

#### 4. Docker 容器无法启动
```bash
# 查看容器日志
docker logs mixmlaal-driver-frontend

# 检查容器状态
docker inspect mixmlaal-driver-frontend

# 重新构建并启动
docker-compose build --no-cache
docker-compose up -d
```

---

## 📞 联系支持

如遇到问题，请查看：
- 项目文档: `../../06-项目文档层/`
- API 文档: `../../06-项目文档层/mixmlaal-api-docs/`
- 部署配置: `../../05-部署运维层/`

---

## ✅ 上线检查清单

- [ ] 环境变量配置完成
- [ ] HTTPS 证书配置完成
- [ ] 数据库初始化完成
- [ ] 域名 DNS 解析完成
- [ ] 防火墙规则配置完成
- [ ] 备份策略配置完成
- [ ] 监控系统搭建完成
- [ ] 压力测试通过
- [ ] 用户协议和隐私政策完善
- [ ] 客服和运维团队准备就绪

---

**祝您部署顺利！** 🚀
