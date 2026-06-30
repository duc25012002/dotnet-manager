using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;

namespace HRManagementSystem.Controllers.Api
{
    [Route("api/reports")]
    [ApiController]
    public class ReportsApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<ReportSummaryResponse>> GetSummary()
        {
            var today = DateTime.Today;
            var inThirtyDays = today.AddDays(30);

            var employees = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Position)
                .ToListAsync();

            var reviews = await _context.PerformanceReviews
                .Include(r => r.Employee)
                .ThenInclude(e => e.Department)
                .ToListAsync();

            var contracts = await _context.Contracts
                .Include(c => c.Employee)
                .ToListAsync();

            var latestReviewByEmployee = reviews
                .GroupBy(r => r.EmployeeId)
                .Select(g => g.OrderByDescending(r => r.ReviewDate).First())
                .ToList();

            return new ReportSummaryResponse
            {
                TotalEmployees = employees.Count,
                TotalDepartments = await _context.Departments.CountAsync(),
                TotalPositions = await _context.Positions.CountAsync(),
                TotalContracts = contracts.Count,
                TotalKpiReviews = reviews.Count,
                AverageKpiScore = reviews.Count > 0 ? Math.Round(reviews.Average(r => r.TotalScore), 2) : 0,
                ExpiringContracts = contracts
                    .Where(c => c.EndDate.HasValue && c.EndDate.Value.Date >= today && c.EndDate.Value.Date <= inThirtyDays)
                    .OrderBy(c => c.EndDate)
                    .Select(c => new ExpiringContractReport
                    {
                        Id = c.Id,
                        ContractNumber = c.ContractNumber,
                        EmployeeName = c.Employee?.FullName ?? string.Empty,
                        EndDate = c.EndDate!.Value,
                        DaysLeft = (c.EndDate.Value.Date - today).Days
                    })
                    .ToList(),
                DepartmentStats = employees
                    .GroupBy(e => e.Department?.Name ?? "Chưa phân phòng")
                    .Select(g => new DepartmentReport
                    {
                        DepartmentName = g.Key,
                        EmployeeCount = g.Count(),
                        AverageKpiScore = latestReviewByEmployee
                            .Where(r => r.Employee?.Department?.Name == g.Key)
                            .DefaultIfEmpty()
                            .Average(r => r?.TotalScore ?? 0)
                    })
                    .OrderByDescending(x => x.EmployeeCount)
                    .ToList(),
                TopEmployees = latestReviewByEmployee
                    .OrderByDescending(r => r.TotalScore)
                    .Take(5)
                    .Select(r => new EmployeeKpiReport
                    {
                        EmployeeId = r.EmployeeId,
                        EmployeeName = r.Employee?.FullName ?? string.Empty,
                        Period = r.Period,
                        Score = r.TotalScore
                    })
                    .ToList(),
                LowKpiEmployees = latestReviewByEmployee
                    .Where(r => r.TotalScore < 6)
                    .OrderBy(r => r.TotalScore)
                    .Take(5)
                    .Select(r => new EmployeeKpiReport
                    {
                        EmployeeId = r.EmployeeId,
                        EmployeeName = r.Employee?.FullName ?? string.Empty,
                        Period = r.Period,
                        Score = r.TotalScore
                    })
                    .ToList()
            };
        }
    }

    public class ReportSummaryResponse
    {
        public int TotalEmployees { get; set; }
        public int TotalDepartments { get; set; }
        public int TotalPositions { get; set; }
        public int TotalContracts { get; set; }
        public int TotalKpiReviews { get; set; }
        public double AverageKpiScore { get; set; }
        public List<DepartmentReport> DepartmentStats { get; set; } = [];
        public List<ExpiringContractReport> ExpiringContracts { get; set; } = [];
        public List<EmployeeKpiReport> TopEmployees { get; set; } = [];
        public List<EmployeeKpiReport> LowKpiEmployees { get; set; } = [];
    }

    public class DepartmentReport
    {
        public string DepartmentName { get; set; } = string.Empty;
        public int EmployeeCount { get; set; }
        public double AverageKpiScore { get; set; }
    }

    public class ExpiringContractReport
    {
        public int Id { get; set; }
        public string ContractNumber { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime EndDate { get; set; }
        public int DaysLeft { get; set; }
    }

    public class EmployeeKpiReport
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public double Score { get; set; }
    }
}
