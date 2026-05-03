@echo off
REM ============================================
# laal.top 完全完整部署脚本（Windows）
# 包含用户提供的所有 42 个 laal.top 域名
# ============================================

setlocal enabledelayedexpansion
set PROJECT_ROOT=%~dp0

echo.
echo ============================================
echo     laal.top 完全完整部署工具
echo     包含用户提供的所有 42 个 laal.top 域名
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
echo   start    - 启动 laal.top 完全完整服务（所有 42 个域名）
echo   stop     - 停止所有服务
echo   restart  - 重启所有服务
echo   status   - 查看服务状态
echo   logs     - 查看服务日志
echo   help     - 显示此帮助信息
echo.
echo laal.top 完整 42 个域名列表:
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
    echo [WARNING] .env.laal.top 文件不存在，正在从模板创建...
    if exist "%PROJECT_ROOT%.env.example" (
        copy "%PROJECT_ROOT%.env.example" "%PROJECT_ROOT%.env.laal.top" >nul 2>&1
    )
    echo.
    echo [IMPORTANT] 请编辑 .env.laal.top 配置生产环境参数，然后重新运行！
    echo.
    goto end
)

echo.
echo [INFO] 开始构建和部署（完全完整版本）...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"

REM 复制环境变量
copy "%PROJECT_ROOT%.env.laal.top" ".env" >nul 2>&1

REM 复制完全完整的 Nginx 配置
copy "%PROJECT_ROOT%05-部署运维层\mixmlaal-nginx-config\mixmlaal-conf-d\laal.top-complete.conf" "%PROJECT_ROOT%05-部署运维层\mixmlaal-nginx-config\mixmlaal-conf-d\laal.top.conf" >nul 2>&1

REM 尝试使用完整配置启动
if exist "docker-compose.laal.top-full.yml" (
    docker-compose -f docker-compose.laal.top-full.yml up -d --build
) else (
    if exist "docker-compose.laal.top.yml" (
        docker-compose -f docker-compose.laal.top.yml up -d --build
    ) else (
        docker-compose up -d --build
    )
)

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo     [SUCCESS] laal.top 完全完整部署成功！
    echo ============================================
    echo.
    echo 用户提供的 42 个域名已完整配置！
    echo.
    echo 本地访问:
    echo   - http://localhost              （PC主站）
    echo   - http://localhost:3003         （司机端）
    echo   - http://localhost:3004         （商家端）
    echo   - http://localhost:3005         （H5移动端）
    echo   - http://localhost:3002         （React管理后台）
    echo   - http://localhost:3001         （Grafana监控）
    echo   - http://localhost:9090         （Prometheus）
    echo.
    echo 查看状态: %~nx0 status
    echo 查看日志: %~nx0 logs
    echo.
    echo 详细文档: laal.top-complete-list.md
    echo.
) else (
    echo [ERROR] 部署失败，请检查日志
)

goto end

:stop
echo [INFO] 正在停止 laal.top 服务...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.laal.top-full.yml" (
    docker-compose -f docker-compose.laal.top-full.yml down
) else (
    if exist "docker-compose.laal.top.yml" (
        docker-compose -f docker-compose.laal.top.yml down
    ) else (
        docker-compose down
    )
)
echo [OK] 服务已停止
goto end

:restart
echo [INFO] 正在重启 laal.top 服务...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.laal.top-full.yml" (
    docker-compose -f docker-compose.laal.top-full.yml down
    timeout /t 3 /nobreak >nul
    docker-compose -f docker-compose.laal.top-full.yml up -d --build
) else (
    if exist "docker-compose.laal.top.yml" (
        docker-compose -f docker-compose.laal.top.yml down
        timeout /t 3 /nobreak >nul
        docker-compose -f docker-compose.laal.top.yml up -d --build
    ) else (
        docker-compose down
        timeout /t 3 /nobreak >nul
        docker-compose up -d --build
    )
)
echo [OK] 服务已重启
goto end

:status
echo [INFO] 服务状态:
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.laal.top-full.yml" (
    docker-compose -f docker-compose.laal.top-full.yml ps
) else (
    if exist "docker-compose.laal.top.yml" (
        docker-compose -f docker-compose.laal.top.yml ps
    ) else (
        docker-compose ps
    )
)
goto end

:logs
echo [INFO] 服务日志（Ctrl+C退出）:
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.laal.top-full.yml" (
    docker-compose -f docker-compose.laal.top-full.yml logs -f
) else (
    if exist "docker-compose.laal.top.yml" (
        docker-compose -f docker-compose.laal.top.yml logs -f
    ) else (
        docker-compose logs -f
    )
)
goto end

:end
endlocal
echo.
pause

