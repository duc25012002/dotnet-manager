using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;
using HRManagementSystem.Models;

namespace HRManagementSystem.Controllers.Api
{
    [Route("api/contracts")]
    [ApiController]
    public class ContractsApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContractsApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contract>>> GetContracts()
        {
            return await _context.Contracts
                .Include(c => c.Employee)
                    .ThenInclude(e => e.Position)
                .OrderByDescending(c => c.StartDate)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContract(int id)
        {
            var contract = await _context.Contracts
                .Include(c => c.Employee)
                    .ThenInclude(e => e.Position)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contract == null)
            {
                return NotFound();
            }

            return contract;
        }

        [HttpPost]
        public async Task<ActionResult<Contract>> CreateContract([FromBody] ContractRequest request)
        {
            var contract = new Contract
            {
                ContractNumber = request.ContractNumber,
                ContractType = request.ContractType,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                EmployeeId = request.EmployeeId
            };

            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContract), new { id = contract.Id }, contract);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContract(int id, [FromBody] ContractRequest request)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }

            contract.ContractNumber = request.ContractNumber;
            contract.ContractType = request.ContractType;
            contract.StartDate = request.StartDate;
            contract.EndDate = request.EndDate;
            contract.EmployeeId = request.EmployeeId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContract(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }

            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class ContractRequest
    {
        public string ContractNumber { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ContractType { get; set; } = "Full-time";
        public int EmployeeId { get; set; }
    }
}
