using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.NotificationModule.Controller
{
    
    
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly EntitiesContext _db;
        private readonly ICurrentUserService _currentUser;

        public NotificationController(
            EntitiesContext db,
            ICurrentUserService currentUser)
        {
            _db = db;
            _currentUser = currentUser;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var username = _currentUser.GetCurrentUsername();

            var notifications = await _db.Notifications
     .Where(x => x.Username.ToLower() == username.ToLower())
     .OrderByDescending(x => x.CreatedAt)
     .Take(50)
     .ToListAsync();

            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _db.Notifications.FindAsync(id);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;

            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
