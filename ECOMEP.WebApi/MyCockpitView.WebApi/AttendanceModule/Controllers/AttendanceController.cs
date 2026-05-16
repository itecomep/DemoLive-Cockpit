using Microsoft.AspNetCore.Mvc;
using MyCockpitView.WebApi.AttendanceModule.Services;

namespace MyCockpitView.WebApi.AttendanceModule.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly AttendanceService _attendanceService;

        public AttendanceController(AttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendance()
        {
            var data = await _attendanceService.GetAttendance();
            return Ok(data);
        }
    }
}