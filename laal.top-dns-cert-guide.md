# laal.top 完整 DNS 解析和域名证书方案

## 📋 目录

1. [DNS 域名解析配置](#1-dns-域名解析配置)
2. [Let's Encrypt 免费 SSL 证书配置](#2-lets-encrypt-免费-ssl-证书配置)
3. [完整的 HTTPS 配置](#3-完整的-https-配置)
4. [部署步骤](#4-部署步骤)

---

## 1. DNS 域名解析配置

### 1.1 完整 DNS 解析记录

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
| 42 | ACME挑战 | _acme-challenge.laal.top | TXT | （Let's Encrypt 验证，稍后填） |

---

## 2. Let's Encrypt 免费 SSL 证书配置

### 2.1 方案一：使用 Certbot + Nginx（推荐）

#### 步骤 1：在服务器上安装 Certbot

Ubuntu/Debian 系统：
```bash
# 更新系统
sudo apt-get update && sudo apt-get upgrade -y

# 安装 Certbot 和 Nginx 插件
sudo apt-get install certbot python3-certbot-nginx -y
```

CentOS/RHEL 系统：
```bash
# 安装 EPEL 仓库
sudo yum install epel-release -y

# 安装 Certbot 和 Nginx 插件
sudo yum install certbot python3-certbot-nginx -y
```

#### 步骤 2：申请多域名证书

使用命令同时申请所有 42 个域名的证书：

```bash
# 运行 Certbot 申请证书
sudo certbot --nginx \
  -d laal.top \
  -d www.laal.top \
  -d admin.laal.top \
  -d api.laal.top \
  -d app.laal.top \
  -d auth.laal.top \
  -d blog.laal.top \
  -d center.laal.top \
  -d cloud.laal.top \
  -d data.laal.top \
  -d dev.laal.top \
  -d dh.laal.top \
  -d dnpj.laal.top \
  -d dy.laal.top \
  -d fwq.laal.top \
  -d gy.laal.top \
  -d help.laal.top \
  -d img.laal.top \
  -d login.laal.top \
  -d mall.laal.top \
  -d market.laal.top \
  -d m.laal.top \
  -d mobile.laal.top \
  -d news.laal.top \
  -d pay.laal.top \
  -d portal.laal.top \
  -d secure.laal.top \
  -d service.laal.top \
  -d shop.laal.top \
  -d sj.laal.top \
  -d sp.laal.top \
  -d stats.laal.top \
  -d store.laal.top \
  -d support.laal.top \
  -d test.laal.top \
  -d user.laal.top \
  -d video.laal.top \
  -d wp.laal.top \
  -d xw.laal.top \
  -d yp.laal.top \
  -d yy.laal.top \
  -d _acme-challenge.laal.top
```

或者使用 DNS 验证方式（更适合多域名）：

```bash
# 使用 DNS 验证申请证书
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  -d laal.top -d www.laal.top \
  -d admin.laal.top \
  -d api.laal.top \
  -d app.laal.top \
  -d auth.laal.top \
  -d blog.laal.top \
  -d center.laal.top \
  -d cloud.laal.top \
  -d data.laal.top \
  -d dev.laal.top \
  -d dh.laal.top \
  -d dnpj.laal.top \
  -d dy.laal.top \
  -d fwq.laal.top \
  -d gy.laal.top \
  -d help.laal.top \
  -d img.laal.top \
  -d login.laal.top \
  -d mall.laal.top \
  -d market.laal.top \
  -d m.laal.top \
  -d mobile.laal.top \
  -d news.laal.top \
  -d pay.laal.top \
  -d portal.laal.top \
  -d secure.laal.top \
  -d service.laal.top \
  -d shop.laal.top \
  -d sj.laal.top \
  -d sp.laal.top \
  -d stats.laal.top \
  -d store.laal.top \
  -d support.laal.top \
  -d test.laal.top \
  -d user.laal.top \
  -d video.laal.top \
  -d wp.laal.top \
  -d xw.laal.top \
  -d yp.laal.top \
  -d yy.laal.top
```

#### 步骤 3：自动续期

Let's Encrypt 证书有效期为 90 天，设置自动续期：

```bash
# 测试续期
sudo certbot renew --dry-run

# 添加到 crontab（每月初）
sudo crontab -e

# 添加以下行
0 0 1 * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 3. 完整的 HTTPS 配置

### 3.1 Nginx HTTPS 配置文件

创建完整的 HTTPS 配置：

```nginx
# 所有 HTTP 请求重定向到 HTTPS
server {
    listen 80;
    server_name laal.top
                www.laal.top
                admin.laal.top
                api.laal.top
                app.laal.top
                auth.laal.top
                blog.laal.top
                center.laal.top
                cloud.laal.top
                data.laal.top
                dev.laal.top
                dh.laal.top
                dnpj.laal.top
                dy.laal.top
                fwq.laal.top
                gy.laal.top
                help.laal.top
                img.laal.top
                login.laal.top
                mall.laal.top
                market.laal.top
                m.laal.top
                mobile.laal.top
                news.laal.top
                pay.laal.top
                portal.laal.top
                secure.laal.top
                service.laal.top
                shop.laal.top
                sj.laal.top
                sp.laal.top
                stats.laal.top
                store.laal.top
                support.laal.top
                test.laal.top
                user.laal.top
                video.laal.top
                wp.laal.top
                xw.laal.top
                yp.laal.top
                yy.laal.top;

    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html;
        try_files $uri $uri/ =404;
    }

    # 重定向到 HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name laal.top www.laal.top;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/laal.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/laal.top/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # 主域名路径配置
    location / {
        proxy_pass http://pc-frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://node-api:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://react-admin:3002/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /driver/ {
        proxy_pass http://driver-app:3003/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /merchant/ {
        proxy_pass http://merchant-admin:3004/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /h5/ {
        proxy_pass http://h5-mobile:3005/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ruoyi/ {
        proxy_pass http://ruoyi-admin:3006/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        proxy_pass http://static-server:3010/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}

# 其他子域名配置（示例）
server {
    listen 443 ssl http2;
    server_name admin.laal.top login.laal.top;

    ssl_certificate /etc/letsencrypt/live/laal.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/laal.top/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    location / {
        proxy_pass http://react-admin:3002/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name api.laal.top;

    ssl_certificate /etc/letsencrypt/live/laal.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/laal.top/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    location / {
        proxy_pass http://node-api:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 同样的方式配置其他所有子域名...
```

---

## 4. 部署步骤

### 完整部署流程

#### 步骤 1：配置 DNS 解析
在域名服务商添加所有 42 条 DNS 记录

#### 步骤 2：启动项目服务
```bash
# 使用完整部署脚本
deploy-laal.top-complete.bat start
```

#### 步骤 3：申请 Let's Encrypt 证书
运行 Certbot 命令

#### 步骤 4：配置 Nginx HTTPS
使用完整的 HTTPS 配置

#### 步骤 5：测试访问
通过浏览器访问 `https://laal.top` 和所有子域名

---

## 📚 相关文件

| 文件 | 位置 |
|------|------|
| Nginx完全完整配置 | `05-部署运维层/mixmlaal-nginx-config/mixmlaal-conf-d/laal.top-complete.conf` |
| 完整对照表 | `laal.top-complete-list.md` |
| 完整部署脚本 | `deploy-laal.top-complete.bat` |

