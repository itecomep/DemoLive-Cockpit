using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.AttendanceModule.Data;
using MyCockpitView.WebApi.AttendanceModule.Entities;

namespace MyCockpitView.WebApi.AttendanceModule.Services
{
    public class AttendanceService
    {
        private readonly AttendanceContext _context;

        public AttendanceService(AttendanceContext context)
        {
            _context = context;
        }

        public async Task<List<AttendanceLog>> GetAttendance()
        {
            return await _context.AttendanceLogs
                .OrderByDescending(x => x.PunchDate)
                .ToListAsync();
        }
    }
}