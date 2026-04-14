namespace MyCockpitView.WebApi.Models
{
    public class EmailContact
    {
        public int ID { get; set; }
        public Guid UID { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Company { get; set; }
        public string? TypeValue { get; set; }
        public int TypeFlag { get; set; }
        public string? PhotoUrl { get; set; }
    }

    public class MeetingEmailContact : EmailContact
    {
        public int PendingAgendaCount { get; set; }
    }

    public class SiteVisitEmailContact : EmailContact
    {
        public int PendingAgendaCount { get; set; }
    }
}