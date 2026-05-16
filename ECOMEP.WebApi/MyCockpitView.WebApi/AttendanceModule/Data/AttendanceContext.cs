using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.AttendanceModule.Entities;

namespace MyCockpitView.WebApi.AttendanceModule.Data
{
    public class AttendanceContext : DbContext
    {
        public AttendanceContext(DbContextOptions<AttendanceContext> options)
            : base(options)
        {
        }

        public DbSet<AttendanceLog> AttendanceLogs { get; set; }
    }
}