using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;
using HRManagementSystem.Models;
using System.Security.Cryptography;
using System.Text;

namespace HRManagementSystem.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var passwordHash = HashPassword(request.Password);
            
            var user = await _context.Users
                .Include(u => u.Employee)
                    .ThenInclude(e => e.Department)
                .Include(u => u.Employee)
                    .ThenInclude(e => e.Position)
                .FirstOrDefaultAsync(u => 
                    u.Username == request.Username && 
                    u.PasswordHash == passwordHash &&
                    u.IsActive);

            if (user == null)
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new LoginResponse
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                Employee = user.Employee,
                Token = GenerateToken(user)
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] RegisterRequest request)
        {
            // Check if username exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = HashPassword(request.Password),
                Role = request.Role ?? "Employee",
                EmployeeId = request.EmployeeId,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Login), new { id = user.Id }, user);
        }

        [HttpGet("me")]
        public async Task<ActionResult<User>> GetCurrentUser([FromQuery] int userId)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                    .ThenInclude(e => e.Department)
                .Include(u => u.Employee)
                    .ThenInclude(e => e.Position)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private string GenerateToken(User user)
        {
            // Simple token generation (in production, use JWT)
            return Convert.ToBase64String(Encoding.UTF8.GetBytes($"{user.Id}:{user.Username}:{DateTime.UtcNow.Ticks}"));
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Role { get; set; }
        public int? EmployeeId { get; set; }
    }

    public class LoginResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public Employee? Employee { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
