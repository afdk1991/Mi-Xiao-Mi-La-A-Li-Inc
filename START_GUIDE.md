# MIXMLAAL 项目启动指南

## 项目概述

MIXMLAAL 是一个完整的全栈项目，包含前端集群、后端微服务、数据库和部署运维等多个模块。

## 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **MySQL**: >= 8.0
- **Redis**: >= 6.0
- **MongoDB**: >= 4.4 (可选)
- **Docker**: >= 20.10 (可选，用于容器化部署)

## 快速开始

### 1. 克隆项目

```bash
cd "f:\Mi Xiao Mi La A Li Inc"
```

### 2. 一键安装和配置

```bash
# 安装根目录依赖
npm install

# 一键安装所有子项目依赖并配置环境
npm run setup
```

### 3. 配置数据库

#### MySQL 配置

编辑 `.env` 文件，配置数据库连接：

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=mixmlaal
```

#### 初始化数据库

```bash
# 执行数据库初始化脚本
mysql -u root -p < 04-数据库层/mixmlaal-mysql-sql/init.sql
mysql -u root -p < 04-数据库层/mixmlaal-mysql-sql/init-data.sql
```

#### Redis 配置

确保 Redis 服务已启动：

```bash
# Windows (如果已安装 Redis)
redis-server

# 或使用 Docker
docker run -d -p 6379:6379 --name mixmlaal-redis redis:alpine
```

### 4. 启动项目

#### 方式一：分别启动

```bash
# 启动后端服务
npm run dev:backend

# 新开终端，启动 React 前端
npm run dev:frontend:react

# 新开终端，启动 Vue 前端
npm run dev:frontend:vue
```

#### 方式二：一键启动所有服务

```bash
npm run dev
```

#### 方式三：使用 Docker 部署

```bash
# 启动所有服务（包括数据库）
npm run docker:up

# 停止服务
npm run docker:down
```

## 访问地址

- **React 前端**: http://localhost:5173
- **Vue PC 前端**: http://localhost:5174
- **后端 API**: http://localhost:3000
- **API 文档**: http://localhost:3000/api/v1/api-docs
- **Grafana 监控**: http://localhost:3000 (如果使用 Docker)
- **Prometheus**: http://localhost:9090 (如果使用 Docker)

## 项目结构说明

```
f:\Mi Xiao Mi La A Li Inc\
├── 01-前端集群/              # 前端应用集合
│   ├── mixmlaal-frontend/   # React 电商前端
│   ├── mixmlaal-web-vue-pc/ # Vue PC 端
│   ├── mixmlaal-web-react-admin/ # React 管理后台
│   ├── mixmlaal-web-merchant-vue/ # 商家端
│   ├── mixmlaal-web-driver-vue/   # 司机端
│   └── mixmlaal-web-h5-mobile/    # H5 移动端
├── 02-后端微服务集群/        # 后端服务集合
│   ├── mixmlaal-node-api/   # Node.js API 主服务
│   ├── mixmlaal-node-backend/ # Node.js 后端
│   ├── mixmlaal-python-fastapi/ # Python FastAPI 服务
│   └── mixmlaal-node-nest-gateway/ # NestJS 网关
├── 03-全平台应用端/          # 多端应用
│   ├── mixmlaal-electron-desktop/ # Electron 桌面端
│   ├── mixmlaal-flutter-app/ # Flutter 移动端
│   └── mixmlaal-miniapp/    # 小程序
├── 04-数据库层/              # 数据库相关
│   └── mixmlaal-mysql-sql/ # MySQL 初始化脚本
├── 05-部署运维层/            # 部署和运维
│   ├── mixmlaal-docker-compose/ # Docker Compose 配置
│   ├── mixmlaal-k8s/        # Kubernetes 配置
│   └── mixmlaal-monitoring/ # 监控配置
├── 06-项目文档层/            # 项目文档
│   ├── mixmlaal-api-docs/   # API 文档
│   └── mixmlaal-project-docs/ # 项目文档
└── 07-公共资源/              # 公共配置和资源
    └── mixmlaal-configs/    # 配置文件模板
```

## 可用的 npm 脚本

| 命令 | 说明 |
|------|------|
| `npm run setup` | 一键安装依赖并配置环境 |
| `npm run install:all` | 安装所有子项目依赖 |
| `npm run dev` | 启动所有开发服务 |
| `npm run dev:backend` | 仅启动后端服务 |
| `npm run dev:frontend` | 启动所有前端服务 |
| `npm run build` | 构建所有项目 |
| `npm run test` | 运行测试 |
| `npm run docker:up` | 启动 Docker 容器 |
| `npm run clean` | 清理所有 node_modules |

## 开发流程

### 添加新功能

1. 在对应的前端或后端目录中开发
2. 更新相关的 API 文档
3. 运行测试确保功能正常
4. 提交代码

### 常见问题

#### 1. 端口被占用

修改 `.env` 文件中的端口配置：

```env
PORT=3001  # 修改后端端口
```

#### 2. 数据库连接失败

检查：
- MySQL 服务是否启动
- 用户名密码是否正确
- 数据库是否已创建

#### 3. 依赖安装失败

尝试：
```bash
npm cache clean --force
npm run clean
npm run setup
```

## 生产部署

详细的部署文档请参考：
- `06-项目文档层/mixmlaal-deployment-docs/DEPLOYMENT.md`
- `05-部署运维层/mixmlaal-deploy-config/部署方案.md`

## 技术支持

如有问题，请查看：
- `06-项目文档层/` 目录下的文档
- API 文档：http://localhost:3000/api/v1/api-docs

---

**项目版本**: 0.0.0.4  
**最后更新**: 2026-05-03
