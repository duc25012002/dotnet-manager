# 🚀 HR Management System

Hệ thống Quản lý Nhân sự và Đánh giá KPI

## ⚡ Chạy hệ thống - CHỈ 1 LỆNH!

```bash
bash run.sh start
```

Script sẽ tự động:
- ✅ Kiểm tra và cài đặt dependencies (nếu thiếu)
- ✅ Khởi động SQL Server (Docker)
- ✅ Khởi động Backend (.NET)
- ✅ Khởi động Frontend (React)

## 🎯 Các lệnh

```bash
bash run.sh start    # Khởi động (tự động cài đặt nếu thiếu)
bash run.sh stop     # Dừng hệ thống
bash run.sh restart  # Khởi động lại
bash run.sh status   # Kiểm tra trạng thái
bash run.sh seed     # Thêm dữ liệu mẫu
```

## 🌐 Truy cập

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## 🔐 Tài khoản đăng nhập

| Username | Password | Quyền |
|----------|----------|-------|
| `quanly` | `123456` | Quản lý |
| `nhanvien` | `123456` | Nhân viên |
| `admin` | `123456` | Admin |

## 📊 Thêm dữ liệu mẫu

```bash
bash run.sh seed
```

## 📋 Yêu cầu

Script sẽ tự động cài đặt nếu thiếu:
- .NET SDK 8.0+
- Node.js 18+
- Docker Desktop

## 🎨 Tính năng

- ✅ Đăng nhập/Đăng xuất
- ✅ Dashboard với thống kê
- ✅ Quản lý nhân viên
- ✅ Quản lý phòng ban
- ✅ Quản lý chức vụ và lương cơ bản
- ✅ Quản lý hợp đồng lao động
- ✅ Theo dõi quá trình làm việc của nhân viên
- ✅ Đánh giá KPI
- ✅ AI Gemini đánh giá hiệu suất từ KPI, hợp đồng và quá trình làm việc
- ✅ Lưu lịch sử đánh giá AI
- ✅ Báo cáo thống kê nhân sự, KPI và hợp đồng sắp hết hạn
- ✅ Role-based access control

## 🤖 Cấu hình Gemini AI

Nếu chưa cấu hình API key, backend sẽ tự dùng chế độ đánh giá local để app vẫn chạy được. Muốn gọi Gemini thật, cấu hình key local bằng .NET user-secrets:

```bash
cd HRManagementSystem
dotnet user-secrets set "Gemini:ApiKey" "YOUR_GEMINI_API_KEY"
```

Backend cần chạy với môi trường Development để đọc user-secrets:

```bash
ASPNETCORE_ENVIRONMENT=Development dotnet run --urls http://localhost:8080
```

Nếu chạy bằng `run.sh`, tạo file `.env` ở thư mục gốc:

```bash
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Sau đó khởi động lại:

```bash
bash run.sh restart
```

## 🛠️ Công nghệ

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: ASP.NET Core 8 + Entity Framework
- **Database**: SQL Server (Docker)

---

**Bắt đầu ngay:** `bash run.sh start` 🚀
