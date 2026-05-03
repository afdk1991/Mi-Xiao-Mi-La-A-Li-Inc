#!/bin/bash

# ============================================
# MIXMLAAL 项目一键生产部署脚本
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="${PROJECT_ROOT}/05-部署运维层/mixmlaal-deploy-config"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境函数
check_requirements() {
    log_info "检查部署环境..."

    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    log_success "Docker 已安装"

    # 检查 Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    log_success "Docker Compose 已安装"

    # 检查环境变量文件
    if [ ! -f "${PROJECT_ROOT}/.env" ]; then
        log_warning ".env 文件不存在，正在从模板创建..."
        if [ -f "${PROJECT_ROOT}/.env.example" ]; then
            cp "${PROJECT_ROOT}/.env.example" "${PROJECT_ROOT}/.env"
            log_success "已创建 .env 文件，请修改配置后重新运行"
            log_info "请编辑 ${PROJECT_ROOT}/.env 文件，填入真实配置"
            exit 0
        else
            log_error "找不到 .env.example 文件"
            exit 1
        fi
    fi
    log_success "环境变量文件存在"
}

# 构建函数
build_services() {
    log_info "开始构建服务..."

    cd "${DEPLOY_DIR}"

    # 构建所有镜像
    log_info "构建 Docker 镜像..."
    docker-compose -f docker-compose.prod.yml build --no-cache

    log_success "服务构建完成"
}

# 启动函数
start_services() {
    log_info "启动服务..."

    cd "${DEPLOY_DIR}"

    # 启动服务
    log_info "启动所有服务..."
    docker-compose -f docker-compose.prod.yml up -d

    log_success "服务启动完成"
}

# 停止函数
stop_services() {
    log_info "停止服务..."

    cd "${DEPLOY_DIR}"

    docker-compose -f docker-compose.prod.yml down

    log_success "服务已停止"
}

# 查看状态
show_status() {
    log_info "服务状态:"
    cd "${DEPLOY_DIR}"
    docker-compose -f docker-compose.prod.yml ps
}

# 查看日志
show_logs() {
    log_info "服务日志:"
    cd "${DEPLOY_DIR}"
    docker-compose -f docker-compose.prod.yml logs -f
}

# 初始化数据库
init_database() {
    log_info "初始化数据库..."

    # 等待 MySQL 启动
    log_info "等待 MySQL 就绪..."
    sleep 30

    # 执行初始化脚本
    cd "${DEPLOY_DIR}"
    if [ -f "${PROJECT_ROOT}/04-数据库层/mixmlaal-mysql-sql/init.sql" ]; then
        docker-compose -f docker-compose.prod.yml exec -T mysql mysql -uroot -p"${MYSQL_PASSWORD}" < "${PROJECT_ROOT}/04-数据库层/mixmlaal-mysql-sql/init.sql"
        log_success "数据库初始化完成"
    else
        log_warning "找不到数据库初始化脚本"
    fi
}

# 主函数
main() {
    echo ""
    echo "============================================"
    echo "  MIXMLAAL 生产部署工具"
    echo "============================================"
    echo ""

    case "${1:-}" in
        "start")
            check_requirements
            build_services
            start_services
            init_database
            show_status
            log_success "部署完成！"
            log_info "请访问: http://localhost"
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            start_services
            show_status
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "init")
            init_database
            ;;
        "help"|*)
            echo "用法: $0 {命令}"
            echo ""
            echo "命令列表:"
            echo "  start    - 启动完整部署"
            echo "  stop     - 停止所有服务"
            echo "  restart  - 重启服务"
            echo "  status   - 查看服务状态"
            echo "  logs     - 查看日志"
            echo "  init     - 初始化数据库"
            echo "  help     - 显示此帮助信息"
            echo ""
            echo "部署前请先编辑 ${PROJECT_ROOT}/.env 文件"
            echo ""
            ;;
    esac
}

# 执行主函数
main "$@"
