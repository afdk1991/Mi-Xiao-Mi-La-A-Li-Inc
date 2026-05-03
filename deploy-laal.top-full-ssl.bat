@echo off
REM ============================================
# laal.top 完全完整部署脚本（Windows）
# 包含自动 HTTPS/SSL 证书（Let's Encrypt + Traefik）
# ============================================

setlocal enabledelayedexpansion
set PROJECT_ROOT=%~dp0

echo.
echo ============================================
echo     laal.top 完全完整部署工具
#     包含自动 HTTPS/SSL 证书（Let's Encrypt）
echo ============================================
echo.

if "%~1"=="" goto help
if /i "%~1"=="help" goto help
if /i "%~1"=="start" goto start
if /i "%~1"=="stop" goto stop
if /i "%~1"=="restart" goto restart
if /i "%~1"=="status" goto status
if /i "%~1"=="logs" goto logs

:help
echo 用法: %~nx0 [命令]
echo.
echo 命令列表:
echo   start    - 启动 laal.top 完全完整服务（包含自动 HTTPS）
echo   stop     - 停止所有服务
echo   restart  - 重启所有服务
echo   status   - 查看服务状态
echo   logs     - 查看服务日志
echo   help     - 显示此帮助信息
echo.
echo 重要：请先配置 DNS 解析！
echo 所有 42 个域名都需要指向您的服务器 IP
echo.
echo 完整 42 个域名列表:
echo   - laal.top / www.laal.top           （主域名）
echo   - admin.laal.top / login.laal.top     （管理后台）
echo   - api.laal.top                        （API服务）
echo   - app.laal.top / mobile.laal.top / m.laal.top  （APP/移动端）
echo   - auth.laal.top / secure.laal.top     （安全/认证）
echo   - blog.laal.top / dy.laal.top / video.laal.top  （社交生态）
echo   - center.laal.top / user.laal.top     （用户/会员）
echo   - cloud.laal.top / fwq.laal.top       （云/运维）
echo   - data.laal.top / stats.laal.top      （数据/统计）
echo   - dev.laal.top / test.laal.top        （开发/测试）
echo   - dh.laal.top                        （代驾/出行）
echo   - dnpj.laal.top                      （货运/外卖）
echo   - help.laal.top / support.laal.top / service.laal.top  （帮助/客服）
echo   - img.laal.top                        （图片服务）
echo   - mall.laal.top / market.laal.top / shop.laal.top / store.laal.top  （电商生态）
echo   - news.laal.top / xw.laal.top        （新闻服务）
echo   - pay.laal.top                        （支付服务）
echo   - portal.laal.top                     （门户生态）
echo   - gy.laal.top / sj.laal.top / sp.laal.top / wp.laal.top / yp.laal.top / yy.laal.top  （新增）
echo   - _acme-challenge.laal.top            （Let's Encrypt 验证）
echo.
echo 详细文档:
echo   - laal.top-dns-cert-guide.md       （DNS和证书指南）
echo   - laal.top-complete-list.md         （完整域名列表）
echo.
goto end

:start
echo.
echo [INFO] 检查环境...

REM 检查 Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker 未安装或未启动，请先安装并启动 Docker Desktop
    goto end
)
echo [OK] Docker 已就绪

REM 检查 docker-compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Docker Compose 未安装
        goto end
    )
)
echo [OK] Docker Compose 已就绪

REM 检查环境变量配置
if not exist "%PROJECT_ROOT%.env.laal.top" (
    echo [WARNING] .env.laal.top 文件不存在，正在创建...
    echo [INFO] 请编辑该文件，配置以下参数：
    echo   - ACME_EMAIL=youremail@example.com
    echo   - MYSQL_ROOT_PASSWORD=your-strong-password
    echo   - REDIS_PASSWORD=your-strong-password
    echo   - JWT_SECRET=your-strong-jwt-key
    echo.
    echo [IMPORTANT] 编辑配置后，请重新运行！
    echo.
    goto end
)

REM 询问是否配置了 DNS
echo.
set /p CONFIGURED_DNS=请问您已经在域名服务商配置了所有 42 条 DNS 记录了吗？(y/n): 
if /i "%CONFIGURED_DNS%" neq "y" (
    echo.
    echo [INFO] 好的，请先完成 DNS 配置
    echo.
    echo DNS 配置要点:
    echo   1. 所有 42 个域名都指向同一服务器 IP
    echo   2. 使用 A 记录，TTL 设置为 600 或更低
    echo   3. 详细步骤参考 laal.top-dns-cert-guide.md
    echo.
    echo 等配置完 DNS 后，再重新运行此脚本！
    echo.
    goto end
)

REM 询问邮箱地址
echo.
set /p ACME_EMAIL_INPUT=请输入您的邮箱地址（用于 Let's Encrypt 证书）: 

