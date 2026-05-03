@echo off
chcp 65001 >nul
title 亿级商用超级平台启动器

:menu
cls
echo ========================================
echo    亿级商用超级平台 · 一键启动器
echo ========================================
echo.
echo  [1] 启动 Vue3 PC 用户前台  (http://localhost:8080)
echo  [2] 启动 React 管理后台    (http://localhost:3000)
echo  [3] 启动 Python FastAPI服务 (http://localhost:8001/docs)
echo  [4] 启动 Node NestJS网关   (http://localhost:8002)
echo  [5] 同时启动全部前端服务
echo  [6] 使用 Docker Compose 启动所有服务
echo  [7] 查看项目说明
echo  [0] 退出
echo.
echo ========================================
echo.
set /p choice=请选择要执行的操作 [0-7]:

if "%choice%"=="1" goto start_vue
if "%choice%"=="2" goto start_react
if "%choice%"=="3" goto start_python
if "%choice%"=="4" goto start_nest
if "%choice%"=="5" goto start_all_frontend
if "%choice%"=="6" goto start_docker
if "%choice%"=="7" goto show_readme
if "%choice%"=="0" goto exit

goto menu

:start_vue
echo.
echo ========================================
echo 正在启动 Vue3 PC 用户前台...
echo ========================================
cd "01-前端集群/web-vue-pc"
if not exist node_modules (
    echo [1/2] 首次启动，正在安装依赖...
    call npm install
)
echo [2/2] 启动开发服务器...
echo 访问地址: http://localhost:8080
echo.
echo 按 Ctrl+C 可停止服务
echo.
call npm run dev
goto menu

:start_react
echo.
echo ========================================
echo 正在启动 React 管理后台...
echo ========================================
cd "01-前端集群/web-react-admin"
if not exist node_modules (
    echo [1/2] 首次启动，正在安装依赖...
    call npm install
)
echo [2/2] 启动开发服务器...
echo 访问地址: http://localhost:3000
echo.
echo 按 Ctrl+C 可停止服务
echo.
call npm run dev
goto menu

:start_python
echo.
echo ========================================
echo 正在启动 Python FastAPI服务...
echo ========================================
cd "02-后端微服务集群/python-fastapi"
if not exist venv (
    echo [1/3] 首次启动，正在创建虚拟环境...
    python -m venv venv
)
echo [2/3] 激活虚拟环境...
call venv\Scripts\activate
if not exist venv\Lib\site-packages\uvicorn (
    echo [3/3] 正在安装依赖...
    pip install -r requirements.txt
)
echo [3/3] 启动服务...
echo API文档: http://localhost:8001/docs
echo.
echo 按 Ctrl+C 可停止服务
echo.
python main.py
goto menu

:start_nest
echo.
echo ========================================
echo 正在启动 Node NestJS网关+IM...
echo ========================================
cd "02-后端微服务集群/node-nest-gateway"
if not exist node_modules (
    echo [1/2] 首次启动，正在安装依赖...
    call npm install
)
echo [2/2] 启动服务...
echo 访问地址: http://localhost:8002
echo.
echo 按 Ctrl+C 可停止服务
echo.
call npm run start:dev
goto menu

:start_all_frontend
echo.
echo ========================================
echo 同时启动全部前端服务...
echo ========================================
echo 注意：这会打开两个新的命令行窗口
echo.
cd "01-前端集群/web-vue-pc"
if not exist node_modules (
    call npm install
)
start "Vue3 用户前台" cmd /k "npm run dev"
echo [1/2] Vue3用户前台已启动 (http://localhost:8080)

cd "01-前端集群/web-react-admin"
if not exist node_modules (
    call npm install
)
start "React 管理后台" cmd /k "npm run dev"
echo [2/2] React管理后台已启动 (http://localhost:3000)
echo.
echo 全部前端服务已启动！
pause
goto menu

:start_docker
echo.
echo ========================================
echo 使用 Docker Compose 启动所有服务...
echo ========================================
echo 请确保已安装 Docker 和 Docker Compose
echo.
cd "05-部署运维层/docker-compose"
if exist docker-compose-full.yml (
    echo 正在启动 Docker 服务...
    docker-compose -f docker-compose-full.yml up -d
    echo.
    echo 所有服务已启动！
    echo 服务访问地址：
    echo   - Vue3用户前台: http://localhost:8080
    echo   - React管理后台: http://localhost:3000
    echo   - Nacos: http://localhost:8848/nacos
    echo   - Python API: http://localhost:8001/docs
    echo.
    echo 查看服务状态: docker-compose -f docker-compose-full.yml ps
    echo 停止服务: docker-compose -f docker-compose-full.yml down
) else (
    echo 错误：未找到 docker-compose-full.yml 文件
)
pause
goto menu

:show_readme
echo.
if exist README.md (
    more README.md
) else (
    echo 未找到 README.md 文件
)
pause
goto menu

:exit
echo.
echo ========================================
echo 感谢使用亿级商用超级平台，再见！
echo ========================================
echo.
timeout /t 2 >nul
exit /b
