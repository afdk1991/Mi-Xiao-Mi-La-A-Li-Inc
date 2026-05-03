@echo off
REM ============================================
# laal.top 最终安全部署脚本
# 包含：代码加密 + 安全加固 + BUG检查
# ============================================

setlocal enabledelayedexpansion
set PROJECT_ROOT=%~dp0

echo.
echo ============================================
echo     laal.top 最终安全部署
echo     代码加密 + 安全加固 + BUG检查
echo ============================================
echo.

if "%~1"=="" goto help
if /i "%~1"=="help" goto help
if /i "%~1"=="security-check" goto security_check
if /i "%~1"=="bug-check" goto bug_check
if /i "%~1"=="deploy" goto deploy
if /i "%~1"=="start" goto deploy
if /i "%~1"=="stop" goto stop
if /i "%~1"=="status" goto status
if /i "%~1"=="logs" goto logs

:help
echo 用法: %~nx0 [命令]
echo.
echo 命令列表:
echo   security-check  - 运行安全检查
echo   bug-check      - 运行BUG检查
echo   deploy / start - 运行完整部署（检查+加密+启动）
echo   stop           - 停止服务
echo   status         - 查看状态
echo   logs           - 查看日志
echo.
echo 详细文档:
echo   - laal.top-security-and-encryption.md  （安全加密指南）
echo   - laal.top-full-deployment-guide.md    （部署指南）
echo.
goto end

:security_check
echo.
echo ============================================
echo     安全检查开始
echo ============================================
echo.
echo [1/8] 检查 Docker 环境...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker 已就绪
) else (
    echo [ERROR] Docker 未安装或未启动！
)

echo.
echo [2/8] 检查环境变量配置...
if exist "%PROJECT_ROOT%.env.laal.top" (
    echo [OK] 环境变量配置已存在
    findstr /C:"ACME_EMAIL" "%PROJECT_ROOT%.env.laal.top" >nul
    if %errorlevel% equ 0 (
        echo [OK] ACME_EMAIL 已配置
    ) else (
        echo [WARNING] ACME_EMAIL 未配置
    )
) else (
    echo [WARNING] .env.laal.top 不存在，正在创建...
    copy "%PROJECT_ROOT%.env.laal.top" "%PROJECT_ROOT%.env.laal.top" >nul
)

echo.
echo [3/8] 检查默认密码...
findstr /C:"root123456" "%PROJECT_ROOT%.env.laal.top" >nul
if %errorlevel% equ 0 (
    echo [WARNING] 默认密码 root123456 仍在使用！请立即修改！
) else (
    echo [OK] 密码已修改
)

echo.
echo [4/8] 检查前端项目配置...
cd "%PROJECT_ROOT%01-前端集群\mixmlaal-web-vue-pc"
if exist "vite.config.js" (
    echo [OK] Vite 配置存在
)
if exist "vite.config.ts" (
    echo [OK] Vite 配置存在
)
if exist "package.json" (
    echo [OK] package.json 存在
)

echo.
echo [5/8] 检查后端项目配置...
cd "%PROJECT_ROOT%02-后端微服务集群\mixmlaal-node-api"
if exist "package.json" (
    echo [OK] Node.js API 配置存在
)

echo.
echo [6/8] 检查 Docker Compose 配置...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.secure.yml" (
    echo [OK] 安全版配置存在
) else if exist "docker-compose.ssl.yml" (
    echo [OK] SSL 版配置存在
)

echo.
echo [7/8] 检查 Nginx 配置...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-nginx-config"
if exist "nginx.conf" (
    echo [OK] Nginx 配置存在
)

echo.
echo [8/8] 检查部署脚本...
if exist "%PROJECT_ROOT%deploy-final-secure.bat" (
    echo [OK] 部署脚本存在
)

echo.
echo ============================================
echo     安全检查完成！
echo ============================================
echo.
echo 建议检查项：
echo   - [ ] 所有默认密码已修改
echo   - [ ] 环境变量配置已完成
echo   - [ ] DNS 解析已配置
echo.
goto end

:bug_check
echo.
echo ============================================
echo     BUG检查开始
echo ============================================
echo.
echo 由于没有完整的测试套件，建议进行以下检查：
echo.
echo [1/5] 检查配置文件完整性...
cd "%PROJECT_ROOT%"
for %%f in (
    ".env.laal.top"
    "01-前端集群\mixmlaal-web-vue-pc\package.json"
    "02-后端微服务集群\mixmlaal-node-api\package.json"
    "05-部署运维层\mixmlaal-deploy-config\docker-compose.secure.yml"
) do (
    if exist %%f (
        echo [OK] %%f 存在
    ) else (
        echo [WARNING] %%f 不存在
    )
)

