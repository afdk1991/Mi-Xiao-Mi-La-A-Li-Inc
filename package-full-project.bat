@echo off
REM ============================================
# laal.top 完整项目打包脚本
# 打包所有内容，准备部署
# ============================================

setlocal enabledelayedexpansion
set PROJECT_ROOT=%~dp0
set PACKAGE_DIR=%PROJECT_ROOT%laal.top-deployment-package
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set PACKAGE_NAME=laal.top-full-package-%TIMESTAMP%

echo.
echo ============================================
echo     laal.top 完整项目打包
echo ============================================
echo.

REM 1. 创建打包目录
if exist "%PACKAGE_DIR%" (
    echo [INFO] 清理旧的打包目录...
    rmdir /s /q "%PACKAGE_DIR%"
)
mkdir "%PACKAGE_DIR%"

echo.
echo [1/10] 复制部署脚本...
copy "%PROJECT_ROOT%deploy-final-secure.bat" "%PACKAGE_DIR%\" >nul
copy "%PROJECT_ROOT%deploy-laal.top-full-ssl.bat" "%PACKAGE_DIR%\" >nul
echo [OK] 部署脚本已复制

echo.
echo [2/10] 复制环境变量配置...
if exist "%PROJECT_ROOT%.env.laal.top" (
    copy "%PROJECT_ROOT%.env.laal.top" "%PACKAGE_DIR%\.env.example" >nul
) else if exist "%PROJECT_ROOT%.env.example" (
    copy "%PROJECT_ROOT%.env.example" "%PACKAGE_DIR%\.env.example" >nul
)
if not exist "%PACKAGE_DIR%\.env.example" (
    (
    echo # laal.top 项目环境变量配置
    echo NODE_ENV=production
    echo TZ=Asia/Shanghai
    echo.
    echo # Let's Encrypt
    echo ACME_EMAIL=youremail@example.com
    echo.
    echo # 数据库
    echo MYSQL_HOST=mysql
    echo MYSQL_PORT=3306
    echo MYSQL_USER=root
    echo MYSQL_ROOT_PASSWORD=root123456
    echo MYSQL_DATABASE=mixmlaal
    echo.
    echo # Redis
    echo REDIS_HOST=redis
    echo REDIS_PORT=6379
    echo REDIS_PASSWORD=redis123456
    echo.
    echo # JWT
    echo JWT_SECRET=mixmlaal-super-secret-jwt-key-change-this-to-a-strong-key
    echo.
    echo # API
    echo VITE_API_BASE_URL=https://laal.top/api/v1
    echo VITE_API_TIMEOUT=15000
    echo.
    echo # Grafana
    echo GRAFANA_USER=admin
    echo GRAFANA_PASSWORD=admin123
    ) > "%PACKAGE_DIR%\.env.example"
)
echo [OK] 环境变量配置已复制

echo.
echo [3/10] 复制 Docker Compose 配置...
if not exist "%PACKAGE_DIR%\docker" mkdir "%PACKAGE_DIR%\docker"
if exist "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config\docker-compose.secure.yml" (
    copy "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config\docker-compose.secure.yml" "%PACKAGE_DIR%\docker\docker-compose.yml" >nul
    echo [OK] 安全版配置已复制
) else if exist "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config\docker-compose.ssl.yml" (
    copy "%PROJECT_ROOT%05-部署运维层\mixmlaal-deploy-config\docker-compose.ssl.yml" "%PACKAGE_DIR%\docker\docker-compose.yml" >nul
    echo [OK] SSL 版配置已复制
)

echo.
echo [4/10] 复制 Nginx 配置...
if not exist "%PACKAGE_DIR%\nginx" mkdir "%PACKAGE_DIR%\nginx"
if exist "%PROJECT_ROOT%05-部署运维层\mixmlaal-nginx-config\mixmlaal-conf-d\laal.top-complete.conf" (
    copy "%PROJECT_ROOT%05-部署运维层\mixmlaal-nginx-config\mixmlaal-conf-d\laal.top-complete.conf" "%PACKAGE_DIR%\nginx\" >nul
)
if exist "%PROJECT_ROOT%05-部署运维层\mixmlaal-nginx-config\nginx.conf" (
    copy "%PROJECT_ROOT%05-部署运维层\mixmlaal-nginx-config\nginx.conf" "%PACKAGE_DIR%\nginx\" >nul
)
echo [OK] Nginx 配置已复制

