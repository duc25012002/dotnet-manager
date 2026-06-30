using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;
using HRManagementSystem.Models;

namespace HRManagementSystem.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PositionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Position>>> GetPositions()
        {
            return await _context.Positions
                .Include(p => p.Employees)
                .OrderBy(p => p.Title)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Position>> GetPosition(int id)
        {
            var position = await _context.Positions.FindAsync(id);

            if (position == null)
            {
                return NotFound();
            }

            return position;
        }

        [HttpPost]
        public async Task<ActionResult<Position>> CreatePosition([FromBody] PositionRequest request)
        {
            var position = new Position
            {
                Title = request.Title,
                BaseSalary = request.BaseSalary
            };

            _context.Positions.Add(position);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPosition), new { id = position.Id }, position);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePosition(int id, [FromBody] PositionRequest request)
        {
            var position = await _context.Positions.FindAsync(id);
            if (position == null)
            {
                return NotFound();
            }

            position.Title = request.Title;
            position.BaseSalary = request.BaseSalary;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePosition(int id)
        {
            var position = await _context.Positions
                .Include(p => p.Employees)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (position == null)
            {
                return NotFound();
            }

            if (position.Employees?.Any() == true)
            {
                return BadRequest(new { message = "Không thể xóa chức vụ đang có nhân viên." });
            }

            _context.Positions.Remove(position);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class PositionRequest
    {
        public string Title { get; set; } = string.Empty;
        public decimal BaseSalary { get; set; }
    }
}