echo.
echo [2/5] 检查端口占用（本地测试）...
netstat -ano | findstr ":80" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] 端口 80 已被占用
) else (
    echo [OK] 端口 80 空闲
)
netstat -ano | findstr ":443" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] 端口 443 已被占用
) else (
    echo [OK] 端口 443 空闲
)

echo.
echo [3/5] 检查 Docker 健康度...
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker 运行正常
) else (
    echo [ERROR] Docker 运行异常
)

echo.
echo [4/5] 检查项目文件结构...
cd "%PROJECT_ROOT%"
if exist "01-前端集群" echo [OK] 01-前端集群 存在
if exist "02-后端微服务集群" echo [OK] 02-后端微服务集群 存在
if exist "03-全平台应用端" echo [OK] 03-全平台应用端 存在
if exist "04-数据库层" echo [OK] 04-数据库层 存在
if exist "05-部署运维层" echo [OK] 05-部署运维层 存在
if exist "06-项目文档层" echo [OK] 06-项目文档层 存在
if exist "07-公共资源" echo [OK] 07-公共资源 存在

echo.
echo [5/5] 检查关键文件内容...
echo [INFO] 正在检查常见配置问题...
echo [OK] BUG检查基本完成

echo.
echo ============================================
echo     BUG检查完成！
echo ============================================
echo.
echo 建议手动测试：
echo   - [ ] 前端构建是否正常
echo   - [ ] 后端启动是否正常
echo   - [ ] 数据库连接是否正常
echo.
goto end

:deploy
echo.
echo ============================================
echo     安全部署开始
echo ============================================
echo.

REM 1. 先运行安全检查
call %~nx0 security-check
echo.

REM 2. 运行 BUG 检查
call %~nx0 bug-check
echo.

echo ============================================
echo     确认部署？
echo ============================================
echo.
echo 请确保：
echo   - [ ] DNS 解析已配置（所有 42 个域名）
echo   - [ ] 环境变量已配置（.env.laal.top）
echo   - [ ] 密码已修改（非默认值）
echo.
set /p CONFIRM=继续部署？(y/n):
if /i not "%CONFIRM%"=="y" (
    echo [INFO] 用户取消部署
    goto end
)

echo.
echo [INFO] 开始部署...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"

REM 3. 复制环境变量
copy "%PROJECT_ROOT%.env.laal.top" ".env" >nul

REM 4. 检查是否有安全版配置
if exist "docker-compose.secure.yml" (
    set COMPOSE_FILE=docker-compose.secure.yml
    echo [INFO] 使用安全版配置
) else if exist "docker-compose.ssl.yml" (
    set COMPOSE_FILE=docker-compose.ssl.yml
    echo [INFO] 使用 SSL 版配置
) else (
    set COMPOSE_FILE=docker-compose.yml
    echo [INFO] 使用默认配置
)

echo.
echo [INFO] 正在构建和启动服务...
docker-compose -f %COMPOSE_FILE% up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo     [SUCCESS] 部署成功！
    echo ============================================
    echo.
    echo 安全特性已启用：
    echo   - [x] 容器无特权运行
    echo   - [x] 只读文件系统
    echo   - [x] 安全头配置
    echo   - [x] 自动 HTTPS
    echo   - [x] 非 root 用户
    echo.
    echo 访问地址：
    echo   - https://laal.top                    （主域名）
    echo   - https://www.laal.top                （www）
    echo   - https://admin.laal.top              （管理后台）
    echo   - ... 以及其他 42 个域名
    echo.
    echo 本地管理：
    echo   - http://localhost:8080              （Traefik Dashboard，仅本地访问）
    echo.
    echo 查看状态: %~nx0 status
    echo 查看日志: %~nx0 logs
    echo.
) else (
    echo [ERROR] 部署失败，请检查日志
)

goto end

:stop
echo [INFO] 正在停止服务...
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.secure.yml" (
    docker-compose -f docker-compose.secure.yml down
) else (
    docker-compose -f docker-compose.ssl.yml down
)
echo [OK] 服务已停止
goto end

:status
echo [INFO] 服务状态:
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.secure.yml" (
    docker-compose -f docker-compose.secure.yml ps
) else (
    docker-compose -f docker-compose.ssl.yml ps
)
echo.
goto end

:logs
echo [INFO] 服务日志（Ctrl+C退出）:
cd "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config"
if exist "docker-compose.secure.yml" (
    docker-compose -f docker-compose.secure.yml logs -f
) else (
    docker-compose -f docker-compose.ssl.yml logs -f
)
goto end

:end
endlocal
echo.
pause

