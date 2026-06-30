# HR Management System - Frontend

Giao diện người dùng hiện đại cho Hệ thống Quản lý Nhân sự và KPI, được xây dựng bằng React + TypeScript + Vite.

## 🚀 Công nghệ sử dụng

- **React 18** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool nhanh
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📦 Cài đặt

```bash
cd hr-frontend
npm install
```

## 🏃 Chạy ứng dụng

### Development mode
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 🔧 Cấu hình Backend

Frontend này kết nối với backend ASP.NET Core qua API. Đảm bảo backend đang chạy tại `http://localhost:8080`.

Nếu backend chạy ở port khác, cập nhật file `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:YOUR_PORT/api',
})
```

## 📁 Cấu trúc thư mục

```
hr-frontend/
├── src/
│   ├── components/      # Các component tái sử dụng
│   │   └── Layout.tsx   # Layout chính với sidebar
│   ├── pages/           # Các trang chính
│   │   ├── Dashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── EmployeeCreate.tsx
│   │   ├── Departments.tsx
│   │   ├── KpiReviews.tsx
│   │   └── KpiCreate.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## ✨ Tính năng

- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý nhân viên (xem, thêm, tìm kiếm)
- ✅ Quản lý phòng ban
- ✅ Tạo và xem đánh giá KPI
- ✅ Giao diện responsive (mobile-friendly)
- ✅ Dark mode ready
- ✅ Type-safe với TypeScript

## 🎨 Giao diện

- Thiết kế hiện đại với Tailwind CSS
- Responsive trên mọi thiết bị
- Sidebar navigation
- Card-based layout
- Color-coded KPI scores
- Smooth transitions

## 🔗 API Endpoints (Backend cần implement)

```
GET    /api/employees
POST   /api/employees
GET    /api/departments
POST   /api/departments
GET    /api/positions
GET    /api/kpi/categories
GET    /api/kpi/reviews
POST   /api/kpi/reviews
```

## 📝 Lưu ý

- Frontend chạy độc lập, không cần Docker
- Backend ASP.NET Core cần expose API endpoints
- CORS cần được cấu hình trên backend để cho phép frontend kết nối

## 🛠️ Development

```bash
# Lint code
npm run lint

# Format code (nếu có prettier)
npm run format
```

## 📄 License

MIT
