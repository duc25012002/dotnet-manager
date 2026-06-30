-- HR Management System - Sample Data
-- Tao 15 phong ban, 70 nhan vien va cac du lieu lien quan cho SQL Server.

USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HRManagementDB')
BEGIN
    CREATE DATABASE HRManagementDB;
END
GO

USE HRManagementDB;
GO

IF OBJECT_ID('AiEvaluationRecords', 'U') IS NOT NULL DELETE FROM AiEvaluationRecords;
IF OBJECT_ID('WorkHistories', 'U') IS NOT NULL DELETE FROM WorkHistories;
IF OBJECT_ID('PerformanceDetails', 'U') IS NOT NULL DELETE FROM PerformanceDetails;
IF OBJECT_ID('PerformanceReviews', 'U') IS NOT NULL DELETE FROM PerformanceReviews;
IF OBJECT_ID('Contracts', 'U') IS NOT NULL DELETE FROM Contracts;
IF OBJECT_ID('Users', 'U') IS NOT NULL DELETE FROM Users;
IF OBJECT_ID('Employees', 'U') IS NOT NULL DELETE FROM Employees;
IF OBJECT_ID('KpiCategories', 'U') IS NOT NULL DELETE FROM KpiCategories;
IF OBJECT_ID('Positions', 'U') IS NOT NULL DELETE FROM Positions;
IF OBJECT_ID('Departments', 'U') IS NOT NULL DELETE FROM Departments;
GO

DECLARE @Departments TABLE (Seq INT PRIMARY KEY, Name NVARCHAR(100), Description NVARCHAR(MAX));
INSERT INTO @Departments (Seq, Name, Description) VALUES
(1, 'Phong Ky thuat', 'Phat trien san pham va nen tang cong nghe'),
(2, 'Phong Nhan su', 'Tuyen dung, dao tao va chinh sach nhan su'),
(3, 'Phong Kinh doanh', 'Ban hang va phat trien khach hang'),
(4, 'Phong Marketing', 'Thuong hieu, noi dung va chien dich truyen thong'),
(5, 'Phong Tai chinh', 'Ke toan, ngan sach va bao cao tai chinh'),
(6, 'Phong Ke toan', 'Hach toan, chung tu va doi soat chi phi'),
(7, 'Phong Cham soc khach hang', 'Ho tro va duy tri trai nghiem khach hang'),
(8, 'Phong San pham', 'Quan ly lo trinh va yeu cau san pham'),
(9, 'Phong Van hanh', 'Toi uu quy trinh va dieu phoi van hanh'),
(10, 'Phong Phap che', 'Hop dong, tuan thu va quan tri rui ro phap ly'),
(11, 'Phong Du lieu', 'Phan tich du lieu va bao cao quan tri'),
(12, 'Phong Dam bao chat luong', 'Kiem thu, quy trinh va chat luong san pham'),
(13, 'Phong Ha tang CNTT', 'He thong, bao mat va ha tang noi bo'),
(14, 'Phong Dao tao', 'Dao tao noi bo va phat trien nang luc'),
(15, 'Phong Mua hang', 'Nha cung cap, vat tu va quy trinh mua sam');

INSERT INTO Departments (Name, Description)
SELECT Name, Description FROM @Departments ORDER BY Seq;

DECLARE @Positions TABLE (Seq INT PRIMARY KEY, Title NVARCHAR(100), BaseSalary DECIMAL(18,2));
INSERT INTO @Positions (Seq, Title, BaseSalary) VALUES
(1, 'Developer', 20000000),
(2, 'Senior Developer', 35000000),
(3, 'Team Lead', 45000000),
(4, 'Manager', 50000000),
(5, 'HR Specialist', 18000000),
(6, 'Sales Executive', 15000000),
(7, 'Marketing Specialist', 17000000),
(8, 'Accountant', 19000000),
(9, 'Customer Support', 14000000),
(10, 'Product Owner', 38000000),
(11, 'Data Analyst', 28000000),
(12, 'QA Engineer', 22000000),
(13, 'System Administrator', 26000000),
(14, 'Training Specialist', 18000000),
(15, 'Procurement Officer', 18000000);

