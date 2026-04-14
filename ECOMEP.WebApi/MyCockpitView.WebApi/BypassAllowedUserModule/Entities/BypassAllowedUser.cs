using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.Entities
{
    public class BypassAllowedUser : BaseEntity
    {              // matches your DB
        public string Username { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
