#!/bin/bash
# ============================================
# laal.top 一键部署脚本 (Linux/Mac)
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

show_help() {
    echo ""
    echo "============================================"
    echo "   laal.top 项目部署工具"
    echo "============================================"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令列表:"
    echo "  start    - 启动 laal.top 所有服务"
    echo "  stop     - 停止所有服务"
    echo "  restart  - 重启所有服务"
    echo "  status   - 查看服务状态"
    echo "  logs     - 查看服务日志"
    echo "  help     - 显示此帮助信息"
    echo ""
    echo "配置文件: .env.laal.top"
    echo "部署配置: 05-部署运维层/mixmlaal-deploy-config/docker-compose.laal.top.yml"
    echo ""
}

check_requirements() {
    log_info "检查部署环境..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    log_success "Docker 已就绪"

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装"
        exit 1
    fi
    log_success "Docker Compose 已就绪"

    if [ ! -f "$PROJECT_ROOT/.env.laal.top" ]; then
        log_warning ".env.laal.top 文件不存在，正在从模板创建..."
        if [ -f "$PROJECT_ROOT/.env.example" ]; then
            cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env.laal.top"
            log_success "已创建 .env.laal.top"
            echo ""
            log_info "请编辑 .env.laal.top 配置生产环境参数，然后重新运行！"
            exit 0
        else
            log_error "找不到 .env.example 文件"
            exit 1
        fi
    fi
}

start_services() {
    check_requirements

    log_info "开始构建和部署 laal.top..."

    cd "$PROJECT_ROOT/05-部署运维层/mixmlaal-deploy-config"
    cp "$PROJECT_ROOT/.env.laal.top" .env

    log_info "正在启动服务..."
    docker-compose -f docker-compose.laal.top.yml up -d --build

    log_success "部署完成！"
    echo ""
    echo "============================================"
    echo "   [SUCCESS] laal.top 部署成功！"
    echo "============================================"
    echo ""
    echo "访问地址:"
    echo "  - 主站: http://localhost 或 https://laal.top"
    echo "  - 司机端: http://localhost:3003"
    echo "  - 商家端: http://localhost:3004"
    echo "  - H5移动端: http://localhost:3005"
    echo "  - 管理后台: http://localhost:3002"
    echo ""
    echo "监控面板:"
    echo "  - Grafana: http://localhost:3001 (admin/admin123)"
    echo "  - Prometheus: http://localhost:9090"
    echo ""
    echo "查看状态: $0 status"
    echo "查看日志: $0 logs"
    echo ""
}

stop_services() {
    log_info "正在停止 laal.top 服务..."
    cd "$PROJECT_ROOT/05-部署运维层/mixmlaal-deploy-config"
    docker-compose -f docker-compose.laal.top.yml down
    log_success "服务已停止"
}

restart_services() {
    stop_services
    log_info "等待 3 秒..."
    sleep 3
    start_services
}

show_status() {
    log_info "服务状态:"
    cd "$PROJECT_ROOT/05-部署运维层/mixmlaal-deploy-config"
    docker-compose -f docker-compose.laal.top.yml ps
}

show_logs() {
    log_info "服务日志 (Ctrl+C退出):"
    cd "$PROJECT_ROOT/05-部署运维层/mixmlaal-deploy-config"
    docker-compose -f docker-compose.laal.top.yml logs -f
}

case "${1:-help}" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "help"|*)
        show_help
        ;;
esac
