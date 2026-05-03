# laal.top 完整部署指南

## 📋 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [详细部署](#详细部署)
- [各模块说明](#各模块说明)
- [监控和维护](#监控和维护)
- [常见问题](#常见问题)
- [附录](#附录)

---

## 项目概述

### 项目结构

```
laal.top/
├── 01-前端集群/
│   ├── mixmlaal-web-vue-pc/        # PC主站 (/)
│   ├── mixmlaal-web-driver-vue/    # 司机端 (/driver/)
│   ├── mixmlaal-web-merchant-vue/  # 商家端 (/merchant/)
│   ├── mixmlaal-web-h5-mobile/     # H5移动端 (/h5/)
│   ├── mixmlaal-web-react-admin/   # React管理后台 (/admin/, /admin-react/)
│   └── mixmlaal-web-ruoyi-vue/     # RuoYi后台 (/ruoyi/)
├── 02-后端微服务集群/
│   └── mixmlaal-node-api/          # Node API服务 (/api/)
├── 03-全平台应用端/
│   └── mixmlaal-harmony-uniapp/    # HarmonyOS应用 (/harmony/)
├── 04-数据库层/
│   └── mixmlaal-mysql-sql/         # 数据库初始化脚本
├── 05-部署运维层/
│   ├── mixmlaal-deploy-config/     # Docker Compose配置
│   └── mixmlaal-nginx-config/      # Nginx反向代理配置
└── 06-项目文档层/
```

### laal.top 域名模块映射

| 路径 | 项目 | 技术 | 端口 | 说明 |
|------|------|------|------|------|
| `/` | mixmlaal-web-vue-pc | Vue3 + Vite | 3000 | PC主站 |
| `/api/` | mixmlaal-node-api | Node.js + Express | 8080 | 核心API服务 |
| `/admin/` | mixmlaal-web-react-admin | React + Ant Design | 3002 | 管理后台 |
| `/admin-react/` | mixmlaal-web-react-admin | React + Ant Design | 3002 | 管理后台(备份路径) |
| `/driver/` | mixmlaal-web-driver-vue | Vue3 + Vant4 | 3003 | 司机端 |
| `/merchant/` | mixmlaal-web-merchant-vue | Vue3 + Element Plus | 3004 | 商家管理端 |
| `/h5/` | mixmlaal-web-h5-mobile | Vue3 + Vant4 | 3005 | H5移动端 |
| `/ruoyi/` | mixmlaal-web-ruoyi-vue | Vue2 + Element UI | 3006 | RuoYi后台 |
| `/static/` | 静态资源服务 | Nginx | 3010 | 图片和文件 |

---

## 快速开始

### 前置要求

- ✅ Docker 20.10+
- ✅ Docker Compose 2.0+
- ✅ 至少 4GB 可用内存
- ✅ 域名 laal.top (已解析到服务器IP)

### 一键部署

#### Windows 用户

```cmd
# 1. 复制并编辑环境变量
copy .env.example .env.laal.top
# 编辑 .env.laal.top，修改密码等配置

# 2. 运行部署脚本
deploy-laal.top.bat start
```

#### Linux/Mac 用户

```bash
# 1. 添加执行权限
chmod +x deploy-laal.top.sh

# 2. 复制并编辑环境变量
cp .env.example .env.laal.top
# 编辑 .env.laal.top，修改密码等配置

# 3. 部署
./deploy-laal.top.sh start
```

### 访问验证

部署成功后访问以下地址：

| 服务 | 本地地址 | 生产地址 | 默认账号 |
|------|----------|----------|----------|
| PC主站 | http://localhost | https://laal.top | - |
| 司机端 | http://localhost:3003 | https://laal.top/driver/ | - |
| 商家端 | http://localhost:3004 | https://laal.top/merchant/ | - |
| H5移动端 | http://localhost:3005 | https://laal.top/h5/ | - |
| 管理后台 | http://localhost:3002 | https://laal.top/admin/ | admin/admin123 |
| Grafana | http://localhost:3001 | https://laal.top:3001 | admin/admin123 |
| Prometheus | http://localhost:9090 | https://laal.top:9090 | - |

---

## 详细部署

### 1. 环境准备

#### 服务器要求

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| CPU | 2核 | 4核+ |
| 内存 | 2GB | 4GB+ |
| 硬盘 | 20GB | 50GB+ SSD |
| 系统 | Ubuntu 20.04+/CentOS 7+ | Ubuntu 22.04 LTS |

#### 安装 Docker (Ubuntu)

```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 启动 Docker
systemctl enable --now docker

# 安装 Docker Compose
apt install docker-compose -y
```

### 2. DNS 配置

在域名服务商处添加解析记录：

```
A 记录    @     YOUR_SERVER_IP
A 记录    www   YOUR_SERVER_IP
```

验证解析是否生效：

```bash
ping laal.top
nslookup laal.top
```

### 3. 环境变量配置

编辑 `.env.laal.top` 文件，修改以下关键配置：

```env
# ============================================
# 必须修改的配置
# ============================================
MYSQL_PASSWORD=your_strong_mysql_password
REDIS_PASSWORD=your_strong_redis_password
JWT_SECRET=your_32+_characters_jwt_secret
GRAFANA_PASSWORD=your_grafana_password
ADMIN_PASSWORD=your_admin_password

# ============================================
# 域名配置
# ============================================
DOMAIN=laal.top
API_BASE_URL=https://laal.top/api/v1
WEB_BASE_URL=https://laal.top

# ============================================
# 可选配置（按需修改）
# ============================================
# 短信、邮件、支付服务等...
```

### 4. 部署项目

```bash
# 进入部署目录
cd 05-部署运维层/mixmlaal-deploy-config

# 复制环境变量
cp ../../.env.laal.top .env

# 构建并启动所有服务
docker-compose -f docker-compose.laal.top.yml up -d --build

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f
```

### 5. HTTPS 配置

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
apt install certbot python3-certbot-nginx -y

# 申请证书
certbot --nginx -d laal.top -d www.laal.top

# 自动续期测试
certbot renew --dry-run
```

证书会自动续期，无需手动操作。

### 6. 防火墙配置

```bash
# 使用 UFW (Ubuntu)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 或使用 firewalld (CentOS)
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload
```

### 7. 数据初始化

```bash
# 导入数据库
docker exec -i mixmlaal-mysql mysql -u root -p \
  mixmlaal < 04-数据库层/mixmlaal-mysql-sql/init.sql

# 或让 Docker 自动执行（已配置）
```

---

## 各模块说明

### 1. PC主站 (/)

- 技术栈：Vue 3 + Vite + Element Plus
- 功能：首页、商品展示、订单、用户中心等
- 目录：`01-前端集群/mixmlaal-web-vue-pc/`

### 2. 司机端 (/driver/)

- 技术栈：Vue 3 + Vite + Vant 4
- 功能：接单、导航、订单管理、收益统计等
- 目录：`01-前端集群/mixmlaal-web-driver-vue/`

### 3. 商家端 (/merchant/)

- 技术栈：Vue 3 + Vite + Element Plus
- 功能：店铺管理、商品管理、订单处理、数据统计等
- 目录：`01-前端集群/mixmlaal-web-merchant-vue/`

### 4. H5移动端 (/h5/)

- 技术栈：Vue 3 + Vite + Vant 4
- 功能：移动端适配的购物、出行等功能
- 目录：`01-前端集群/mixmlaal-web-h5-mobile/`

### 5. React管理后台 (/admin/, /admin-react/)

- 技术栈：React 18 + Ant Design 5
- 功能：系统管理、用户管理、订单管理、数据看板等
- 目录：`01-前端集群/mixmlaal-web-react-admin/`

### 6. API服务 (/api/)

- 技术栈：Node.js + Express + MySQL + Redis
- 功能：提供所有前端的后端API
- 目录：`02-后端微服务集群/mixmlaal-node-api/`

### 7. 静态资源 (/static/)

- 技术：Nginx 静态文件服务
- 功能：图片、文档、上传文件等托管
- 目录：`07-公共资源/`

---

## 监控和维护

### 服务监控

访问 Grafana：https://laal.top:3001

默认账号：`admin/admin123` (首次登录修改)

### 日志查看

```bash
# 查看所有服务日志
cd 05-部署运维层/mixmlaal-deploy-config
docker-compose -f docker-compose.laal.top.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.laal.top.yml logs -f node-api
docker-compose -f docker-compose.laal.top.yml logs -f mysql
```

### 数据备份

```bash
# 创建备份脚本
cat > /opt/mixmlaal-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/mixmlaal/backups"

mkdir -p $BACKUP_DIR

# 备份数据库
docker exec mixmlaal-mysql mysqldump -u root -p'your_password' mixmlaal \
  > $BACKUP_DIR/mysql_$DATE.sql

# 备份静态文件
tar -czf $BACKUP_DIR/static_$DATE.tar.gz \
  -C 07-公共资源 .

# 清理30天前的备份
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

# 添加执行权限
chmod +x /opt/mixmlaal-backup.sh

# 添加到 crontab 每日凌晨2点执行
crontab -e
# 添加以下行：
0 2 * * * /opt/mixmlaal-backup.sh
```

### 服务重启和升级

```bash
# 停止服务
./deploy-laal.top.sh stop

# 更新代码
git pull

# 重新部署
./deploy-laal.top.sh start

# 或单服务重启
docker-compose -f docker-compose.laal.top.yml restart <service-name>
```

---

## 常见问题

### 1. 端口被占用

```bash
# 检查端口占用
netstat -tulpn | grep -E ':(80|443|3000|8080)'

# 修改 docker-compose 配置，更换端口
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 容器状态
docker ps | grep mysql

# 查看 MySQL 日志
docker logs mixmlaal-mysql

# 重启服务
docker-compose -f docker-compose.laal.top.yml restart mysql
```

### 3. API 请求失败

- 检查 API 服务是否运行正常
- 确认 CORS 配置正确
- 查看浏览器控制台 Network 标签页
- 检查后端日志：`docker logs mixmlaal-node-api`

### 4. Nginx 配置错误

```bash
# 测试 Nginx 配置
docker exec mixmlaal-nginx nginx -t

# 重新加载配置
docker exec mixmlaal-nginx nginx -s reload

# 查看错误日志
docker logs mixmlaal-nginx
```

### 5. Docker 镜像构建慢

使用国内镜像源：

```bash
# 编辑 Docker 配置
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF

# 重启 Docker
systemctl restart docker
```

---

## 附录

### A. 快速参考

| 任务 | 命令 |
|------|------|
| 启动 | `./deploy-laal.top.sh start` |
| 停止 | `./deploy-laal.top.sh stop` |
| 重启 | `./deploy-laal.top.sh restart` |
| 状态 | `./deploy-laal.top.sh status` |
| 日志 | `./deploy-laal.top.sh logs` |

### B. 相关文档

- [项目概述](./PROJECT_READINESS.md)
- [快速开始](./QUICK_START.md)
- [模块映射表](./laal.top-模块映射表.md)
- [司机端部署](./01-前端集群/mixmlaal-web-driver-vue/PRODUCTION_DEPLOYMENT.md)
- [部署方案](./05-部署运维层/mixmlaal-deploy-config/部署方案.md)

### C. 技术支持

如遇问题，请查看：

1. 项目文档：`06-项目文档层/`
2. 日志文件：`05-部署运维层/mixmlaal-deploy-config/logs/`
3. 在线文档：https://laal.top/docs/

---

## ✅ 上线检查清单

- [x] 环境变量配置完成
- [x] Docker 和 Docker Compose 安装
- [x] DNS 解析生效
- [x] HTTPS 证书配置
- [x] 防火墙规则配置
- [x] 数据库初始化完成
- [x] 服务能够正常启动
- [x] 各模块能够正常访问
- [x] 监控告警配置
- [x] 自动备份策略
- [x] 用户协议和隐私政策完善

---

**部署完成！🚀** laal.top 已准备好投入使用。
