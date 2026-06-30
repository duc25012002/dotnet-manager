using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HRManagementSystem.Data;
using HRManagementSystem.Models;

namespace HRManagementSystem.Controllers
{
    public class KpiController : Controller
    {
        private readonly AppDbContext _context;

        public KpiController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var reviews = _context.PerformanceReviews.Include(r => r.Employee).OrderByDescending(r => r.ReviewDate);
            return View(await reviews.ToListAsync());
        }

        public async Task<IActionResult> Create()
        {
            ViewData["EmployeeId"] = new SelectList(_context.Employees, "Id", "FullName");
            ViewData["Categories"] = await _context.KpiCategories.ToListAsync();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateAssessment(int employeeId, string period, DateTime reviewDate, string feedback, Dictionary<int, double> scores)
        {
            var categories = await _context.KpiCategories.ToListAsync();
            double totalScore = 0;
            var details = new List<PerformanceDetail>();

            foreach (var cat in categories)
            {
                if (scores.ContainsKey(cat.Id))
                {
                    double score = scores[cat.Id];
                    totalScore += (score * (cat.Weight / 100.0));

                    details.Add(new PerformanceDetail
                    {
                        KpiCategoryId = cat.Id,
                        Score = (int)score, // Storing as int for simplicity, or change to double in Model if needed
                        Note = ""
                    });
                }
            }

            var review = new PerformanceReview
            {
                EmployeeId = employeeId,
                Period = period,
                ReviewDate = reviewDate,
                Feedback = feedback,
                TotalScore = Math.Round(totalScore, 2),
                Status = "Finalized",
                Details = details
            };

            _context.PerformanceReviews.Add(review);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Index));
        }
    }
}
