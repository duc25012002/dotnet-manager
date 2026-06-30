using HRManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HRManagementSystem.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return;
            }

            var kpiCategoriesList = new KpiCategory[]
            {
                new() { Name = "Chat luong cong viec", Description = "Danh gia chat luong output va ket qua cong viec", Weight = 40 },
                new() { Name = "Tien do", Description = "Hoan thanh cong viec dung deadline", Weight = 30 },
                new() { Name = "Thai do lam viec", Description = "Tinh than, thai do voi dong nghiep va cong ty", Weight = 20 },
                new() { Name = "Sang tao", Description = "De xuat y tuong moi va cai tien quy trinh", Weight = 10 }
            };
            context.KpiCategories.AddRange(kpiCategoriesList);
            context.SaveChanges();

            var departments = new Department[]
            {
                new() { Name = "Phong Ky thuat", Description = "Phat trien san pham va nen tang cong nghe" },
                new() { Name = "Phong Nhan su", Description = "Tuyen dung, dao tao va chinh sach nhan su" },
                new() { Name = "Phong Kinh doanh", Description = "Ban hang va phat trien khach hang" },
                new() { Name = "Phong Marketing", Description = "Thuong hieu, noi dung va chien dich truyen thong" },
                new() { Name = "Phong Tai chinh", Description = "Ke toan, ngan sach va bao cao tai chinh" },
                new() { Name = "Phong Ke toan", Description = "Hach toan, chung tu va doi soat chi phi" },
                new() { Name = "Phong Cham soc khach hang", Description = "Ho tro va duy tri trai nghiem khach hang" },
                new() { Name = "Phong San pham", Description = "Quan ly lo trinh va yeu cau san pham" },
                new() { Name = "Phong Van hanh", Description = "Toi uu quy trinh va dieu phoi van hanh" },
                new() { Name = "Phong Phap che", Description = "Hop dong, tuan thu va quan tri rui ro phap ly" },
                new() { Name = "Phong Du lieu", Description = "Phan tich du lieu va bao cao quan tri" },
                new() { Name = "Phong Dam bao chat luong", Description = "Kiem thu, quy trinh va chat luong san pham" },
                new() { Name = "Phong Ha tang CNTT", Description = "He thong, bao mat va ha tang noi bo" },
                new() { Name = "Phong Dao tao", Description = "Dao tao noi bo va phat trien nang luc" },
                new() { Name = "Phong Mua hang", Description = "Nha cung cap, vat tu va quy trinh mua sam" }
            };
            context.Departments.AddRange(departments);
            context.SaveChanges();

            var positions = new Position[]
            {
                new() { Title = "Developer", BaseSalary = 20000000 },
                new() { Title = "Senior Developer", BaseSalary = 35000000 },
                new() { Title = "Team Lead", BaseSalary = 45000000 },
                new() { Title = "Manager", BaseSalary = 50000000 },
                new() { Title = "HR Specialist", BaseSalary = 18000000 },
                new() { Title = "Sales Executive", BaseSalary = 15000000 },
                new() { Title = "Marketing Specialist", BaseSalary = 17000000 },
                new() { Title = "Accountant", BaseSalary = 19000000 },
                new() { Title = "Customer Support", BaseSalary = 14000000 },
                new() { Title = "Product Owner", BaseSalary = 38000000 },
                new() { Title = "Data Analyst", BaseSalary = 28000000 },
                new() { Title = "QA Engineer", BaseSalary = 22000000 },
                new() { Title = "System Administrator", BaseSalary = 26000000 },
                new() { Title = "Training Specialist", BaseSalary = 18000000 },
                new() { Title = "Procurement Officer", BaseSalary = 18000000 }
            };
            context.Positions.AddRange(positions);
            context.SaveChanges();

            var fullNames = new[]
            {
                "Nguyen Van An", "Tran Thi Binh", "Le Van Cuong", "Pham Thi Dung", "Hoang Van Em",
                "Vo Thi Phuong", "Dang Van Giang", "Bui Thi Hanh", "Do Van Khang", "Ngo Thi Lan",
                "Duong Van Minh", "Ly Thi Ngoc", "Mai Van Phuc", "Truong Thi Quyen", "Phan Van Son",
                "Nguyen Thi Thao", "Tran Van Uyen", "Le Thi Vy", "Pham Van Xuan", "Hoang Thi Yen",
                "Vo Van Bao", "Dang Thi Chi", "Bui Van Dat", "Do Thi Giang", "Ngo Van Hai",
                "Duong Thi Kim", "Ly Van Lam", "Mai Thi My", "Truong Van Nam", "Phan Thi Oanh",
                "Nguyen Van Phat", "Tran Thi Quynh", "Le Van Sang", "Pham Thi Tam", "Hoang Van Tien",
                "Vo Thi Trang", "Dang Van Trung", "Bui Thi Tuyet", "Do Van Vinh", "Ngo Thi Xuan",
                "Duong Van Yen", "Ly Thi Anh", "Mai Van Binh", "Truong Thi Cam", "Phan Van Duc",
                "Nguyen Thi Giang", "Tran Van Hung", "Le Thi Khanh", "Pham Van Long", "Hoang Thi Mai",
                "Vo Van Nghia", "Dang Thi Phuong", "Bui Van Quan", "Do Thi Rinh", "Ngo Van Sy",
                "Duong Thi Thu", "Ly Van Toan", "Mai Thi Uyen", "Truong Van Viet", "Phan Thi Xinh",
                "Nguyen Van Y", "Tran Thi Ai", "Le Van Bac", "Pham Thi Chau", "Hoang Van Duy",
                "Vo Thi Ha", "Dang Van Kien", "Bui Thi Loan", "Do Van Nhan", "Ngo Thi Thuong"
            };

            var employees = new List<Employee>();
            for (var i = 0; i < fullNames.Length; i++)
            {
                var departmentIndex = i % departments.Length;
                var isDepartmentManager = i < departments.Length;
                var positionIndex = isDepartmentManager ? 3 : departmentIndex % positions.Length;
                var username = ToUsername(fullNames[i], i + 1);

                employees.Add(new Employee
                {
                    FullName = fullNames[i],
                    BirthDate = new DateTime(1984 + (i % 17), (i % 12) + 1, (i % 27) + 1),
                    Address = $"{100 + i} Nguyen Trai, Q{(i % 12) + 1}, TP.HCM",
                    Email = $"{username}@company.com",
                    PhoneNumber = $"09{(10000000 + i * 13729) % 100000000:00000000}",
                    DepartmentId = departments[departmentIndex].Id,
                    PositionId = positions[positionIndex].Id,
                    Role = isDepartmentManager ? "Manager" : "Employee"
                });
            }
            context.Employees.AddRange(employees);
            context.SaveChanges();

            var contractTypes = new[] { "Full-time", "Full-time", "Full-time", "Contract", "Probation" };
            var contracts = employees.Select((employee, index) =>
            {
                var startDate = new DateTime(2022 + (index % 4), (index % 12) + 1, 1);
                return new Contract
                {
                    ContractNumber = $"HD{startDate.Year}{index + 1:000}",
                    StartDate = startDate,
                    EndDate = contractTypes[index % contractTypes.Length] == "Full-time" ? startDate.AddYears(3).AddDays(-1) : startDate.AddMonths(12).AddDays(-1),
                    ContractType = contractTypes[index % contractTypes.Length],
                    EmployeeId = employee.Id
                };
            }).ToArray();
            context.Contracts.AddRange(contracts);

            var workHistories = employees.SelectMany((employee, index) => new[]
            {
                new WorkHistory
                {
                    EmployeeId = employee.Id,
                    EventDate = new DateTime(2023 + (index % 3), (index % 12) + 1, 10),
                    EventType = "Onboarding",
                    Title = "Tiep nhan nhan vien",
                    Description = "Hoan thanh ho so va huong dan quy trinh lam viec",
                    ToDepartment = departments[index % departments.Length].Name,
                    ToPosition = positions[index < departments.Length ? 3 : (index % positions.Length)].Title
                },
                new WorkHistory
                {
                    EmployeeId = employee.Id,
                    EventDate = new DateTime(2025, (index % 12) + 1, 15),
                    EventType = index % 4 == 0 ? "Promotion" : "Training",
                    Title = index % 4 == 0 ? "Dieu chinh vai tro" : "Hoan thanh dao tao",
                    Description = index % 4 == 0 ? "Cap nhat trach nhiem theo nhu cau phong ban" : "Hoan thanh khoa dao tao ky nang chuyen mon",
                    FromDepartment = departments[index % departments.Length].Name,
                    ToDepartment = departments[index % departments.Length].Name,
                    FromPosition = positions[index % positions.Length].Title,
                    ToPosition = positions[index < departments.Length ? 3 : (index % positions.Length)].Title
                }
            }).ToArray();
            context.WorkHistories.AddRange(workHistories);
            context.SaveChanges();

            var kpiCategories = context.KpiCategories.OrderBy(category => category.Id).Take(4).ToArray();
            if (kpiCategories.Length == 4)
            {
                var reviews = employees.Take(30).Select((employee, index) => new PerformanceReview
                {
                    EmployeeId = employee.Id,
                    ReviewDate = new DateTime(2026, 4, 1),
                    Period = "Q1 2026",
                    TotalScore = Math.Round(7.0 + (index % 25) / 10.0, 1),
                    Feedback = index % 5 == 0
                        ? "Can cai thien tien do va chu dong phoi hop hon"
                        : "Hoan thanh tot muc tieu, phoi hop hieu qua voi dong nghiep",
                    Status = "Finalized"
                }).ToArray();
                context.PerformanceReviews.AddRange(reviews);
                context.SaveChanges();

                var details = reviews.SelectMany((review, index) => kpiCategories.Select((category, categoryIndex) => new PerformanceDetail
                {
                    PerformanceReviewId = review.Id,
                    KpiCategoryId = category.Id,
                    Score = 7 + ((index + categoryIndex) % 4),
                    Note = categoryIndex switch
                    {
                        0 => "Ket qua cong viec on dinh",
                        1 => "Tien do dap ung phan lon deadline",
                        2 => "Thai do hop tac va co trach nhiem",
                        _ => "Co dong gop cai tien nho"
                    }
                })).ToArray();
                context.PerformanceDetails.AddRange(details);
            }

            var aiEvaluations = employees.Take(12).Select((employee, index) => new AiEvaluationRecord
            {
                EmployeeId = employee.Id,
                Period = "Q1 2026",
                Evaluation = index % 3 == 0
                    ? "Hieu suat tot, nen giao them muc tieu lien phong ban."
                    : "Hieu suat on dinh, tiep tuc theo doi tien do va chat luong dau ra.",
                CreatedAt = DateTime.UtcNow.AddDays(-index)
            }).ToArray();
            context.AiEvaluationRecords.AddRange(aiEvaluations);

            var passwordHash = "jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=";
            var users = new User[]
            {
                new() { Username = "admin", PasswordHash = passwordHash, Role = "Admin", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Username = "quanly", PasswordHash = passwordHash, Role = "Manager", EmployeeId = employees[0].Id, IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Username = "nhanvien", PasswordHash = passwordHash, Role = "Employee", EmployeeId = employees[15].Id, IsActive = true, CreatedAt = DateTime.UtcNow }
            };
            context.Users.AddRange(users);
            context.SaveChanges();
        }

        private static string ToUsername(string fullName, int sequence)
        {
            var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return $"{parts[^1].ToLowerInvariant()}.{parts[0].ToLowerInvariant()}{sequence:00}";
        }
    }
}
