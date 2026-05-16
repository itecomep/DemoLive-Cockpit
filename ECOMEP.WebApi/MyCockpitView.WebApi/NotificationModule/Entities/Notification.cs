namespace MyCockpitView.WebApi.NotificationModule.Entities
{
    public class Notification
    {
        public int ID { get; set; }

        public string Username { get; set; }

        public string Message { get; set; }

        public string Source { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}