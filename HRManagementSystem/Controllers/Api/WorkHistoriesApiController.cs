using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;
using HRManagementSystem.Models;

namespace HRManagementSystem.Controllers.Api
{
    [Route("api/work-histories")]
    [ApiController]
    public class WorkHistoriesApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkHistoriesApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkHistory>>> GetWorkHistories([FromQuery] int? employeeId)
        {
            var query = _context.WorkHistories
                .Include(w => w.Employee)
                    .ThenInclude(e => e.Department)
                .Include(w => w.Employee)
                    .ThenInclude(e => e.Position)
                .AsQueryable();

            if (employeeId.HasValue)
            {
                query = query.Where(w => w.EmployeeId == employeeId.Value);
            }

            return await query
                .OrderByDescending(w => w.EventDate)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkHistory>> GetWorkHistory(int id)
        {
            var workHistory = await _context.WorkHistories
                .Include(w => w.Employee)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (workHistory == null)
            {
                return NotFound();
            }

            return workHistory;
        }

        [HttpPost]
        public async Task<ActionResult<WorkHistory>> CreateWorkHistory([FromBody] WorkHistoryRequest request)
        {
            var workHistory = new WorkHistory
            {
                EmployeeId = request.EmployeeId,
                EventDate = request.EventDate,
                EventType = request.EventType,
                Title = request.Title,
                Description = request.Description,
                FromDepartment = request.FromDepartment,
                ToDepartment = request.ToDepartment,
                FromPosition = request.FromPosition,
                ToPosition = request.ToPosition
            };

            _context.WorkHistories.Add(workHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkHistory), new { id = workHistory.Id }, workHistory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkHistory(int id, [FromBody] WorkHistoryRequest request)
        {
            var workHistory = await _context.WorkHistories.FindAsync(id);
            if (workHistory == null)
            {
                return NotFound();
            }

            workHistory.EmployeeId = request.EmployeeId;
            workHistory.EventDate = request.EventDate;
            workHistory.EventType = request.EventType;
            workHistory.Title = request.Title;
            workHistory.Description = request.Description;
            workHistory.FromDepartment = request.FromDepartment;
            workHistory.ToDepartment = request.ToDepartment;
            workHistory.FromPosition = request.FromPosition;
            workHistory.ToPosition = request.ToPosition;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkHistory(int id)
        {
            var workHistory = await _context.WorkHistories.FindAsync(id);
            if (workHistory == null)
            {
                return NotFound();
            }

            _context.WorkHistories.Remove(workHistory);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class WorkHistoryRequest
    {
        public int EmployeeId { get; set; }
        public DateTime EventDate { get; set; }
        public string EventType { get; set; } = "Update";
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? FromDepartment { get; set; }
        public string? ToDepartment { get; set; }
        public string? FromPosition { get; set; }
        public string? ToPosition { get; set; }
    }
}