INSERT INTO Positions (Title, BaseSalary)
SELECT Title, BaseSalary FROM @Positions ORDER BY Seq;

INSERT INTO KpiCategories (Name, Description, Weight) VALUES
('Chat luong cong viec', 'Danh gia chat luong output va ket qua cong viec', 40),
('Tien do', 'Hoan thanh cong viec dung deadline', 30),
('Thai do lam viec', 'Tinh than, thai do voi dong nghiep va cong ty', 20),
('Sang tao', 'De xuat y tuong moi va cai tien quy trinh', 10);

DECLARE @Employees TABLE (Seq INT PRIMARY KEY, FullName NVARCHAR(100));
INSERT INTO @Employees (Seq, FullName) VALUES
(1, 'Nguyen Van An'), (2, 'Tran Thi Binh'), (3, 'Le Van Cuong'), (4, 'Pham Thi Dung'), (5, 'Hoang Van Em'),
(6, 'Vo Thi Phuong'), (7, 'Dang Van Giang'), (8, 'Bui Thi Hanh'), (9, 'Do Van Khang'), (10, 'Ngo Thi Lan'),
(11, 'Duong Van Minh'), (12, 'Ly Thi Ngoc'), (13, 'Mai Van Phuc'), (14, 'Truong Thi Quyen'), (15, 'Phan Van Son'),
(16, 'Nguyen Thi Thao'), (17, 'Tran Van Uyen'), (18, 'Le Thi Vy'), (19, 'Pham Van Xuan'), (20, 'Hoang Thi Yen'),
(21, 'Vo Van Bao'), (22, 'Dang Thi Chi'), (23, 'Bui Van Dat'), (24, 'Do Thi Giang'), (25, 'Ngo Van Hai'),
(26, 'Duong Thi Kim'), (27, 'Ly Van Lam'), (28, 'Mai Thi My'), (29, 'Truong Van Nam'), (30, 'Phan Thi Oanh'),
(31, 'Nguyen Van Phat'), (32, 'Tran Thi Quynh'), (33, 'Le Van Sang'), (34, 'Pham Thi Tam'), (35, 'Hoang Van Tien'),
(36, 'Vo Thi Trang'), (37, 'Dang Van Trung'), (38, 'Bui Thi Tuyet'), (39, 'Do Van Vinh'), (40, 'Ngo Thi Xuan'),
(41, 'Duong Van Yen'), (42, 'Ly Thi Anh'), (43, 'Mai Van Binh'), (44, 'Truong Thi Cam'), (45, 'Phan Van Duc'),
(46, 'Nguyen Thi Giang'), (47, 'Tran Van Hung'), (48, 'Le Thi Khanh'), (49, 'Pham Van Long'), (50, 'Hoang Thi Mai'),
(51, 'Vo Van Nghia'), (52, 'Dang Thi Phuong'), (53, 'Bui Van Quan'), (54, 'Do Thi Rinh'), (55, 'Ngo Van Sy'),
(56, 'Duong Thi Thu'), (57, 'Ly Van Toan'), (58, 'Mai Thi Uyen'), (59, 'Truong Van Viet'), (60, 'Phan Thi Xinh'),
(61, 'Nguyen Van Y'), (62, 'Tran Thi Ai'), (63, 'Le Van Bac'), (64, 'Pham Thi Chau'), (65, 'Hoang Van Duy'),
(66, 'Vo Thi Ha'), (67, 'Dang Van Kien'), (68, 'Bui Thi Loan'), (69, 'Do Van Nhan'), (70, 'Ngo Thi Thuong');

