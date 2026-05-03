# laal.top 域名路径与模块对应修正表

## 🔧 问题说明

之前存在 **Nginx 配置中的服务名与 Docker Compose 配置中的服务名不一致**的问题，已修正！

---

## 📊 laal.top 域名路径与模块完全对应表

| 序号 | URL 路径 | 项目名称 | 技术栈 | 本地端口 | Docker服务名 (修正后) | Nginx反向代理 (修正后) | 状态 |
|------|----------|----------|--------|----------|----------------------|----------------------|------|
| 1 | `/` | mixmlaal-web-vue-pc | Vue3 + Vite | 3000 | `pc-frontend` | `http://pc-frontend:3000` | ✅ 已匹配 |
| 2 | `/api/` | mixmlaal-node-api | Node.js + Express | 8080 | `node-api` | `http://node-api:8080` | ✅ 已匹配 |
| 3 | `/admin/` | mixmlaal-web-react-admin | React + Ant Design | 3002 | `react-admin` | `http://react-admin:3002/` | ✅ 已匹配 |
| 4 | `/admin-react/` | mixmlaal-web-react-admin | React + Ant Design | 3002 | `react-admin` | `http://react-admin:3002/` | ✅ 已匹配 |
| 5 | `/driver/` | mixmlaal-web-driver-vue | Vue3 + Vant4 | 3003 | `driver-app` | `http://driver-app:3003/` | ✅ 已匹配 |
| 6 | `/merchant/` | mixmlaal-web-merchant-vue | Vue3 + Element Plus | 3004 | `merchant-admin` | `http://merchant-admin:3004/` | ✅ 已匹配 |
| 7 | `/h5/` | mixmlaal-web-h5-mobile | Vue3 + Vant4 | 3005 | `h5-mobile` | `http://h5-mobile:3005/` | ✅ 已匹配 |
| 8 | `/ruoyi/` | mixmlaal-web-ruoyi-vue | Vue2 + Element UI | 3006 | `ruoyi-admin` | `http://ruoyi-admin:3006/` | ✅ 已匹配 |
| 9 | `/static/` | 静态资源服务 | Nginx | 3010 | `static-server` | `http://static-server:3010/` | ✅ 已匹配 |
| 10 | `/health` | Nginx健康检查 | - | - | - | - | ✅ 已匹配 |

---

## 📁 新创建的修正文件

| 文件 | 位置 | 说明 |
|------|------|------|
| laal.top-fix.conf | `05-部署运维层/mixmlaal-nginx-config/mixmlaal-conf-d/` | 修正后的Nginx配置，服务名已匹配 |
| docker-compose.laal.top-fix.yml | `05-部署运维层/mixmlaal-deploy-config/` | 修正后的Docker Compose配置 |
| deploy-laal.top-fix.bat | 项目根目录 | 修正后的Windows部署脚本 |
| laal.top-域名对应修正表.md | 项目根目录 | 本文档 |

---

## 🚀 使用修正版进行部署

### 方式一：使用修正版脚本（推荐）

```cmd
# Windows
deploy-laal.top-fix.bat start

# Linux/Mac
chmod +x deploy-laal.top-fix.sh
./deploy-laal.top-fix.sh start
```

### 方式二：手动使用修正版配置

```bash
cd 05-部署运维层/mixmlaal-deploy-config

# 复制环境变量
cp ../../.env.laal.top .env

# 启动（使用修正版配置）
docker-compose -f docker-compose.laal.top-fix.yml up -d --build
```

---

## 📝 服务名对比（修复前 vs 修复后）

| 模块 | 旧服务名 (Nginx配置) | 新服务名 (Docker Compose) | 状态 |
|------|---------------------|-------------------------|------|
| PC主站 | mixmlaal-frontend-vue | pc-frontend | ✅ 已修正 |
| API服务 | mixmlaal-api-node | node-api | ✅ 已修正 |
| 管理后台 | mixmlaal-admin-react | react-admin | ✅ 已修正 |
| 司机端 | mixmlaal-driver-vue | driver-app | ✅ 已修正 |
| 商家端 | mixmlaal-merchant-vue | merchant-admin | ✅ 已修正 |
| H5移动端 | mixmlaal-h5-vue | h5-mobile | ✅ 已修正 |
| RuoYi后台 | mixmlaal-ruoyi-vue | ruoyi-admin | ✅ 已修正 |
| 静态资源 | mixmlaal-static-assets | static-server | ✅ 已修正 |

---

## ⚠️ 注意事项

1. **确保使用修正版配置文件**
   - Docker Compose: 用 `docker-compose.laal.top-fix.yml`
   - Nginx: 用 `laal.top-fix.conf`

2. **如需使用其他路径的模块（springboot-admin, springcloud-admin, harmony）**
   需在 docker-compose 配置中添加对应的服务定义

---

## ✅ 修正完成确认

- ✅ Nginx 配置中的服务名已更新
- ✅ Docker Compose 配置已对应
- ✅ 部署脚本已更新
- ✅ 文档已完善

现在 laal.top 的所有域名路径已完整对应到各个模块！🎉
