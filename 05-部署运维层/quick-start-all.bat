@echo off
chcp 65001 >nul
title 亿级商用超级平台 - 一键启动

echo =====================================================
echo         亿级商用超级平台 - 快速启动
echo =====================================================
echo.

set /a started=0

:check_running
echo [1/6] 检查已运行的服务...
netstat -ano | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo √ Vue3用户前台 已运行 (端口8080)
    set /a started+=1
)

netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo √ React管理后台 已运行 (端口3000)
    set /a started+=1
) else (
    netstat -ano | findstr ":3001" >nul
    if %errorlevel% equ 0 (
        echo √ React管理后台 已运行 (端口3001)
        set /a started+=1
    )
)

echo.
echo [2/6] 启动Vue3用户前台 (端口8080)...
cd /d "%~dp001-前端集群\web-vue-pc"
if not exist node_modules (
    echo 首次运行,正在安装依赖...
    call npm install
)
start "Vue3用户前台" cmd /k "title Vue3用户前台 && npm run dev"
timeout /t 3 >nul

echo [3/6] 启动React管理后台 (端口3000)...
cd /d "%~dp001-前端集群\web-react-admin"
if not exist node_modules (
    echo 首次运行,正在安装依赖...
    call npm install
)
start "React管理后台" cmd /k "title React管理后台 && npm run dev"
timeout /t 3 >nul

echo [4/6] 启动Python FastAPI服务 (端口8001)...
cd /d "%~dp002-后端微服务集群\python-fastapi"
start "Python FastAPI" cmd /k "title Python FastAPI && python main.py"
timeout /t 2 >nul

echo [5/6] 启动Node NestJS网关 (端口8002)...
cd /d "%~dp002-后端微服务集群\node-nest-gateway"
if not exist node_modules (
    echo 首次运行,正在安装依赖...
    call npm install
)
start "Node NestJS网关" cmd /k "title Node NestJS网关 && npm run start:dev"
timeout /t 2 >nul

echo [6/6] 检查服务启动状态...
timeout /t 2 >nul

echo.
echo =====================================================
echo              所有服务已启动!
echo =====================================================
echo.
echo 🌐 服务访问地址:
echo    Vue3用户前台: http://localhost:8080
echo    React管理后台: http://localhost:3000 或 http://localhost:3001
echo    Python FastAPI: http://localhost:8001/docs
echo    Node NestJS网关: http://localhost:8002
echo.
echo 🔑 测试账号:
echo    Vue3前台: user / 123456
echo    React后台: admin / 123456
echo.
echo =====================================================
echo.
echo 提示: 按任意键关闭此窗口,服务将继续在后台运行.
echo       如要停止所有服务,请手动关闭对应的命令行窗口.
pause >nul
exit