INSERT INTO Employees (FullName, BirthDate, Address, Email, PhoneNumber, DepartmentId, PositionId, Role)
SELECT
    e.FullName,
    DATEFROMPARTS(1984 + ((e.Seq - 1) % 17), ((e.Seq - 1) % 12) + 1, ((e.Seq - 1) % 27) + 1),
    CONCAT(99 + e.Seq, ' Nguyen Trai, Q', ((e.Seq - 1) % 12) + 1, ', TP.HCM'),
    CONCAT(LOWER(REPLACE(e.FullName, ' ', '.')), e.Seq, '@company.com'),
    CONCAT('09', RIGHT(CONCAT('00000000', CONVERT(VARCHAR(8), (10000000 + e.Seq * 13729) % 100000000)), 8)),
    d.Id,
    p.Id,
    CASE WHEN e.Seq <= 15 THEN 'Manager' ELSE 'Employee' END
FROM @Employees e
JOIN @Departments ds ON ds.Seq = ((e.Seq - 1) % 15) + 1
JOIN Departments d ON d.Name = ds.Name
JOIN @Positions ps ON ps.Seq = CASE WHEN e.Seq <= 15 THEN 4 ELSE ((ds.Seq - 1) % 15) + 1 END
JOIN Positions p ON p.Title = ps.Title
ORDER BY e.Seq;

INSERT INTO Contracts (ContractNumber, StartDate, EndDate, ContractType, EmployeeId)
SELECT
    CONCAT('HD', 2022 + ((e.Seq - 1) % 4), RIGHT(CONCAT('000', e.Seq), 3)),
    DATEFROMPARTS(2022 + ((e.Seq - 1) % 4), ((e.Seq - 1) % 12) + 1, 1),
    CASE WHEN e.Seq % 5 IN (4, 0)
        THEN DATEADD(DAY, -1, DATEADD(MONTH, 12, DATEFROMPARTS(2022 + ((e.Seq - 1) % 4), ((e.Seq - 1) % 12) + 1, 1)))
        ELSE DATEADD(DAY, -1, DATEADD(YEAR, 3, DATEFROMPARTS(2022 + ((e.Seq - 1) % 4), ((e.Seq - 1) % 12) + 1, 1)))
    END,
    CASE e.Seq % 5 WHEN 4 THEN 'Contract' WHEN 0 THEN 'Probation' ELSE 'Full-time' END,
    emp.Id
FROM @Employees e
JOIN Employees emp ON emp.FullName = e.FullName;

INSERT INTO WorkHistories (EmployeeId, EventDate, EventType, Title, Description, FromDepartment, ToDepartment, FromPosition, ToPosition)
SELECT
    emp.Id,
    DATEFROMPARTS(2023 + ((e.Seq - 1) % 3), ((e.Seq - 1) % 12) + 1, 10),
    'Onboarding',
    'Tiep nhan nhan vien',
    'Hoan thanh ho so va huong dan quy trinh lam viec',
    NULL,
    d.Name,
    NULL,
    p.Title
FROM @Employees e
JOIN Employees emp ON emp.FullName = e.FullName
JOIN Departments d ON d.Id = emp.DepartmentId
JOIN Positions p ON p.Id = emp.PositionId;

INSERT INTO WorkHistories (EmployeeId, EventDate, EventType, Title, Description, FromDepartment, ToDepartment, FromPosition, ToPosition)
SELECT
    emp.Id,
    DATEFROMPARTS(2025, ((e.Seq - 1) % 12) + 1, 15),
    CASE WHEN e.Seq % 4 = 0 THEN 'Promotion' ELSE 'Training' END,
    CASE WHEN e.Seq % 4 = 0 THEN 'Dieu chinh vai tro' ELSE 'Hoan thanh dao tao' END,
    CASE WHEN e.Seq % 4 = 0 THEN 'Cap nhat trach nhiem theo nhu cau phong ban' ELSE 'Hoan thanh khoa dao tao ky nang chuyen mon' END,
    d.Name,
    d.Name,
    p.Title,
    p.Title
