# 亿级商用全平台超级综合体 - 完整开发文档

## 📋 项目概述

这是一个全技术栈、全平台、支持亿级并发的超级综合体项目，包含电商、社交、博客、OA等完整功能模块。

## 🚀 技术架构

### 前端技术栈
- **Vue3 PC用户前台**: Vue3 + Vite + Element Plus + Pinia + Vue Router
- **React管理后台**: React 18 + Vite + Ant Design + React Router
- **H5移动端**: Vue3 + Vant UI
- **静态官网**: HTML5 + CSS3 + JavaScript

### 后端技术栈
- **Java微服务**: Spring Boot 3 + Spring Cloud Alibaba + MyBatis Plus + Nacos
- **Python数据服务**: FastAPI + Uvicorn + Redis + Pandas
- **Node网关+IM**: NestJS + WebSocket + Socket.io + Redis

### 全平台应用
- **UniApp小程序**: 支持微信/支付宝/抖音/百度小程序
- **Flutter APP**: Android + iOS 双端原生
- **Electron桌面**: Windows + Mac 桌面应用

### 数据存储
- **MySQL 8.0**: 10个分库垂直拆分
- **Redis 7**: 缓存和消息队列
- **Nacos**: 服务注册和配置中心

## 📁 目录结构

```
f:\Mi Xiao Mi La A Li Inc\
├── 01-前端集群/
│   ├── web-vue-pc/          # Vue3 PC用户前台
│   ├── web-react-admin/     # React管理后台
│   ├── web-html-static/     # 静态官网
│   └── web-h5-mobile/       # H5移动端
├── 02-后端微服务集群/
│   ├── java-springcloud/    # Java微服务核心
│   ├── python-fastapi/      # Python数据服务
│   └── node-nest-gateway/   # Node网关+IM
├── 03-全平台应用端/
│   ├── uni-app-mini/        # 全平台小程序
│   ├── flutter-app/         # Flutter APP
│   └── electron-desktop/    # Electron桌面端
├── 04-数据库层/
│   └── mysql-sql/           # 数据库脚本
├── 05-部署运维层/
│   ├── docker-compose/      # Docker编排
│   ├── nginx-config/        # Nginx配置
│   └── k8s/                 # Kubernetes配置
├── 06-项目文档层/
├── 07-公共资源/
├── backend/                 # Node.js后端（可用）
├── frontend/                # React前端（可用）
├── README.md
└── start.bat                # Windows启动脚本
```

## 🏃‍♂️ 快速启动

### 方式1: 使用启动脚本（Windows）
```bash
# 双击运行
start.bat
```

### 方式2: 手动启动各个服务

#### Vue3用户前台
```bash
cd 01-前端集群/web-vue-pc
npm install
npm run dev
# 访问: http://localhost:8080
```

#### React管理后台
```bash
cd 01-前端集群/web-react-admin
npm install
npm run dev
# 访问: http://localhost:3000
```

#### Node.js后端
```bash
cd backend
npm install
npm run dev
# 访问: http://localhost:3001
```

#### Python FastAPI
```bash
cd 02-后端微服务集群/python-fastapi
# 创建虚拟环境
python -m venv venv
venv\Scripts\activate  # Windows
# 或 source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
# API文档: http://localhost:8001/docs
```

#### Node NestJS网关+IM
```bash
cd 02-后端微服务集群/node-nest-gateway
npm install
npm run start:dev
# HTTP端口: 8002, WebSocket: ws://localhost:8002/im
```

#### Docker Compose一键启动
```bash
cd 05-部署运维层/docker-compose
docker-compose -f docker-compose-full.yml up -d
```

## 🔑 测试账号

### Vue3用户前台
- 用户名: `user`
- 密码: `123456`

### React管理后台
- 用户名: `admin`
- 密码: `123456`

## 🗄️ 数据库设计

项目采用**10库垂直拆分**设计：

| 数据库名 | 业务范围 | 主要表 |
|---------|---------|--------|
| sys_db | 系统权限 | sys_admin, sys_role, sys_menu |
| user_db | 用户会员 | user_info, user_level |
| shop_db | 电商商品 | shop_goods, shop_category, shop_cart |
| order_db | 订单支付 | order_main, order_item, order_log |
| article_db | 博客资讯 | article, article_category |
| attend_db | 人事考勤 | staff, attend_record |
| file_db | 文件云盘 | file_info, file_share |
| im_db | 社交IM | friend, message, chat_group |
| life_db | 本地生活 | shop_info, product, order |
| data_db | 数据统计 | data_statistics, report |