REM 更新环境变量
echo [INFO] 更新环境变量配置...
(
    echo # ============================================
    echo # laal.top 项目环境变量配置
    echo # ============================================
    echo.
    echo # ============================================
    echo # 基础配置
    echo # ============================================
    echo NODE_ENV=production
    echo TZ=Asia/Shanghai
    echo.
    echo # ============================================
    echo # Let's Encrypt 证书配置
    echo # ============================================
    echo ACME_EMAIL=%ACME_EMAIL_INPUT%
    echo.
    echo # ============================================
    echo # 数据库配置
    echo # ============================================
    echo MYSQL_HOST=mysql
    echo MYSQL_PORT=3306
    echo MYSQL_USER=root
    echo MYSQL_ROOT_PASSWORD=root123456
    echo MYSQL_DATABASE=mixmlaal
    echo.
    echo REDIS_HOST=redis
    echo REDIS_PORT=6379
    echo REDIS_PASSWORD=redis123456
    echo.
    echo # ============================================
    echo # 安全配置
    echo # ============================================
    echo JWT_SECRET=mixmlaal-super-secret-jwt-key-change-this-to-a-strong-key
    echo.
    echo # ============================================
    echo # API 配置
    echo # ============================================
    echo VITE_API_BASE_URL=https://laal.top/api/v1
    echo VITE_API_TIMEOUT=15000
    echo.
    echo # ============================================
    echo # 监控配置
    echo # ============================================
    echo GRAFANA_USER=admin
    echo GRAFANA_PASSWORD=admin123
    echo.
    echo # ============================================
    echo # 文件路径配置
    echo # ============================================
    echo DATA_PATH=./data
    echo LOGS_PATH=./logs
    echo STATIC_PATH=./static
) > "%PROJECT_ROOT%.env.laal.top"

echo [OK] 环境变量配置已更新！
echo.
echo [IMPORTANT] 请编辑 .env.laal.top 文件，修改以下密码为强密码：
echo   - MYSQL_ROOT_PASSWORD
echo   - REDIS_PASSWORD
echo   - JWT_SECRET
echo   - GRAFANA_PASSWORD
echo.
set /p READY_TO_GO=修改好密码后，请按回车继续...

echo.
echo [INFO] 开始构建和部署（含自动 HTTPS/SSL）...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"

REM 复制环境变量
copy "%PROJECT_ROOT%.env.laal.top" ".env" >nul 2>&1

REM 使用 SSL 配置启动
echo [INFO] 正在启动 laal.top 服务（含自动 HTTPS）...
docker-compose -f docker-compose.ssl.yml up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo     [SUCCESS] laal.top 部署成功！
    echo ============================================
    echo.
    echo 自动 HTTPS/SSL 证书正在申请中（由 Traefik 处理）...
    echo.
    echo 访问地址（HTTPS）:
    echo   - https://laal.top                    （主域名）
    echo   - https://www.laal.top                （主域名 www）
    echo   - https://admin.laal.top              （管理后台）
    echo   - https://api.laal.top                （API 服务）
    echo   - https://app.laal.top                （APP）
    echo   - https://blog.laal.top               （博客）
    echo   - https://mall.laal.top               （商城）
    echo   - https://shop.laal.top               （商店）
    echo   - https://user.laal.top               （用户中心）
    echo   - https://pay.laal.top                （支付）
    echo   - ... 以及其他所有 42 个域名
    echo.
    echo 本地管理:
    echo   - http://localhost:8080              （Traefik Dashboard）
    echo   - https://laal.top:3001              （Grafana 监控）
    echo.
    echo 重要提示:
    echo   - Let's Encrypt 证书会在几分钟内自动申请完成
    echo   - 证书自动续期（无需手动操作）
    echo   - 所有 HTTP 请求自动重定向到 HTTPS
    echo.
    echo 查看状态: %~nx0 status
    echo 查看日志: %~nx0 logs
    echo.
) else (
    echo [ERROR] 部署失败，请检查日志
)

goto end

:stop
echo [INFO] 正在停止 laal.top 服务...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
docker-compose -f docker-compose.ssl.yml down
echo [OK] 服务已停止
goto end

:restart
echo [INFO] 正在重启 laal.top 服务...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
docker-compose -f docker-compose.ssl.yml down
timeout /t 3 /nobreak >nul
docker-compose -f docker-compose.ssl.yml up -d --build
echo [OK] 服务已重启
goto end

:status
echo [INFO] 服务状态:
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
docker-compose -f docker-compose.ssl.yml ps
echo.
echo Traefik Dashboard: http://localhost:8080
echo.
goto end

:logs
echo [INFO] 服务日志（Ctrl+C退出）:
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
docker-compose -f docker-compose.ssl.yml logs -f
goto end

:end
endlocal
echo.
pause