FROM @Employees e
JOIN Employees emp ON emp.FullName = e.FullName
JOIN Departments d ON d.Id = emp.DepartmentId
JOIN Positions p ON p.Id = emp.PositionId;

INSERT INTO PerformanceReviews (EmployeeId, ReviewDate, Period, TotalScore, Feedback, Status)
SELECT
    emp.Id,
    '2026-04-01',
    'Q1 2026',
    CAST(7.0 + (((e.Seq - 1) % 25) / 10.0) AS DECIMAL(3,1)),
    CASE WHEN e.Seq % 5 = 0
        THEN 'Can cai thien tien do va chu dong phoi hop hon'
        ELSE 'Hoan thanh tot muc tieu, phoi hop hieu qua voi dong nghiep'
    END,
    'Finalized'
FROM @Employees e
JOIN Employees emp ON emp.FullName = e.FullName
WHERE e.Seq <= 30;

INSERT INTO PerformanceDetails (PerformanceReviewId, KpiCategoryId, Score, Note)
SELECT
    pr.Id,
    kc.Id,
    7 + ((e.Seq + kc.Id - 2) % 4),
    CASE kc.Name
        WHEN 'Chat luong cong viec' THEN 'Ket qua cong viec on dinh'
        WHEN 'Tien do' THEN 'Tien do dap ung phan lon deadline'
        WHEN 'Thai do lam viec' THEN 'Thai do hop tac va co trach nhiem'
        ELSE 'Co dong gop cai tien nho'
    END
FROM @Employees e
JOIN Employees emp ON emp.FullName = e.FullName
JOIN PerformanceReviews pr ON pr.EmployeeId = emp.Id AND pr.Period = 'Q1 2026'
CROSS JOIN KpiCategories kc
WHERE e.Seq <= 30;

INSERT INTO AiEvaluationRecords (EmployeeId, Period, Evaluation, CreatedAt)
SELECT
    emp.Id,
    'Q1 2026',
    CASE WHEN e.Seq % 3 = 0
        THEN 'Hieu suat tot, nen giao them muc tieu lien phong ban.'
        ELSE 'Hieu suat on dinh, tiep tuc theo doi tien do va chat luong dau ra.'
    END,
    DATEADD(DAY, -e.Seq, GETUTCDATE())
FROM @Employees e
JOIN Employees emp ON emp.FullName = e.FullName
WHERE e.Seq <= 12;

DECLARE @PasswordHash NVARCHAR(100) = 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=';
INSERT INTO Users (Username, PasswordHash, Role, EmployeeId, IsActive, CreatedAt) VALUES
('admin', @PasswordHash, 'Admin', NULL, 1, GETUTCDATE()),
('quanly', @PasswordHash, 'Manager', (SELECT Id FROM Employees WHERE FullName = 'Nguyen Van An'), 1, GETUTCDATE()),
('nhanvien', @PasswordHash, 'Employee', (SELECT Id FROM Employees WHERE FullName = 'Nguyen Thi Thao'), 1, GETUTCDATE());
GO

PRINT '';
PRINT '================================================';
PRINT 'Du lieu mau da duoc them thanh cong!';
PRINT '================================================';
PRINT '- Phong ban: 15';
PRINT '- Chuc vu: 15';
PRINT '- Nhan vien: 70';
PRINT '- Hop dong: 70';
PRINT '- Qua trinh lam viec: 140';
PRINT '- Danh gia KPI: 30';
PRINT '- Chi tiet KPI: 120';
PRINT '- Danh gia AI: 12';
PRINT '- Users: 3';
PRINT '';
PRINT 'Tai khoan dang nhap:';
PRINT '1. Admin: admin / 123456';
PRINT '2. Quan ly: quanly / 123456';
PRINT '3. Nhan vien: nhanvien / 123456';
PRINT '';
GO