echo.
echo [5/10] 复制数据库初始化文件...
if not exist "%PACKAGE_DIR%\database" mkdir "%PACKAGE_DIR%\database"
if exist "%PROJECT_ROOT%04-数据库层\mixmlaal-mysql-sql" (
    xcopy /e /i /y "%PROJECT_ROOT%04-数据库层\mixmlaal-mysql-sql\*" "%PACKAGE_DIR%\database\" >nul 2>&1
    echo [OK] 数据库脚本已复制
)

echo.
echo [6/10] 复制静态资源...
if exist "%PROJECT_ROOT%07-公共资源" (
    if not exist "%PACKAGE_DIR%\static" mkdir "%PACKAGE_DIR%\static"
    xcopy /e /i /y "%PROJECT_ROOT%07-公共资源\*" "%PACKAGE_DIR%\static\" >nul 2>&1
    echo [OK] 静态资源已复制
)

echo.
echo [7/10] 复制项目源码（可选）...
echo [INFO] 为了安全，源码只复制部署需要的内容
if not exist "%PACKAGE_DIR%\source" mkdir "%PACKAGE_DIR%\source"

REM 复制前端项目 Dockerfile 和配置
echo [INFO] 准备前端项目...

if exist "%PROJECT_ROOT%01-前端集群\mixmlaal-web-vue-pc" (
    if not exist "%PACKAGE_DIR%\source\frontend" mkdir "%PACKAGE_DIR%\source\frontend"
    if exist "%PROJECT_ROOT%01-前端集群\mixmlaal-web-vue-pc\package.json" (
        copy "%PROJECT_ROOT%01-前端集群\mixmlaal-web-vue-pc\package.json" "%PACKAGE_DIR%\source\frontend\pc\" >nul 2>&1
        if exist "%PROJECT_ROOT%01-前端集群\mixmlaal-web-vue-pc\Dockerfile" (
            copy "%PROJECT_ROOT%01-前端集群\mixmlaal-web-vue-pc\Dockerfile" "%PACKAGE_DIR%\source\frontend\pc\" >nul 2>&1
        )
    )
)

echo [INFO] 前端配置已准备

REM 复制后端项目
if exist "%PROJECT_ROOT%02-后端微服务集群\mixmlaal-node-api" (
    if not exist "%PACKAGE_DIR%\source\backend" mkdir "%PACKAGE_DIR%\source\backend"
    if exist "%PROJECT_ROOT%02-后端微服务集群\mixmlaal-node-api\package.json" (
        copy "%PROJECT_ROOT%02-后端微服务集群\mixmlaal-node-api\package.json" "%PACKAGE_DIR%\source\backend\" >nul 2>&1
        if exist "%PROJECT_ROOT%02-后端微服务集群\mixmlaal-node-api\Dockerfile" (
            copy "%PROJECT_ROOT%02-后端微服务集群\mixmlaal-node-api\Dockerfile" "%PACKAGE_DIR%\source\backend\" >nul 2>&1
        )
    )
)

echo [OK] 项目源文件已准备

echo.
echo [8/10] 复制文档...
if not exist "%PACKAGE_DIR%\docs" mkdir "%PACKAGE_DIR%\docs"
if exist "%PROJECT_ROOT%laal.top-final-complete.md" (
    copy "%PROJECT_ROOT%laal.top-final-complete.md" "%PACKAGE_DIR%\docs\" >nul
)
if exist "%PROJECT_ROOT%laal.top-security-and-encryption.md" (
    copy "%PROJECT_ROOT%laal.top-security-and-encryption.md" "%PACKAGE_DIR%\docs\" >nul
)
if exist "%PROJECT_ROOT%laal.top-full-deployment-guide.md" (
    copy "%PROJECT_ROOT%laal.top-full-deployment-guide.md" "%PACKAGE_DIR%\docs\" >nul
)
if exist "%PROJECT_ROOT%laal.top-dns-cert-guide.md" (
    copy "%PROJECT_ROOT%laal.top-dns-cert-guide.md" "%PACKAGE_DIR%\docs\" >nul
)
if exist "%PROJECT_ROOT%laal.top-complete-list.md" (
    copy "%PROJECT_ROOT%laal.top-complete-list.md" "%PACKAGE_DIR%\docs\" >nul
)
echo [OK] 文档已复制

