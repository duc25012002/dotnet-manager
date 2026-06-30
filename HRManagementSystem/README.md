# HR Management System with KPI Integration

Hệ thống quản lý nhân sự và đánh giá hiệu suất nhân viên được xây dựng bằng ASP.NET Core 8 MVC.

## Công nghệ sử dụng
*   **Backend:** ASP.NET Core 8 MVC
*   **Database:** SQL Server (Docker)
*   **ORM:** Entity Framework Core
*   **Frontend:** HTML, CSS, JavaScript (Bootstrap 5)
*   **Deployment:** Docker Compose

## Cách chạy dự án
Vì dự án đã được đóng gói bằng Docker, bạn chỉ cần thực hiện các bước sau trên máy của mình (yêu cầu đã cài đặt Docker):

1.  **Mở Terminal** tại thư mục `HRManagementSystem`.
2.  **Chạy lệnh sau** để khởi động ứng dụng và cơ sở dữ liệu:
    ```bash
    docker-compose up --build
    ```
3.  **Truy cập ứng dụng:** Mở trình duyệt và vào địa chỉ:
    `http://localhost:8080`

## Cấu trúc thư mục chính
*   `Controllers/`: Xử lý logic điều hướng và nghiệp vụ.
*   `Models/`: Định nghĩa các thực thể (Nhân viên, Phòng ban, KPI...).
*   `Views/`: Giao diện người dùng (Razor Views).
*   `Data/`: Cấu hình Database Context.
*   `Dockerfile` & `docker-compose.yml`: Cấu hình môi trường chạy.

## Lưu ý
Hệ thống sẽ tự động khởi tạo cơ sở dữ liệu và áp dụng Migrations khi khởi chạy lần đầu trong Docker.
