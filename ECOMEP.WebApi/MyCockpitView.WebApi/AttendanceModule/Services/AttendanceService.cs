using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.AttendanceModule.Data;
using MyCockpitView.WebApi.AttendanceModule.Entities;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.AttendanceModule.Services
{
    public class AttendanceService
    {
        private readonly AttendanceContext _context;
        private readonly EntitiesContext _db;

        public AttendanceService(
    AttendanceContext context,
    EntitiesContext db
)
        {
            _context = context;
            _db = db;
        }

        public async Task<List<object>> GetAttendance()
        {
            var attendance = await _context.AttendanceLogs
                .OrderByDescending(x => x.PunchDate)
                .ToListAsync();

            var contacts = await _db.Contacts.ToListAsync();

            var meetings = await _db.Meetings
                .Include(x => x.Attendees)
                .ToListAsync();

            var result = attendance.Select(item =>
            {
                decimal totalMeetingHours = 0;

                var contact = contacts.FirstOrDefault(c =>

                    c.Card_No != null

                    &&

                    c.Card_No.ToString().Trim() ==
                    item.CardNo?.Trim()
                );

                if (contact != null)
                {
                    var employeeMeetings = meetings
                        .Where(m =>

                            item.PunchDate != null

                            &&

                            DateOnly.FromDateTime(m.StartDate.Date) ==
                            item.PunchDate.Value

                            &&

                            m.Attendees.Any(a =>

                                a.Name != null

                                &&

                                a.Name.ToLower().Trim() ==
                                contact.Name.ToLower().Trim()
                            )
                        )
                        .ToList();

                    totalMeetingHours = employeeMeetings.Sum(m =>

                        (decimal)(m.EndDate - m.StartDate).TotalHours
                    );
                }

                return new
                {
                    item.Id,

                    item.CardNo,

                    item.EmployeeId,

                    item.EmployeeName,

                    item.FirstPunch,

                    item.LastPunch,

                    item.PunchDate,

                    item.WorkingHours,

                    MeetingHours = totalMeetingHours
                };
            });

            return result.Cast<object>().ToList();
        }
    }
}