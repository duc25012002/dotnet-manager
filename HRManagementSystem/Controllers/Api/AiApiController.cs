using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;
using HRManagementSystem.Models;
using HRManagementSystem.Services;

namespace HRManagementSystem.Controllers.Api
{
    [Route("api/ai")]
    [ApiController]
    public class AiApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IGeminiAiService _geminiAiService;

        public AiApiController(AppDbContext context, IGeminiAiService geminiAiService)
        {
            _context = context;
            _geminiAiService = geminiAiService;
        }

        [HttpPost("performance-evaluation")]
        public async Task<ActionResult<AiEvaluationResponse>> GeneratePerformanceEvaluation(
            [FromBody] AiEvaluationRequest request,
            CancellationToken cancellationToken)
        {
            if (!_geminiAiService.IsConfigured)
            {
                return BadRequest(new { message = "Chưa cấu hình GEMINI_API_KEY cho backend." });
            }

            var employee = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Position)
                .FirstOrDefaultAsync(e => e.Id == request.EmployeeId, cancellationToken);

            if (employee == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên." });
            }

            var reviews = await _context.PerformanceReviews
                .Include(r => r.Details)
                    .ThenInclude(d => d.KpiCategory)
                .Where(r => r.EmployeeId == request.EmployeeId)
                .OrderByDescending(r => r.ReviewDate)
                .Take(6)
                .ToListAsync(cancellationToken);

            var contracts = await _context.Contracts
                .Where(c => c.EmployeeId == request.EmployeeId)
                .OrderByDescending(c => c.StartDate)
                .ToListAsync(cancellationToken);

            var workHistories = await _context.WorkHistories
                .Where(w => w.EmployeeId == request.EmployeeId)
                .OrderByDescending(w => w.EventDate)
                .Take(10)
                .ToListAsync(cancellationToken);

            var prompt = BuildEvaluationPrompt(employee, reviews, contracts, workHistories, request.Period);
            var evaluation = await _geminiAiService.GenerateTextAsync(prompt, cancellationToken);

            var record = new AiEvaluationRecord
            {
                EmployeeId = employee.Id,
                Period = request.Period,
                Evaluation = evaluation,
                CreatedAt = DateTime.UtcNow
            };
            _context.AiEvaluationRecords.Add(record);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new AiEvaluationResponse
            {
                Id = record.Id,
                EmployeeId = employee.Id,
                EmployeeName = employee.FullName,
                Period = request.Period,
                Evaluation = evaluation,
                CreatedAt = record.CreatedAt
            });
        }

        [HttpGet("performance-evaluation/history")]
        public async Task<ActionResult<IEnumerable<AiEvaluationResponse>>> GetEvaluationHistory([FromQuery] int? employeeId)
        {
            var query = _context.AiEvaluationRecords
                .Include(r => r.Employee)
                .AsQueryable();

            if (employeeId.HasValue)
            {
                query = query.Where(r => r.EmployeeId == employeeId.Value);
            }

            return await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new AiEvaluationResponse
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee != null ? r.Employee.FullName : string.Empty,
                    Period = r.Period,
                    Evaluation = r.Evaluation,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        private static string BuildEvaluationPrompt(
            Employee employee,
            IEnumerable<PerformanceReview> reviews,
            IEnumerable<Contract> contracts,
            IEnumerable<WorkHistory> workHistories,
            string? period)
        {
            var prompt = new StringBuilder();
            prompt.AppendLine("Bạn là trợ lý HR tại Việt Nam. Hãy đánh giá hiệu suất nhân viên dựa trên dữ liệu nội bộ.");
            prompt.AppendLine("Yêu cầu: viết tiếng Việt, khách quan, không bịa dữ liệu, nêu rõ nếu thiếu dữ liệu.");
            prompt.AppendLine("Định dạng gồm: Tổng quan, Điểm mạnh, Rủi ro/Cần cải thiện, Đề xuất hành động, Gợi ý trao đổi 1-1.");
            prompt.AppendLine();
            prompt.AppendLine($"Kỳ đánh giá: {period ?? "Không chỉ định"}");
            prompt.AppendLine($"Nhân viên: {employee.FullName}");
            prompt.AppendLine($"Phòng ban: {employee.Department?.Name ?? "Không có dữ liệu"}");
            prompt.AppendLine($"Chức vụ: {employee.Position?.Title ?? "Không có dữ liệu"}");
            prompt.AppendLine();

            prompt.AppendLine("KPI gần đây:");
            foreach (var review in reviews)
            {
                prompt.AppendLine($"- {review.Period} ({review.ReviewDate:dd/MM/yyyy}): {review.TotalScore}/10, trạng thái {review.Status}, nhận xét: {review.Feedback ?? "Không có"}");
                foreach (var detail in review.Details ?? [])
                {
                    prompt.AppendLine($"  + {detail.KpiCategory?.Name}: {detail.Score}/10. {detail.Note}");
                }
            }

            prompt.AppendLine();
            prompt.AppendLine("Hợp đồng:");
            foreach (var contract in contracts)
            {
                var endDate = contract.EndDate.HasValue ? contract.EndDate.Value.ToString("dd/MM/yyyy") : "Không thời hạn";
                prompt.AppendLine($"- {contract.ContractNumber}: {contract.ContractType}, từ {contract.StartDate:dd/MM/yyyy} đến {endDate}");
            }

            prompt.AppendLine();
            prompt.AppendLine("Quá trình làm việc:");
            foreach (var item in workHistories)
            {
                prompt.AppendLine($"- {item.EventDate:dd/MM/yyyy}: {item.EventType} - {item.Title}. {item.Description}");
                if (!string.IsNullOrWhiteSpace(item.FromDepartment) || !string.IsNullOrWhiteSpace(item.ToDepartment))
                {
                    prompt.AppendLine($"  Phòng ban: {item.FromDepartment ?? "-"} -> {item.ToDepartment ?? "-"}");
                }
                if (!string.IsNullOrWhiteSpace(item.FromPosition) || !string.IsNullOrWhiteSpace(item.ToPosition))
                {
                    prompt.AppendLine($"  Chức vụ: {item.FromPosition ?? "-"} -> {item.ToPosition ?? "-"}");
                }
            }

            return prompt.ToString();
        }
    }

    public class AiEvaluationRequest
    {
        public int EmployeeId { get; set; }
        public string? Period { get; set; }
    }

    public class AiEvaluationResponse
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string? Period { get; set; }
        public string Evaluation { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
