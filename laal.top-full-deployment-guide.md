# laal.top 完整部署和域名证书方案

## 📋 目录

1. [概览](#1-概览)
2. [DNS 域名解析配置](#2-dns-域名解析配置)
3. [Let's Encrypt 自动 SSL 证书](#3-lets-encrypt-自动-ssl-证书)
4. [完整部署步骤](#4-完整部署步骤)

---

## 1. 概览

### 🎯 方案特点

- ✅ **完整 42 个域名**配置
- ✅ **DNS 域名解析**指南
- ✅ **自动 HTTPS/SSL**（Let's Encrypt）
- ✅ **Traefik 反向代理**（高性能）
- ✅ **证书自动续期**（无需手动操作）
- ✅ **HTTP 自动重定向**到 HTTPS

---

## 2. DNS 域名解析配置

### 2.1 完整 DNS 解析记录

在您的域名服务商（如阿里云、腾讯云、Cloudflare 等），添加以下 42 条 DNS 解析记录：

| 序号 | 域名类型 | 完整域名 | 记录类型 | 记录值 |
|------|---------|---------|---------|---------|
| 1 | 主域名 | laal.top | A | 您的服务器 IP |
| 2 | 主域名 | www.laal.top | A | 您的服务器 IP |
| 3 | 管理后台 | admin.laal.top | A | 您的服务器 IP |
| 4 | API服务 | api.laal.top | A | 您的服务器 IP |
| 5 | APP端 | app.laal.top | A | 您的服务器 IP |
| 6 | 认证服务 | auth.laal.top | A | 您的服务器 IP |
| 7 | 社交生态 | blog.laal.top | A | 您的服务器 IP |
| 8 | 会员中心 | center.laal.top | A | 您的服务器 IP |
| 9 | 云服务 | cloud.laal.top | A | 您的服务器 IP |
| 10 | 数据服务 | data.laal.top | A | 您的服务器 IP |
| 11 | 开发环境 | dev.laal.top | A | 您的服务器 IP |
| 12 | 代驾模块 | dh.laal.top | A | 您的服务器 IP |
| 13 | 货运外卖 | dnpj.laal.top | A | 您的服务器 IP |
| 14 | 社交生态 | dy.laal.top | A | 您的服务器 IP |
| 15 | 运维服务器 | fwq.laal.top | A | 您的服务器 IP |
| 16 | 新增 | gy.laal.top | A | 您的服务器 IP |
| 17 | 帮助中心 | help.laal.top | A | 您的服务器 IP |
| 18 | 图片服务 | img.laal.top | A | 您的服务器 IP |
| 19 | 登录入口 | login.laal.top | A | 您的服务器 IP |
| 20 | 电商生态 | mall.laal.top | A | 您的服务器 IP |
| 21 | 电商生态 | market.laal.top | A | 您的服务器 IP |
| 22 | 移动端 | m.laal.top | A | 您的服务器 IP |
| 23 | 移动端 | mobile.laal.top | A | 您的服务器 IP |
| 24 | 新闻服务 | news.laal.top | A | 您的服务器 IP |
| 25 | 支付服务 | pay.laal.top | A | 您的服务器 IP |
| 26 | 门户生态 | portal.laal.top | A | 您的服务器 IP |
| 27 | 安全风控 | secure.laal.top | A | 您的服务器 IP |
| 28 | 客服支持 | service.laal.top | A | 您的服务器 IP |
| 29 | 电商生态 | shop.laal.top | A | 您的服务器 IP |
| 30 | 新增 | sj.laal.top | A | 您的服务器 IP |
| 31 | 新增 | sp.laal.top | A | 您的服务器 IP |
| 32 | 统计服务 | stats.laal.top | A | 您的服务器 IP |
| 33 | 电商生态 | store.laal.top | A | 您的服务器 IP |
| 34 | 客服支持 | support.laal.top | A | 您的服务器 IP |
| 35 | 测试环境 | test.laal.top | A | 您的服务器 IP |
| 36 | 用户管理 | user.laal.top | A | 您的服务器 IP |
| 37 | 社交生态 | video.laal.top | A | 您的服务器 IP |
| 38 | 新增 | wp.laal.top | A | 您的服务器 IP |
| 39 | 新闻服务 | xw.laal.top | A | 您的服务器 IP |
| 40 | 新增 | yp.laal.top | A | 您的服务器 IP |
| 41 | 新增 | yy.laal.top | A | 您的服务器 IP |
| 42 | ACME挑战 | _acme-challenge.laal.top | TXT | （Let's Encrypt 验证，可选） |

### 2.2 DNS 配置要点

- 所有记录使用 **A 记录**类型
- TTL 设置为 **600（10分钟）**或更低，便于快速生效
- 等待 DNS 解析生效（通常几分钟到几小时）

---

## 3. Let's Encrypt 自动 SSL 证书

### 3.1 方案特点

- **免费！** Let's Encrypt 证书完全免费
- **自动申请！** Traefik 自动申请证书
- **自动续期！** 证书到期前自动续期
- **支持多域名！** 所有 42 个域名使用同一张证书
- **TLS 1.2+！** 现代、安全的加密协议

### 3.2 工作原理

```
用户访问 https://laal.top
         ↓
    Traefik（反向代理）
         ↓
    检查证书
         ↓
    自动申请/续期（Let's Encrypt）
         ↓
    安全连接 ←→ 后端服务
```

---

## 4. 完整部署步骤

### 🚀 方案一：一键部署（Windows，推荐）

#### 步骤 1：配置 DNS 解析

在域名服务商添加所有 42 条 DNS 记录（见上方表格）

#### 步骤 2：运行一键部署脚本

```cmd
# 确保在项目根目录
cd "f:\Mi Xiao Mi La A Li Inc"

# 运行完整部署脚本
deploy-laal.top-full-ssl.bat start
```

#### 步骤 3：按照提示操作

脚本会自动：
1. 检查 Docker 环境
2. 配置环境变量
3. 启动所有服务
4. 自动申请 SSL 证书
5. 显示访问地址

#### 步骤 4：完成！

访问 `https://laal.top`，您的所有域名都已配置好 HTTPS！

---

### 🐧 方案二：Docker Compose 部署

#### 步骤 1：配置环境变量

```bash
# 复制环境变量模板
cp .env.laal.top .env

# 编辑配置
# 修改 ACME_EMAIL、密码等
```

#### 步骤 2：启动服务

```bash
cd "05-部署运维层/mixmlaal-deploy-config"

# 启动所有服务（含自动 HTTPS）
docker-compose -f docker-compose.ssl.yml up -d --build
```

---

## 📁 项目文件

| 文件 | 位置 | 说明 |
|------|------|------|
| 完整部署脚本 | `deploy-laal.top-full-ssl.bat` | 一键部署脚本（Windows） |
| DNS 和证书指南 | `laal.top-dns-cert-guide.md` | 详细指南 |
| 完整部署指南 | `laal.top-full-deployment-guide.md` | 本文档 |
| 完整域名列表 | `laal.top-complete-list.md` | 所有域名列表 |
| Docker Compose SSL | `05-部署运维层/mixmlaal-deploy-config/docker-compose.ssl.yml` | 自动 SSL 配置 |
| 环境变量配置 | `.env.laal.top` | 环境变量配置 |

---

## 🔍 验证部署

### 检查服务状态

```cmd
# Windows
deploy-laal.top-full-ssl.bat status
```

或

```bash
# 查看服务状态
cd "05-部署运维层/mixmlaal-deploy-config"
docker-compose -f docker-compose.ssl.yml ps

# 查看 Traefik Dashboard
# 浏览器访问：http://localhost:8080
```

### 测试 HTTPS 访问

使用浏览器访问：
- `https://laal.top` （主域名）
- `https://www.laal.top` （www）
- `https://admin.laal.top` （管理后台）
- `https://api.laal.top` （API）
- `https://app.laal.top` （APP）
- 以及其他所有域名！

所有域名都应该有安全锁标志 ✅

---

## ⚙️ 自定义配置

### 修改邮箱地址

在 `.env.laal.top` 中修改：
```
ACME_EMAIL=your-real-email@example.com
```

### 修改数据库密码

在 `.env.laal.top` 中修改：
```
MYSQL_ROOT_PASSWORD=your-strong-password
REDIS_PASSWORD=your-strong-password
JWT_SECRET=your-strong-jwt-key
```

---

## 🎉 完成！

恭喜！您的 laal.top 项目已具备完整的 DNS 解析、域名证书和自动 HTTPS！

访问您的网站：`https://laal.top`