## 🌐 服务访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| Vue3用户前台 | http://localhost:8080 | 电商用户前台 |
| React管理后台 | http://localhost:3000 | 管理后台 |
| Node.js后端 | http://localhost:3001 | API服务 |
| Python FastAPI | http://localhost:8001 | 数据服务 |
| FastAPI文档 | http://localhost:8001/docs | 自动生成的API文档 |
| NestJS网关 | http://localhost:8002 | API网关 |
| WebSocket IM | ws://localhost:8002/im | 实时通讯 |
| Nacos | http://localhost:8848/nacos | 服务注册中心 |
| 静态官网 | 直接打开index.html | 官网展示 |

## 📦 Docker部署

### 完整Docker Compose
```bash
# 进入目录
cd 05-部署运维层/docker-compose

# 启动所有服务
docker-compose -f docker-compose-full.yml up -d

# 查看服务状态
docker-compose -f docker-compose-full.yml ps

# 查看日志
docker-compose -f docker-compose-full.yml logs -f

# 停止服务
docker-compose -f docker-compose-full.yml down
```

### 服务端口映射
- MySQL: 3306
- Redis: 6379
- Nacos: 8848
- Node后端: 3001
- Vue前台: 8080
- React后台: 3000
- Nginx代理: 80, 443

## 🎨 核心功能模块

### Vue3用户前台
- 首页轮播图和推荐商品
- 商品分类浏览和搜索
- 商品详情展示
- 购物车管理
- 订单管理
- 用户个人中心

### React管理后台
- 数据概览Dashboard
- 用户管理
- 商品管理
- 订单管理
- 数据统计

### Java微服务
- 用户服务 (9002)
- 商品服务 (9003)
- 订单服务 (9004)
- 系统权限服务 (9001)

### Python FastAPI
- 数据统计分析
- AI智能推荐
- 博客资讯管理
- 人事考勤
- 文件云盘
- 社交IM数据

### Node NestJS网关+IM
- API统一网关
- WebSocket实时通讯
- 群聊和私聊
- 在线用户管理

## 📊 开发规范

### 统一返回格式
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

### 数据库字段命名规范
- 采用下划线命名法: `user_id`, `create_time`
- 软删除字段: `deleted` (0正常, 1删除)
- 状态字段: `status` (1启用, 0禁用)
- 时间字段: `create_time`, `update_time`

### Git提交规范
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具

## 🔧 环境要求

### 开发环境
- **Node.js**: 18+
- **Java**: 17+
- **Python**: 3.9+
- **MySQL**: 8.0+
- **Redis**: 7.0+
- **Docker**: 24+
- **Git**: 2.0+

### 推荐IDE
- **前端**: VS Code + Volar
- **Java**: IntelliJ IDEA
- **Python**: PyCharm / VS Code
- **Flutter**: Android Studio / VS Code
- **UniApp**: HBuilderX / VS Code

## 🎯 快速开发指南

### 新增API接口（Node.js）
```javascript
// 1. 在routes下新增路由
// 2. 在controllers下新增控制器
// 3. 在services下新增服务逻辑
// 4. 在models下新增数据模型
```

### 新增页面（Vue3）
```vue
<!-- 1. 在src/pages下新增页面 -->
<!-- 2. 在src/router/index.js注册路由 -->
<!-- 3. 在相关组件中添加入口链接 -->
```

### 新增服务（Java）
```java
// 1. 创建entity实体类
// 2. 创建mapper接口
// 3. 创建service服务
// 4. 创建controller控制器
// 5. 在nacos注册配置
```

## 📞 技术支持

- **项目文档**: README.md, PROJECT_PLAN.md, DATABASE_DESIGN.md
- **API文档**: FastAPI自动生成 /docs, Swagger UI
- **代码规范**: 参考各语言官方规范

## 📝 更新日志

### v1.0.0 (2026-05-01)
- ✅ 完成项目整体架构设计
- ✅ 实现Vue3用户前台
- ✅ 实现React管理后台
- ✅ 完成Java微服务基础架构
- ✅ 完成Python FastAPI数据服务
- ✅ 完成Node NestJS网关+IM
- ✅ 完成数据库10库设计
- ✅ 完成UniApp小程序基础结构
- ✅ 完成Flutter APP基础结构
- ✅ 完成Electron桌面应用
- ✅ 完成Docker部署配置
- ✅ 完成启动脚本和文档

---

**注意**: 本项目为演示项目，部分功能使用模拟数据，生产环境请接入真实数据库和服务。
