# 全栈电商平台项目规格说明

## 1. 项目概述

### 项目名称
E-Commerce Platform（电商平台）

### 核心功能
完整的在线购物平台，包含用户系统、商品管理、购物车、订单处理、支付集成和后台管理。

### 目标用户
- 消费者：浏览商品、下单购物、管理订单
- 管理员：管理商品、订单、用户数据

## 2. 技术架构

### 前端技术栈
- React 18 + TypeScript
- Vite（构建工具）
- React Router（路由管理）
- Axios（HTTP客户端）
- TailwindCSS（样式框架）

### 后端技术栈
- Node.js + Express
- TypeScript
- SQLite（数据库）
- JWT（身份认证）
- bcrypt（密码加密）

### 项目结构
```
f:\Mi Xiao Mi La A Li Inc/
├── backend/              # 后端服务
│   ├── src/
│   │   ├── controllers/ # 控制器
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   └── utils/        # 工具函数
│   └── package.json
├── frontend/             # 前端应用
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── hooks/       # 自定义Hook
│   │   ├── services/    # API服务
│   │   └── types/       # 类型定义
│   └── package.json
└── SPEC.md              # 项目规格文档
```

## 3. 功能模块

### 3.1 用户系统
- 用户注册（邮箱、密码、昵称）
- 用户登录（JWT Token认证）
- 个人信息管理
- 地址管理

### 3.2 商品系统
- 商品列表（分页、筛选）
- 商品详情
- 商品分类
- 商品搜索

### 3.3 购物车
- 添加商品到购物车
- 修改商品数量
- 删除商品
- 购物车列表

### 3.4 订单系统
- 创建订单
- 订单列表
- 订单详情
- 订单状态管理

### 3.5 支付系统（模拟）
- 支付接口
- 支付状态回调

### 3.6 后台管理
- 商品管理（增删改查）
- 订单管理
- 用户管理
- 数据统计

## 4. API接口设计

### 认证接口
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/profile | 获取用户信息 |

### 商品接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/products | 获取商品列表 |
| GET | /api/products/:id | 获取商品详情 |
| POST | /api/products | 创建商品（管理员） |
| PUT | /api/products/:id | 更新商品（管理员） |
| DELETE | /api/products/:id | 删除商品（管理员） |

### 购物车接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/cart | 获取购物车 |
| POST | /api/cart | 添加商品到购物车 |
| PUT | /api/cart/:itemId | 更新购物车商品 |
| DELETE | /api/cart/:itemId | 删除购物车商品 |

### 订单接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/orders | 获取订单列表 |
| GET | /api/orders/:id | 获取订单详情 |
| POST | /api/orders | 创建订单 |
| PUT | /api/orders/:id/status | 更新订单状态 |

## 5. 数据库设计

### 用户表（users）
- id: INTEGER PRIMARY KEY
- email: TEXT UNIQUE
- password: TEXT
- nickname: TEXT
- role: TEXT (user/admin)
- created_at: DATETIME

### 商品表（products）
- id: INTEGER PRIMARY KEY
- name: TEXT
- description: TEXT
- price: REAL
- stock: INTEGER
- category: TEXT
- image_url: TEXT
- created_at: DATETIME

### 购物车表（cart_items）
- id: INTEGER PRIMARY KEY
- user_id: INTEGER
- product_id: INTEGER
- quantity: INTEGER

### 订单表（orders）
- id: INTEGER PRIMARY KEY
- user_id: INTEGER
- total_amount: REAL
- status: TEXT (pending/paid/shipped/completed/cancelled)
- shipping_address: TEXT
- created_at: DATETIME

### 订单项表（order_items）
- id: INTEGER PRIMARY KEY
- order_id: INTEGER
- product_id: INTEGER
- quantity: INTEGER
- price: REAL

## 6. 安全考虑
- 密码使用bcrypt加密存储
- 使用JWT进行身份认证
- 输入数据验证和SQL注入防护
- CORS跨域配置

## 7. 部署方式
- 前端：静态文件部署（Vercel/Netlify）
- 后端：Node.js服务（Railway/Render）
- 数据库：SQLite（开发）/ PostgreSQL（生产）
