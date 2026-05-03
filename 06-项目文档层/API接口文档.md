# 亿级商用超级平台 · API接口文档

---

## 📋 目录
- [接口说明](#接口说明)
- [统一返回格式](#统一返回格式)
- [用户接口](#用户接口)
- [商品接口](#商品接口)
- [订单接口](#订单接口)
- [购物车接口](#购物车接口)
- [系统接口](#系统接口)
- [数据统计接口](#数据统计接口)

---

## 🔧 接口说明

### 环境配置
| 环境 | 地址 |
|------|------|
| 开发环境 | http://localhost:3001 |
| 测试环境 | http://test-api.yijimall.com |
| 生产环境 | http://api.yijimall.com |

### 认证方式
- Header中添加 `Authorization: Bearer <token>`
- 登录成功后获取Token，有效期24小时

---

## 📦 统一返回格式

### 成功响应
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "code": 401,
  "msg": "登录已过期，请重新登录",
  "data": null
}
```

### 分页响应
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "list": [ ... ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

---

## 👤 用户接口

### 1.1 用户注册
- **URL**: `POST /api/user/register`
- **描述**: 用户注册新账号

**请求参数**:
```json
{
  "username": "string",
  "password": "string",
  "phone": "string",
  "email": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "注册成功",
  "data": {
    "userId": 1,
    "username": "user123"
  }
}
```

---

### 1.2 用户登录
- **URL**: `POST /api/user/login`
- **描述**: 用户登录

**请求参数**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "user123",
      "nickname": "张三",
      "avatar": "https://...",
      "level": 1
    }
  }
}
```

---

### 1.3 获取用户信息
- **URL**: `GET /api/user/info`
- **认证**: 需要

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 1,
    "username": "user123",
    "nickname": "张三",
    "avatar": "https://...",
    "phone": "13800138000",
    "email": "user@example.com",
    "gender": 1,
    "birthday": "1990-01-01",
    "level": 2,
    "points": 5000,
    "balance": 1000.00
  }
}
```

---

### 1.4 更新用户信息
- **URL**: `PUT /api/user/info`
- **认证**: 需要

**请求参数**:
```json
{
  "nickname": "string",
  "phone": "string",
  "email": "string",
  "gender": 1,
  "birthday": "1990-01-01"
}
```

---

### 1.5 修改密码
- **URL**: `PUT /api/user/password`
- **认证**: 需要

**请求参数**:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

---

## 🛍️ 商品接口

### 2.1 获取商品列表
- **URL**: `GET /api/products`
- **描述**: 获取商品列表，支持分页和筛选

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认20 |
| categoryId | int | 否 | 分类ID |
| keyword | string | 否 | 搜索关键词 |
| sort | string | 否 | 排序：price_asc/price_desc/sales |

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "goods_name": "iPhone 15 Pro",
        "goods_img": "https://...",
        "price": 7999.00,
        "market_price": 8999.00,
        "stock": 100,
        "sales": 256
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### 2.2 获取商品详情
- **URL**: `GET /api/products/{id}`
- **描述**: 获取商品详细信息

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 1,
    "goods_name": "iPhone 15 Pro",
    "goods_img": "https://...",
    "goods_images": ["https://...", "https://..."],
    "price": 7999.00,
    "market_price": 8999.00,
    "stock": 100,
    "sales": 256,
    "category_id": 1,
    "category_name": "手机数码",
    "goods_desc": "商品详细描述...",
    "create_time": "2024-01-01 10:00:00"
  }
}
```

---

### 2.3 获取商品分类
- **URL**: `GET /api/categories`
- **描述**: 获取商品分类列表

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "id": 1,
      "category_name": "手机数码",
      "parent_id": 0,
      "children": [
        {
          "id": 11,
          "category_name": "手机",
          "parent_id": 1
        }
      ]
    }
  ]
}
```

---

## 📋 订单接口

### 3.1 创建订单
- **URL**: `POST /api/orders`
- **认证**: 需要

**请求参数**:
```json
{
  "address_id": 1,
  "remark": "备注信息",
  "items": [
    {
      "goods_id": 1,
      "quantity": 2
    }
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "订单创建成功",
  "data": {
    "order_id": "ORD20240101123456789",
    "total_amount": 15998.00
  }
}
```

---

### 3.2 获取订单列表
- **URL**: `GET /api/orders`
- **认证**: 需要

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| status | int | 否 | 订单状态：0待付款/1待发货/2已发货/3已完成/4已取消 |

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "list": [
      {
        "order_id": "ORD20240101123456789",
        "total_amount": 15998.00,
        "status": 1,
        "status_text": "待发货",
        "create_time": "2024-01-01 10:00:00",
        "items": [
          {
            "goods_name": "iPhone 15 Pro",
            "goods_img": "https://...",
            "price": 7999.00,
            "quantity": 2
          }
        ]
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### 3.3 获取订单详情
- **URL**: `GET /api/orders/{orderId}`
- **认证**: 需要

---

### 3.4 取消订单
- **URL**: `PUT /api/orders/{orderId}/cancel`
- **认证**: 需要

---

### 3.5 确认收货
- **URL**: `PUT /api/orders/{orderId}/confirm`
- **认证**: 需要

---

## 🛒 购物车接口

### 4.1 获取购物车列表
- **URL**: `GET /api/cart`
- **认证**: 需要

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "goods_id": 1,
        "goods_name": "iPhone 15 Pro",
        "goods_img": "https://...",
        "price": 7999.00,
        "quantity": 2,
        "subtotal": 15998.00
      }
    ],
    "total_amount": 15998.00,
    "total_count": 2
  }
}
```

---

### 4.2 添加到购物车
- **URL**: `POST /api/cart`
- **认证**: 需要

**请求参数**:
```json
{
  "goods_id": 1,
  "quantity": 1
}
```

---

### 4.3 更新购物车数量
- **URL**: `PUT /api/cart/{id}`
- **认证**: 需要

**请求参数**:
```json
{
  "quantity": 2
}
```

---

### 4.4 删除购物车商品
- **URL**: `DELETE /api/cart/{id}`
- **认证**: 需要

---

### 4.5 清空购物车
- **URL**: `DELETE /api/cart`
- **认证**: 需要

---

## ⚙️ 系统接口

### 5.1 管理员登录
- **URL**: `POST /api/admin/login`
- **描述**: 管理员登录

**请求参数**:
```json
{
  "username": "admin",
  "password": "123456"
}
```

---

### 5.2 获取统计数据
- **URL**: `GET /api/admin/stats`
- **认证**: 需要

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "totalUsers": 12568,
    "totalGoods": 8642,
    "totalOrders": 45896,
    "totalAmount": 2856980.00,
    "todayUsers": 128,
    "todayOrders": 456,
    "todayAmount": 89652.00
  }
}
```

---

### 5.3 获取用户列表
- **URL**: `GET /api/admin/users`
- **认证**: 需要

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| keyword | string | 否 | 搜索关键词 |
| status | int | 否 | 用户状态 |

---

### 5.4 更新用户状态
- **URL**: `PUT /api/admin/users/{id}/status`
- **认证**: 需要

**请求参数**:
```json
{
  "status": 1
}
```

---

### 5.5 获取商品管理列表
- **URL**: `GET /api/admin/goods`
- **认证**: 需要

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| categoryId | int | 否 | 分类ID |
| status | int | 否 | 商品状态 |

---

### 5.6 添加商品
- **URL**: `POST /api/admin/goods`
- **认证**: 需要

**请求参数**:
```json
{
  "category_id": 1,
  "goods_name": "string",
  "goods_img": "string",
  "price": 7999.00,
  "market_price": 8999.00,
  "stock": 100,
  "goods_desc": "string"
}
```

---

### 5.7 更新商品
- **URL**: `PUT /api/admin/goods/{id}`
- **认证**: 需要

---

### 5.8 删除商品
- **URL**: `DELETE /api/admin/goods/{id}`
- **认证**: 需要

---

### 5.9 获取订单管理列表
- **URL**: `GET /api/admin/orders`
- **认证**: 需要

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| status | int | 否 | 订单状态 |
| orderId | string | 否 | 订单号 |

---

### 5.10 发货
- **URL**: `PUT /api/admin/orders/{orderId}/ship`
- **认证**: 需要

**请求参数**:
```json
{
  "express_company": "顺丰速运",
  "express_no": "SF1234567890"
}
```

---

## 📊 数据统计接口

### 6.1 获取总览数据
- **URL**: `GET /api/data/overview`
- **描述**: 获取数据总览

**响应示例**:
```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "data": {
    "users": {
      "total": 12568,
      "today": 128,
      "yesterday": 96,
      "growth": 33.33
    },
    "orders": {
      "total": 45896,
      "today": 456,
      "yesterday": 389,
      "growth": 17.22
    },
    "amount": {
      "total": 2856980.00,
      "today": 89652.00,
      "yesterday": 78234.00,
      "growth": 14.59
    }
  }
}
```

---

### 6.2 获取趋势数据
- **URL**: `GET /api/data/trend`
- **描述**: 获取趋势数据

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 类型：users/orders/amount |
| period | string | 否 | 周期：week/month/year |

---

### 6.3 获取实时数据
- **URL**: `GET /api/data/realtime`
- **描述**: 获取实时数据

---

## ❌ 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或登录已过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 📝 备注

- 所有接口均支持跨域请求
- 所有POST/PUT请求建议使用JSON格式
- 图片URL建议使用绝对路径
- 金额单位统一使用元（¥）
- 日期格式统一使用：YYYY-MM-DD HH:mm:ss

---

**文档版本**: v1.0.0
**更新日期**: 2024-01-01
