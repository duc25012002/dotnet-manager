using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;
using HRManagementSystem.Models;

namespace HRManagementSystem.Controllers.Api
{
    [Route("api/kpi")]
    [ApiController]
    public class KpiApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KpiApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<KpiCategory>>> GetCategories()
        {
            return await _context.KpiCategories.ToListAsync();
        }

        [HttpGet("reviews")]
        public async Task<ActionResult<IEnumerable<PerformanceReview>>> GetReviews()
        {
            return await _context.PerformanceReviews
                .Include(r => r.Employee)
                    .ThenInclude(e => e.Position)
                .Include(r => r.Details)
                    .ThenInclude(d => d.KpiCategory)
                .OrderByDescending(r => r.ReviewDate)
                .ToListAsync();
        }

        [HttpGet("reviews/{id}")]
        public async Task<ActionResult<PerformanceReview>> GetReview(int id)
        {
            var review = await _context.PerformanceReviews
                .Include(r => r.Employee)
                .Include(r => r.Details)
                    .ThenInclude(d => d.KpiCategory)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound();
            }

            return review;
        }

        [HttpPost("reviews")]
        public async Task<ActionResult<PerformanceReview>> CreateReview([FromBody] CreateReviewRequest request)
        {
            var categories = await _context.KpiCategories.ToListAsync();
            double totalScore = 0;
            var details = new List<PerformanceDetail>();

            foreach (var cat in categories)
            {
                if (request.Scores.ContainsKey(cat.Id))
                {
                    double score = request.Scores[cat.Id];
                    totalScore += (score * (cat.Weight / 100.0));

                    details.Add(new PerformanceDetail
                    {
                        KpiCategoryId = cat.Id,
                        Score = (int)score,
                        Note = ""
                    });
                }
            }

            var review = new PerformanceReview
            {
                EmployeeId = request.EmployeeId,
                Period = request.Period,
                ReviewDate = DateTime.Parse(request.ReviewDate),
                Feedback = request.Feedback,
                TotalScore = Math.Round(totalScore, 2),
                Status = "Finalized",
                Details = details
            };

            _context.PerformanceReviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
        }
    }

    public class CreateReviewRequest
    {
        public int EmployeeId { get; set; }
        public string Period { get; set; } = string.Empty;
        public string ReviewDate { get; set; } = string.Empty;
        public string Feedback { get; set; } = string.Empty;
        public Dictionary<int, double> Scores { get; set; } = new();
    }
}
