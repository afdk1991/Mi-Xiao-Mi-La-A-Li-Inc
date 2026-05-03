# MIXMLAAL 项目 - 快速开始指南

## 🚀 快速开始（5分钟上手）

### 前置要求
- ✅ Docker Desktop（Windows/Mac）或 Docker Engine（Linux）
- ✅ Docker Compose
- ✅ 至少 4GB 可用内存

---

## 📦 一键启动（推荐）

### Windows 用户
```cmd
# 双击运行或在命令行执行
deploy-production.bat start
```

### Linux/Mac 用户
```bash
# 添加执行权限
chmod +x deploy-production.sh

# 启动部署
./deploy-production.sh start
```

---

## 📋 手动部署步骤

### 1. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入真实配置
# 重点修改：
# - MYSQL_PASSWORD
# - REDIS_PASSWORD
# - JWT_SECRET
# - API 地址等
```

### 2. 进入部署目录
```bash
cd 05-部署运维层/mixmlaal-deploy-config
```

### 3. 启动所有服务
```bash
# 使用生产环境配置启动
docker-compose -f docker-compose.prod.yml up -d
```

### 4. 检查服务状态
```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

---

## 🌐 访问地址

部署成功后，访问以下地址：

| 服务 | 地址 | 说明 |
|------|------|------|
| 司机端 | http://localhost | Vue 3 移动端 |
| 商家端 | http://localhost:8081 | 商家管理后台 |
| 管理后台 | http://localhost:8082 | 系统管理后台 |
| API 文档 | http://localhost:3000/api-docs | Swagger API 文档 |
| Prometheus | http://localhost:9090 | 监控指标 |
| Grafana | http://localhost:3001 | 监控面板 (admin/admin) |

---

## 🔧 常用命令

### Docker Compose 命令
```bash
# 启动服务
docker-compose -f docker-compose.prod.yml up -d

# 停止服务
docker-compose -f docker-compose.prod.yml down

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f mysql

# 进入容器
docker-compose -f docker-compose.prod.yml exec mysql bash
```

### 数据库操作
```bash
# 备份数据库
docker exec mixmlaal-mysql mysqldump -u root -pYOUR_PASSWORD mixmlaal > backup.sql

# 恢复数据库
docker exec -i mixmlaal-mysql mysql -u root -pYOUR_PASSWORD mixmlaal < backup.sql
```

---

## 🎯 各前端项目独立部署

### 司机端
```bash
cd 01-前端集群/mixmlaal-web-driver-vue

# 安装依赖
npm install

# 开发环境
npm run dev

# 生产构建
npm run build

# Docker 部署
docker build -t mixmlaal-driver:latest .
docker run -d -p 80:80 --name mixmlaal-driver mixmlaal-driver:latest
```

### 商家端
```bash
cd 01-前端集群/mixmlaal-web-merchant-vue
npm install
npm run build
```

### 管理后台
```bash
cd 01-前端集群/mixmlaal-web-react-admin
npm install
npm run build
```

---

## 🔒 安全配置（生产环境必做）

### 1. 修改默认密码
```bash
# 编辑 .env 文件，修改以下密码
MYSQL_PASSWORD=your_strong_password
REDIS_PASSWORD=your_strong_password
JWT_SECRET=your_32_char_jwt_secret
```

### 2. 配置 HTTPS
```bash
# 使用 Let's Encrypt 免费证书
# 或上传你的 SSL 证书
```

### 3. 配置防火墙
```bash
# 只开放必要端口
# 80, 443, 22 (仅对信任 IP 开放)
```

### 4. 配置备份
```bash
# 设置自动备份脚本
# 参考 PRODUCTION_DEPLOYMENT.md 中的备份配置
```

---

## 📊 监控和日志

### 访问 Grafana
- URL: http://localhost:3001
- 用户名: admin
- 密码: admin (首次登录需修改)

### 查看日志
```bash
# 所有服务日志
docker-compose -f docker-compose.prod.yml logs -f

# 特定服务日志
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f mysql
```

---

## 🛠️ 故障排查

### 问题：服务无法启动
```bash
# 检查端口是否被占用
netstat -tulpn | grep -E ':(80|3000|3306|6379)'

# 查看详细错误信息
docker-compose -f docker-compose.prod.yml logs
```

### 问题：数据库连接失败
```bash
# 检查 MySQL 容器状态
docker ps | grep mysql

# 检查 MySQL 日志
docker logs mixmlaal-mysql
```

### 问题：API 请求失败
```bash
# 检查 API 服务是否正常
curl http://localhost:3000/health

# 检查前端 API 地址配置
# 查看各前端项目的 .env.production 文件
```

---

## 📚 更多文档

| 文档 | 位置 | 说明 |
|------|------|------|
| 司机端部署指南 | `01-前端集群/mixmlaal-web-driver-vue/PRODUCTION_DEPLOYMENT.md` | 详细的司机端部署说明 |
| 项目架构 | `06-项目文档层/mixmlaal-architecture-docs/` | 系统架构和技术方案 |
| API 文档 | `06-项目文档层/mixmlaal-api-docs/` | API 接口说明 |
| 部署配置 | `05-部署运维层/mixmlaal-deploy-config/` | Docker Compose 配置 |
| 完整项目文档 | `06-项目文档层/` | 所有项目相关文档 |

---

## 💡 小贴士

1. **首次部署**：使用一键部署脚本最简单
2. **开发环境**：可以使用 `docker-compose.yml` 而非生产版本
3. **生产环境**：务必修改所有默认密码
4. **数据备份**：配置自动备份，定期测试恢复
5. **监控告警**：配置 Prometheus + Grafana 监控系统状态

---

## 🤝 需要帮助？

如遇到问题：
1. 查看日志排查错误
2. 参考各项目的部署文档
3. 检查环境变量配置是否正确
4. 确认 Docker 和 Docker Compose 版本兼容性

---

**祝您部署顺利！** 🎉
