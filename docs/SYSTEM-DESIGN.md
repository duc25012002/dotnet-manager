# Phân Tích Và Thiết Kế Hệ Thống HR Management

## Mục Tiêu

Hệ thống hỗ trợ quản lý nhân sự nội bộ gồm nhân viên, phòng ban, chức vụ, hợp đồng, quá trình làm việc, KPI và đánh giá hiệu suất bằng AI Gemini.

## Tác Nhân

- Admin: quản trị toàn hệ thống.
- Quản lý: quản lý nhân viên, phòng ban, chức vụ, hợp đồng, KPI, báo cáo và AI đánh giá.
- Nhân viên: xem thông tin và kết quả KPI liên quan.

## Chức Năng Chính

- Đăng nhập/đăng xuất và phân quyền theo vai trò.
- Quản lý nhân viên: danh sách, thêm, sửa, xóa qua API.
- Quản lý phòng ban.
- Quản lý chức vụ và lương cơ bản.
- Quản lý hợp đồng lao động.
- Theo dõi quá trình làm việc: điều chuyển, thăng chức, khen thưởng, kỷ luật, đào tạo.
- Đánh giá KPI theo tiêu chí trọng số.
- AI Gemini tổng hợp dữ liệu HR để tạo nhận xét hiệu suất.
- Lưu lịch sử đánh giá AI.
- Báo cáo thống kê nhân sự, KPI, hợp đồng sắp hết hạn và nhân viên cần theo dõi.

## Use Case Tổng Quát

```mermaid
flowchart LR
    Manager[Quản lý/Admin] --> Employees[Quản lý nhân viên]
    Manager --> Departments[Quản lý phòng ban]
    Manager --> Positions[Quản lý chức vụ]
    Manager --> Contracts[Quản lý hợp đồng]
    Manager --> History[Quá trình làm việc]
    Manager --> KPI[Đánh giá KPI]
    Manager --> AI[AI đánh giá hiệu suất]
    Manager --> Reports[Báo cáo thống kê]
    Employee[Nhân viên] --> KPIView[Xem KPI]
```

## ERD Rút Gọn

```mermaid
erDiagram
    Department ||--o{ Employee : has
    Position ||--o{ Employee : has
    Employee ||--o{ Contract : owns
    Employee ||--o{ WorkHistory : tracks
    Employee ||--o{ PerformanceReview : receives
    PerformanceReview ||--o{ PerformanceDetail : contains
    KpiCategory ||--o{ PerformanceDetail : scores
    Employee ||--o{ AiEvaluationRecord : has
    Employee ||--o{ User : maps

    Department {
      int Id
      string Name
      string Description
    }
    Position {
      int Id
      string Title
      decimal BaseSalary
    }
    Employee {
      int Id
      string FullName
      date BirthDate
      string Email
      int DepartmentId
      int PositionId
    }
    Contract {
      int Id
      string ContractNumber
      date StartDate
      date EndDate
      string ContractType
      int EmployeeId
    }
    WorkHistory {
      int Id
      int EmployeeId
      date EventDate
      string EventType
      string Title
    }
    PerformanceReview {
      int Id
      int EmployeeId
      string Period
      double TotalScore
    }
    AiEvaluationRecord {
      int Id
      int EmployeeId
      string Period
      string Evaluation
      datetime CreatedAt
    }
```

## Kiến Trúc

```mermaid
flowchart TB
    Browser[React Frontend] --> API[ASP.NET Core API]
    API --> SQL[(SQL Server Docker)]
    API --> Gemini[Gemini API]
```

## Công Nghệ

- Frontend: React, TypeScript, Vite, Tailwind CSS.
- Backend: ASP.NET Core, Entity Framework Core.
- Database: SQL Server chạy qua Docker.
- AI: Gemini API, key lưu bằng .NET user-secrets hoặc biến môi trường.

## Kiểm Thử Chính

- Build frontend: `npm run build`.
- Build backend: `dotnet build`.
- Cập nhật CSDL: `dotnet ef database update`.
- Kiểm tra API: `/api/reports/summary`, `/api/positions`, `/api/ai/performance-evaluation/history`.