echo.
echo [9/10] 创建 README...
(
echo # laal.top 完整项目部署包
echo.
echo ## 项目概览
echo - 完整的 42 个域名配置
echo - 自动 HTTPS/SSL 证书
echo - 代码加密和安全加固
echo - 一键部署脚本
echo.
echo ## 快速开始
echo.
echo ### 1. 配置环境变量
echo ^`^`^`bash
echo # 复制示例配置
echo copy .env.example .env
echo.
echo # 修改配置（密码、邮箱等）
echo notepad .env
echo ^`^`^`
echo.
echo ### 2. 配置 DNS 解析
echo 在域名服务商添加 42 条 DNS 记录（详见 docs/ 目录）
echo.
echo ### 3. 部署
echo ^`^`^`bash
echo # 运行一键部署脚本
echo deploy-final-secure.bat deploy
echo ^`^`^`
echo.
echo ### 4. 完成！
echo 几分钟后访问 https://laal.top
echo.
echo ## 目录结构
echo ^`^`^`
echo laal.top-deployment-package/
echo ├── deploy-final-secure.bat      # 最终部署脚本
echo ├── .env.example                 # 环境变量示例
echo ├── docker/
echo │   └── docker-compose.yml       # Docker Compose 配置
echo ├── nginx/
echo │   └── nginx.conf              # Nginx 配置
echo ├── database/                    # 数据库初始化脚本
echo ├── static/                      # 静态资源
echo ├── source/                      # 项目源文件（可选）
echo └── docs/                        # 完整文档
echo ^`^`^`
echo.
echo ## 文档
echo 查看 docs/ 目录获取详细文档
echo.
echo ## 支持
echo 部署问题请查阅文档
) > "%PACKAGE_DIR%\README.md"
echo [OK] README 已创建

echo.
echo [10/10] 创建启动脚本...
(
echo @echo off
echo echo ============================================
echo echo    laal.top 项目部署
echo echo ============================================
echo echo.
echo echo 请先阅读 README.md 和 docs/ 目录文档！
echo echo.
echo set /p START=开始部署？(y/n):
echo if /i %%START%%==y (
echo     deploy-final-secure.bat deploy
echo ^) else (
echo     echo.
echo     echo 请先阅读文档并配置环境！
echo     echo.
echo ^)
echo pause
) > "%PACKAGE_DIR%\start.bat"

echo [OK] 启动脚本已创建

echo.
echo ============================================
echo    打包完成！
echo ============================================
echo.
echo 打包目录: %PACKAGE_DIR%
echo.
echo 包含内容：
echo   - [x] 部署脚本
echo   - [x] 环境变量配置
echo   - [x] Docker Compose 配置
echo   - [x] Nginx 配置
echo   - [x] 数据库脚本
echo   - [x] 静态资源
echo   - [x] 项目源码（部署需要的）
echo   - [x] 完整文档
echo.
echo 下一步：
echo   1. 复制 laal.top-deployment-package 到服务器
echo   2. 阅读 README.md
echo   3. 运行 start.bat
echo   4. 部署成功！
echo.

REM 可选：创建 ZIP 压缩包
set /p CREATE_ZIP=是否创建 ZIP 压缩包？(y/n):
if /i "%CREATE_ZIP%"=="y" (
    echo.
    echo [INFO] 正在创建 ZIP 压缩包...
    REM 使用 PowerShell 创建压缩包
    powershell -Command "Compress-Archive -Path '%PACKAGE_DIR%' -DestinationPath '%PROJECT_ROOT%%PACKAGE_NAME%.zip' -Force"
    if %errorlevel% equ 0 (
        echo [OK] ZIP 包已创建: %PACKAGE_NAME%.zip
    ) else (
        echo [WARNING] ZIP 包创建失败，请手动打包
    )
)

echo.
echo ============================================
echo    全部完成！
echo ============================================
echo.
pause

