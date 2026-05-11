using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.AttendanceModule.Entities
{
    [Table("attendance")]
    public class AttendanceLog
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("card_no")]
        public string? CardNo { get; set; }

        [Column("employee_id")]
        public long? EmployeeId { get; set; }

        [Column("employee_name")]
        public string? EmployeeName { get; set; }

        [Column("first_punch")]
        public DateTime? FirstPunch { get; set; }

        [Column("last_punch")]
        public DateTime? LastPunch { get; set; }

        [Column("punch_date")]
        public DateOnly? PunchDate { get; set; }

        [Column("working_hours")]
        public string? WorkingHours { get; set; }
    }
}