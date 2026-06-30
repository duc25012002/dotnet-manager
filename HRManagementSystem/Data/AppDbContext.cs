using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Models;

namespace HRManagementSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Department> Departments { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<WorkHistory> WorkHistories { get; set; }
        public DbSet<AiEvaluationRecord> AiEvaluationRecords { get; set; }
        public DbSet<PerformanceReview> PerformanceReviews { get; set; }
        public DbSet<PerformanceDetail> PerformanceDetails { get; set; }
        public DbSet<KpiCategory> KpiCategories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed KPI Categories
            modelBuilder.Entity<KpiCategory>().HasData(
                new KpiCategory { Id = 1, Name = "Chất lượng công việc", Weight = 40, Description = "Độ chính xác và hiệu quả của kết quả đầu ra" },
                new KpiCategory { Id = 2, Name = "Tiến độ công việc", Weight = 30, Description = "Khả năng hoàn thành đúng thời hạn (Deadline)" },
                new KpiCategory { Id = 3, Name = "Thái độ & Kỷ luật", Weight = 20, Description = "Chấp hành nội quy và tinh thần phối hợp" },
                new KpiCategory { Id = 4, Name = "Kỹ năng mềm", Weight = 10, Description = "Giao tiếp, làm việc nhóm, giải quyết vấn đề" }
            );
        }
    }
}
