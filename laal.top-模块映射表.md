# laal.top 域名模块映射表

## 📋 laal.top 路径与模块对照表

| 路径 | 项目名称 | 技术栈 | 端口 | 说明 |
|------|----------|--------|------|------|
| `/` | mixmlaal-web-vue-pc | Vue3 + Vite | 3000 | PC主站首页 |
| `/api/` | mixmlaal-node-api | Node.js + Express | 8080 | 核心API服务 |
| `/admin/` | mixmlaal-web-react-admin | React + Ant Design | 3002 | React管理后台 |
| `/admin-react/` | mixmlaal-web-react-admin | React + Ant Design | 3002 | React管理后台(备份路径) |
| `/driver/` | mixmlaal-web-driver-vue | Vue3 + Vant4 | 3003 | 司机端 |
| `/merchant/` | mixmlaal-web-merchant-vue | Vue3 + Element Plus | 3004 | 商家端管理后台 |
| `/h5/` | mixmlaal-web-h5-mobile | Vue3 + Vant4 | 3005 | H5移动端 |
| `/ruoyi/` | mixmlaal-web-ruoyi-vue | Vue2 + Element UI | 3006 | RuoYi后台管理系统 |
| `/springboot-admin/` | mixmlaal-admin-springboot | Spring Boot | 3007 | Spring Boot Admin监控 |
| `/springcloud-admin/` | mixmlaal-admin-springcloud | Spring Cloud | 3008 | Spring Cloud Admin监控 |
| `/harmony/` | mixmlaal-harmony-uniapp | UniApp | 3009 | HarmonyOS应用 |
| `/static/` | 静态资源服务 | Nginx | 3010 | 图片、文件等静态资源 |

---

## 📁 项目结构

```
mixmlaal/
├── 01-前端集群/
│   ├── mixmlaal-web-vue-pc/        # PC主站 (/)
│   ├── mixmlaal-web-driver-vue/    # 司机端 (/driver/)
│   ├── mixmlaal-web-merchant-vue/  # 商家端 (/merchant/)
│   ├── mixmlaal-web-h5-mobile/     # H5移动端 (/h5/)
│   ├── mixmlaal-web-react-admin/   # React管理后台 (/admin/, /admin-react/)
│   └── mixmlaal-web-ruoyi-vue/     # RuoYi后台 (/ruoyi/)
├── 02-后端微服务集群/
│   └── mixmlaal-node-api/          # Node API服务 (/api/)
├── 05-部署运维层/
│   ├── mixmlaal-deploy-config/     # Docker Compose配置
│   └── mixmlaal-nginx-config/      # Nginx配置 (laal.top.conf)
└── 06-项目文档层/
    └── 部署文档/
```

---

## 🚀 快速部署

### 方式一：Docker Compose 一键部署（推荐）

```bash
# 进入部署目录
cd 05-部署运维层/mixmlaal-deploy-config

# 复制并配置环境变量
cp ../../.env.example .env
# 编辑 .env 修改配置

# 启动所有服务
docker-compose -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 方式二：Windows 用户

双击运行根目录下的：
- `deploy-production.bat` - 启动生产环境
- `quick-start-all.bat` - 快速启动

### 方式三：Linux/Mac 用户

```bash
# 添加执行权限
chmod +x deploy-production.sh

# 部署
./deploy-production.sh start
```

---

## ⚙️ 配置说明

### 1. 环境变量配置

各项目都有 `.env.production` 文件，需要配置：

```env
# API地址
VITE_API_BASE_URL=https://laal.top/api/v1

# 其他配置...
```

### 2. DNS配置

将以下域名解析到服务器IP：
- `laal.top`
- `www.laal.top`

### 3. HTTPS配置

使用 Let's Encrypt 免费证书：
```bash
# 安装certbot
apt install certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d laal.top -d www.laal.top
```

---

## 📊 监控和维护

| 工具 | 地址 | 说明 |
|------|------|------|
| Prometheus | http://laal.top:9090 | 指标监控 |
| Grafana | http://laal.top:3001 | 可视化面板 |
| Kibana | http://laal.top:5601 | 日志查询 |

默认账号密码：
- Grafana: `admin/admin`

---

## ✅ 上线检查清单

- [ ] 所有项目能够正常构建
- [ ] Docker Compose配置正确
- [ ] 环境变量配置完成
- [ ] DNS解析生效
- [ ] HTTPS证书配置
- [ ] 防火墙规则配置
- [ ] 监控告警配置
- [ ] 自动备份策略
- [ ] 压测性能达标
- [ ] 用户协议和隐私政策完善

---

## 📞 技术支持

- 部署文档：`01-前端集群/mixmlaal-web-driver-vue/PRODUCTION_DEPLOYMENT.md`
- 快速开始：`QUICK_START.md`
- 项目架构：`06-项目文档层/`
