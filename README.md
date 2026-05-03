# 亿级商用全平台超级综合体

> 全端全平台（Web + 小程序 + APP + 桌面软件）+ 全技术栈（Vue + React + Java + Python + Node）+ 全业务功能

## 📋 项目概述

这是一个**亿级商用全平台超级综合体项目**，覆盖：

### 全端全平台覆盖
- **PC端**：Vue3官网 + React管理后台 + 原生HTML官网
- **移动端H5**：Vue3 + Vant移动端适配
- **全平台小程序**：微信/支付宝/抖音/百度/头条（UniApp）
- **原生APP**：安卓 + iOS（Flutter）
- **桌面客户端**：Windows + Mac（Electron）

### 全技术栈
- **前端**：Vue3 + React18 + 原生HTML5
- **后端**：Java SpringCloud + Python FastAPI + Node NestJS
- **数据库**：MySQL 8.0 + Redis + Elasticsearch
- **中间件**：RabbitMQ + Nacos + Sentinel

### 全业务功能
- 电商模块（商品、订单、支付、物流）
- 博客资讯（文章、评论、分类）
- 考勤人事（打卡、组织、薪资）
- 文件云盘（上传、下载、分享）
- 数据可视化（大屏、统计、报表）
- 社交IM（即时通讯、群聊）
- 本地生活（门店、团购、预约）
- AI工具（智能推荐、内容生成）

## 📁 项目目录结构

```
f:\Mi Xiao Mi La A Li Inc\
├── 01-前端集群/
│   ├── web-vue-pc/              # Vue3 PC官网/用户前台
│   ├── web-react-admin/         # React 总运营管理后台
│   ├── web-html-static/         # 原生HTML静态官网
│   └── web-h5-mobile/           # H5移动端适配页面
├── 02-后端微服务集群/
│   ├── java-springcloud/         # Java微服务核心
│   ├── python-fastapi/           # Python服务（AI/数据/爬虫）
│   ├── node-nest-gateway/       # Node网关+IM即时通讯
│   └── common-middleware/       # 公共中间件配置
├── 03-全平台应用端/
│   ├── uni-app-mini/           # 全平台小程序
│   ├── flutter-app/            # Flutter APP
│   └── electron-desktop/       # Electron桌面端
├── 04-数据库层/
│   └── mysql-sql/              # MySQL建表脚本（10库分表）
├── 05-部署运维层/
│   ├── docker-compose/         # Docker Compose编排
│   ├── nginx-config/           # Nginx反向代理配置
│   └── k8s/                   # Kubernetes配置
├── 06-项目文档层/
│   ├── docs/                  # 项目文档
│   └── api/                   # API接口文档
└── 07-公共资源/
    ├── utils/                 # 工具类
    ├── configs/               # 配置文件
    └── scripts/               # 脚本文件
```

## 🚀 快速开始

### 方式一：使用启动脚本
```bash
# Windows
双击运行 start.bat

# Linux/Mac
chmod +x start.sh && ./start.sh
```

### 方式二：手动启动

#### Vue3 PC用户前台
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

#### Python FastAPI数据服务
```bash
cd 02-后端微服务集群/python-fastapi
pip install -r requirements.txt
python main.py
# API文档: http://localhost:8001/docs
```

#### Node NestJS网关+IM
```bash
cd 02-后端微服务集群/node-nest-gateway
npm install
npm run start:dev
# HTTP: http://localhost:8002
# WebSocket: ws://localhost:8002/im
```

## 🔑 测试账号

| 平台 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| Vue3前台 | user | 123456 | 普通用户 |
| React后台 | admin | 123456 | 管理员 |

## 🌐 服务访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| Vue3用户前台 | http://localhost:8080 | PC用户端 |
| React管理后台 | http://localhost:3000 | 运营后台 |
| Python FastAPI | http://localhost:8001 | 数据服务 |
| NestJS网关 | http://localhost:8002 | API网关 |
| Nacos | http://localhost:8848 | 服务注册 |

## 📝 技术栈详情

### 前端技术栈
- **Vue3 PC端**：Vue 3.4 + Vite 5 + Element Plus + Pinia
- **React管理后台**：React 18 + Vite 5 + Ant Design 5
- **H5移动端**：Vue 3 + Vant UI
- **UniApp小程序**：Vue 3 + uni-app
- **Flutter APP**：Dart + Provider
- **Electron桌面**：Electron + Vue3

### 后端技术栈
- **Java微服务**：SpringBoot 3 + SpringCloud Alibaba + Nacos + MyBatis-Plus
- **Python服务**：FastAPI + Uvicorn + Redis + Pandas
- **Node网关**：NestJS + Socket.io + Redis + http-proxy-middleware

### 数据库
- **MySQL 8.0**：10库垂直拆分（sys/user/shop/order/article/attend/file/im/life/data）
- **Redis 7**：缓存、Session、消息队列
- **Elasticsearch 8**：全文检索
- **Nacos**：配置中心、服务注册

## 📊 数据库设计

项目采用**10库分库垂直拆分**：

| 数据库 | 业务范围 |
|--------|----------|
| sys_db | 系统权限、角色菜单 |
| user_db | 用户会员、等级 |
| shop_db | 电商商品、分类 |
| order_db | 订单、支付、物流 |
| article_db | 博客资讯、评论 |
| attend_db | 人事考勤、组织 |
| file_db | 文件云盘、分享 |
| im_db | 社交IM、好友群聊 |
| life_db | 本地生活、团购 |
| data_db | 数据统计、报表 |

## 🐳 Docker部署

### 一键启动所有服务
```bash
cd 05-部署运维层/docker-compose
docker-compose -f docker-compose-full.yml up -d
```

### 服务端口映射
- MySQL: 3306
- Redis: 6379
- Nacos: 8848
- Nginx: 80/443
- Vue前台: 8080
- React后台: 3000
- Python API: 8001
- Node网关: 8002

## 📚 开发文档

更多开发文档请查看：
- `06-项目文档层/docs/` 目录
- FastAPI自动生成API文档：`http://localhost:8001/docs`
- Nacos控制台：`http://localhost:8848/nacos`

## 🎯 项目特点

1. **全端覆盖**：Web + 小程序 + APP + 桌面端
2. **全技术栈**：Vue + React + Java + Python + Node
3. **微服务架构**：独立部署、弹性扩容
4. **亿级承载**：缓存、队列、负载均衡
5. **商用级**：完整业务功能、企业级架构

## 📝 更新日志

### v1.0.0 (2024-05-02)
- ✅ 完成项目整体架构设计
- ✅ 完成前端集群（Vue3 + React + HTML + H5）
- ✅ 完成Java SpringCloud微服务基础架构
- ✅ 完成Python FastAPI数据服务基础架构
- ✅ 完成Node NestJS网关+IM基础架构
- ✅ 完成UniApp小程序基础结构
- ✅ 完成Flutter APP基础结构
- ✅ 完成Electron桌面端基础结构
- ✅ 完成10库分表数据库设计
- ✅ 完成Docker Compose部署配置
- ✅ 完成Nginx配置

---

**亿级商用全平台超级综合体 - 让商业更简单！**
