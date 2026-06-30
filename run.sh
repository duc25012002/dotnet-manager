#!/bin/bash

# HR Management System - All-in-One Script
# Tat ca trong 1: Kiem tra, Cai dat, Bat/Tat

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ $1${NC}"; }
print_header() { echo -e "${BLUE}$1${NC}"; }

load_env() {
    if [ -f ".env" ]; then
        set -a
        # shellcheck disable=SC1091
        . ./.env
        set +a
        print_success "Đã nạp cấu hình từ .env"
    fi
}

# ============================================
# CHECK DOCKER
# ============================================
check_docker() {
    print_info "Kiểm tra Docker..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker chưa được cài đặt! Vui lòng cài đặt Docker Desktop."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker chưa chạy! Vui lòng mở Docker Desktop."
        exit 1
    fi
    print_success "Docker đã sẵn sàng"
}

# ============================================
# START ALL SERVICES (DOCKER)
# ============================================
start_all() {
    print_header "================================================"
    print_header "   HR Management System (Docker Mode)"
    print_header "================================================"
    echo ""
    
    check_docker

    if [ ! -f ".env" ]; then
        print_info "Tạo cấu hình mẫu từ .env.example..."
        cp .env.example .env
    fi
    load_env
    
    echo ""
    print_info "Đang khởi động hệ thống bằng Docker Compose..."
    docker compose up --build -d
    
    if [ $? -ne 0 ]; then
        print_error "Khởi động Docker Compose thất bại!"
        exit 1
    fi
    
    echo ""
    print_success "================================================"
    print_success "   Hệ thống đã khởi động thành công!"
    print_success "================================================"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend:  http://localhost:8080"
    echo ""
    echo "📝 Tài khoản demo:"
    echo "   - Quản lý: quanly / 123456"
    echo "   - Nhân viên: nhanvien / 123456"
    echo ""
    echo "📊 Thêm dữ liệu mẫu:"
    echo "   ./run.sh seed"
    echo ""
    echo "🛑 Dừng hệ thống: ./run.sh stop"
    echo ""
}

# ============================================
# STOP ALL SERVICES (DOCKER)
# ============================================
stop_all() {
    print_header "================================================"
    print_header "   Đang dừng hệ thống..."
    print_header "================================================"
    echo ""
    
    docker compose down
    
    echo ""
    print_success "Hệ thống đã dừng hoàn toàn!"
    echo ""
}

# ============================================
# STATUS CHECK (DOCKER)
# ============================================
check_status() {
    print_header "================================================"
    print_header "   Trạng thái hệ thống"
    print_header "================================================"
    echo ""
    
    docker compose ps
    echo ""
}

# ============================================
# SEED DATA (DOCKER)
# ============================================
seed_data() {
    print_header "================================================"
    print_header "   Đang thêm dữ liệu mẫu..."
    print_header "================================================"
    echo ""
    
    if ! docker ps | grep -q "hr-sqlserver"; then
        print_error "SQL Server container (hr-sqlserver) chưa chạy!"
        exit 1
    fi
    
    print_info "Đang chạy script SQL trong container..."
    docker cp init-data.sql hr-sqlserver:/init-data.sql
    docker exec -i hr-sqlserver sh -lc '
        if [ -x /opt/mssql-tools18/bin/sqlcmd ]; then
            /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -i /init-data.sql
        else
            /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i /init-data.sql
        fi
    '
    
    echo ""
    print_success "Dữ liệu mẫu đã được thêm thành công!"
    echo ""
}

# ============================================
# MAIN
# ============================================
case "${1:-}" in
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        stop_all
        sleep 2
        start_all
        ;;
    status)
        check_status
        ;;
    seed)
        seed_data
        ;;
    *)
        print_header "================================================"
        print_header "   HR Management System"
        print_header "================================================"
        echo ""
        echo "Cách sử dụng: ./run.sh [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  start    - Khởi động hệ thống (tự động cài đặt nếu thiếu)"
        echo "  stop     - Dừng hệ thống"
        echo "  restart  - Khởi động lại"
        echo "  status   - Kiểm tra trạng thái"
        echo "  seed     - Thêm dữ liệu mẫu"
        echo ""
        echo "Ví dụ:"
        echo "  ./run.sh start"
        echo "  ./run.sh stop"
        echo "  ./run.sh seed"
        echo ""
        ;;
esac
