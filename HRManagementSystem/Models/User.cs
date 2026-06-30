using System.ComponentModel.DataAnnotations;

namespace HRManagementSystem.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required, StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required, StringLength(20)]
        public string Role { get; set; } = "Employee"; // Employee, Manager, Admin
        
        public int? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
