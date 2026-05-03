@echo off
REM ============================================
REM MIXMLAAL 项目一键生产部署脚本 (Windows版本)
REM ============================================

setlocal enabledelayedexpansion

REM 颜色代码 (Windows CMD)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 项目根目录
set "PROJECT_ROOT=%~dp0"
set "DEPLOY_DIR=%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"

echo.
echo ============================================
echo   MIXMLAAL 生产部署工具
echo ============================================
echo.

REM 检查参数
if "%~1"=="" goto help

REM 处理命令
if /i "%~1"=="start" goto start
if /i "%~1"=="stop" goto stop
if /i "%~1"=="restart" goto restart
if /i "%~1"=="status" goto status
if /i "%~1"=="logs" goto logs
if /i "%~1"=="help" goto help

:help
echo 用法: %~nx0 {命令}
echo.
echo 命令列表:
echo   start    - 启动完整部署
echo   stop     - 停止所有服务
echo   restart  - 重启服务
echo   status   - 查看服务状态
echo   logs     - 查看日志
echo   help     - 显示此帮助信息
echo.
echo 部署前请先编辑 %PROJECT_ROOT%.env 文件
echo.
goto end

:start
echo %BLUE%[INFO]%NC% 检查部署环境...

REM 检查 Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Docker 未安装或未启动，请先安装并启动 Docker Desktop
    goto end
)
echo %GREEN%[SUCCESS]%NC% Docker 已就绪

REM 检查 Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo %RED%[ERROR]%NC% Docker Compose 未安装
        goto end
    )
)
echo %GREEN%[SUCCESS]%NC% Docker Compose 已就绪

REM 检查环境变量文件
if not exist "%PROJECT_ROOT%.env" (
    echo %YELLOW%[WARNING]%NC% .env 文件不存在，正在从模板创建...
    if exist "%PROJECT_ROOT%.env.example" (
        copy "%PROJECT_ROOT%.env.example" "%PROJECT_ROOT%.env" >nul
        echo %GREEN%[SUCCESS]%NC% 已创建 .env 文件
        echo %BLUE%[INFO]%NC% 请编辑 %PROJECT_ROOT%.env 文件，填入真实配置后重新运行
        goto end
    ) else (
        echo %RED%[ERROR]%NC% 找不到 .env.example 文件
        goto end
    )
)
echo %GREEN%[SUCCESS]%NC% 环境变量文件存在

echo.
echo %BLUE%[INFO]%NC% 开始构建服务...
cd /d "%DEPLOY_DIR%"

REM 构建镜像
echo %BLUE%[INFO]%NC% 构建 Docker 镜像...
docker-compose -f docker-compose.prod.yml build --no-cache
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% 构建失败
    goto end
)

echo %GREEN%[SUCCESS]%NC% 服务构建完成
echo.

REM 启动服务
echo %BLUE%[INFO]%NC% 启动所有服务...
docker-compose -f docker-compose.prod.yml up -d
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% 启动失败
    goto end
)

echo %GREEN%[SUCCESS]%NC% 服务启动完成
echo.

echo %BLUE%[INFO]%NC% 服务状态:
docker-compose -f docker-compose.prod.yml ps

echo.
echo %GREEN%[SUCCESS]%NC% 部署完成！
echo %BLUE%[INFO]%NC% 请访问: http://localhost
goto end

:stop
echo %BLUE%[INFO]%NC% 停止服务...
cd /d "%DEPLOY_DIR%"
docker-compose -f docker-compose.prod.yml down
echo %GREEN%[SUCCESS]%NC% 服务已停止
goto end

:restart
echo %BLUE%[INFO]%NC% 重启服务...
cd /d "%DEPLOY_DIR%"
docker-compose -f docker-compose.prod.yml down
timeout /t 3 /nobreak >nul
docker-compose -f docker-compose.prod.yml up -d
echo %GREEN%[SUCCESS]%NC% 服务已重启
echo.
docker-compose -f docker-compose.prod.yml ps
goto end

:status
cd /d "%DEPLOY_DIR%"
echo %BLUE%[INFO]%NC% 服务状态:
docker-compose -f docker-compose.prod.yml ps
goto end

:logs
cd /d "%DEPLOY_DIR%"
echo %BLUE%[INFO]%NC% 服务日志 (按 Ctrl+C 退出):
docker-compose -f docker-compose.prod.yml logs -f
goto end

:end
endlocal
echo.
pause
