using System.ComponentModel.DataAnnotations;

namespace HRManagementSystem.Models
{
    public class Department
    {
        public int Id { get; set; }
        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        public ICollection<Employee>? Employees { get; set; }
    }

    public class Position
    {
        public int Id { get; set; }
        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;
        public decimal BaseSalary { get; set; }
        
        public ICollection<Employee>? Employees { get; set; }
    }

    public class Employee
    {
        public int Id { get; set; }
        [Required, StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        
        // Authentication fields
        public string? Username { get; set; }
        public string? PasswordHash { get; set; }
        public string Role { get; set; } = "Employee"; // Employee, Manager, Admin
        public string? Avatar { get; set; }
        
        public int DepartmentId { get; set; }
        public Department? Department { get; set; }
        
        public int PositionId { get; set; }
        public Position? Position { get; set; }
        
        public ICollection<Contract>? Contracts { get; set; }
        public ICollection<PerformanceReview>? PerformanceReviews { get; set; }
    }

    public class Contract
    {
        public int Id { get; set; }
        [Required]
        public string ContractNumber { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ContractType { get; set; } = "Full-time";
        
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }

    public class WorkHistory
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }

        public DateTime EventDate { get; set; }
        [Required, StringLength(100)]
        public string EventType { get; set; } = "Update";
        [Required, StringLength(150)]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? FromDepartment { get; set; }
        public string? ToDepartment { get; set; }
        public string? FromPosition { get; set; }
        public string? ToPosition { get; set; }
    }

    public class AiEvaluationRecord
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }

        public string? Period { get; set; }
        public string Evaluation { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class KpiCategory
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty; // e.g., Quality, Deadline, Attitude
        public string? Description { get; set; }
        public int Weight { get; set; } // Weightage in percentage (e.g., 40 for 40%)
    }

    public class PerformanceReview
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        
        public DateTime ReviewDate { get; set; }
        public string Period { get; set; } = string.Empty; // e.g., "Q1 2026"
        
        public double TotalScore { get; set; } // Final weighted score
        public string? Feedback { get; set; }
        public string Status { get; set; } = "Draft"; // Draft, Finalized

        public ICollection<PerformanceDetail>? Details { get; set; }
    }

    public class PerformanceDetail
    {
        public int Id { get; set; }
        public int PerformanceReviewId { get; set; }
        public PerformanceReview? PerformanceReview { get; set; }

        public int KpiCategoryId { get; set; }
        public KpiCategory? KpiCategory { get; set; }

        public int Score { get; set; } // Raw score (e.g., 1-10)
        public string? Note { get; set; }
    }
}
