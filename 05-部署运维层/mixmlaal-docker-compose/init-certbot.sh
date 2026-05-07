#!/bin/bash

# ============================================
# SSL证书申请脚本
# ============================================

set -e

echo "开始申请SSL证书..."

# 域名列表
DOMAINS="laal.top www.laal.top admin.laal.top api.laal.top"

# 邮箱地址（请修改为您的邮箱）
EMAIL="youremail@example.com"

# 创建临时nginx配置用于证书验证
cat > /tmp/nginx-cert.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name laal.top www.laal.top admin.laal.top api.laal.top;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 'SSL证书申请中...';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# 启动临时nginx容器
docker run -d --name nginx-cert \
    -p 80:80 \
    -v /tmp/nginx-cert.conf:/etc/nginx/nginx.conf:ro \
    -v certbot-www:/var/www/certbot \
    nginx:alpine

# 等待nginx启动
sleep 5

# 申请证书
docker run --rm \
    -v certbot-www:/var/www/certbot \
    -v certbot-conf:/etc/letsencrypt \
    certbot/certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d laal.top \
    -d www.laal.top \
    -d admin.laal.top \
    -d api.laal.top

# 停止并删除临时nginx容器
docker stop nginx-cert
docker rm nginx-cert

# 复制证书到nginx ssl目录
docker run --rm \
    -v certbot-conf:/etc/letsencrypt:ro \
    -v nginx-ssl:/etc/nginx/ssl \
    alpine sh -c "cp /etc/letsencrypt/live/laal.top/fullchain.pem /etc/nginx/ssl/laal.top.crt && cp /etc/letsencrypt/live/laal.top/privkey.pem /etc/nginx/ssl/laal.top.key"

echo "SSL证书申请完成！"
echo "证书位置：/etc/nginx/ssl/laal.top.crt"
echo "私钥位置：/etc/nginx/ssl/laal.top.key"