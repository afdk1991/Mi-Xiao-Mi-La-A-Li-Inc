@echo off
REM ============================================
# laal.top 一键部署脚本 (Windows) - 完整版本
# 包含所有 laal.top 域名路径对应的服务
# ============================================

setlocal enabledelayedexpansion
set PROJECT_ROOT=%~dp0

echo.
echo ============================================
echo    laal.top 项目部署工具 - 完整版本
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
echo   start    - 启动 laal.top 所有服务
echo   stop     - 停止所有服务
echo   restart  - 重启所有服务
echo   status   - 查看服务状态
echo   logs     - 查看服务日志
echo   help     - 显示此帮助信息
echo.
echo 配置文件: .env.laal.top
echo 部署配置: 05-部署运维层/mixmlaal-deploy-config/docker-compose.laal.top-full.yml
echo.
goto end

:start
echo %BLUE%[INFO]%NC% 检查环境...

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
    copy "%PROJECT_ROOT%.env.example" "%PROJECT_ROOT%.env.laal.top" >nul 2>&1
    echo.
    echo [IMPORTANT] 请编辑 .env.laal.top 配置生产环境参数，然后重新运行！
    echo.
    goto end
)

echo.
echo [INFO] 开始构建和部署...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"

REM 复制环境变量
copy "%PROJECT_ROOT%.env.laal.top" ".env" >nul 2>&1

REM 启动
echo [INFO] 正在启动 laal.top 服务（完整版本）...
docker-compose -f docker-compose.laal.top-full.yml up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo    [SUCCESS] laal.top 部署成功！
    echo ============================================
    echo.
    echo 访问地址:
    echo   - 主站: http://localhost 或 https://laal.top
    echo   - 司机端: http://localhost:3003
    echo   - 商家端: http://localhost:3004
    echo   - H5移动端: http://localhost:3005
    echo   - 管理后台: http://localhost:3002
    echo   - RuoYi后台: http://localhost:3006
    echo   - SpringBoot Admin: http://localhost:3007
    echo   - SpringCloud Admin: http://localhost:3008
    echo   - HarmonyOS: http://localhost:3009
    echo.
    echo 监控面板:
    echo   - Grafana: http://localhost:3001 (admin/admin123)
    echo   - Prometheus: http://localhost:9090
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
docker-compose -f docker-compose.laal.top-full.yml down
echo [OK] 服务已停止
goto end

:restart
echo [INFO] 正在重启 laal.top 服务...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
docker-compose -f docker-compose.laal.top-full.yml down
timeout /t 3 /nobreak >nul
docker-compose -f docker-compose.laal.top-full.yml up -d
echo [OK] 服务已重启
goto end

:status
echo [INFO] 服务状态:
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
docker-compose -f docker-compose.laal.top-full.yml ps
goto end

:logs
echo [INFO] 服务日志 (Ctrl+C退出):
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
docker-compose -f docker-compose.laal.top-full.yml logs -f
goto end

:end
endlocal
echo.
pause
