namespace MyCockpitView.WebApi.MeetingModule.Dtos
{
    public class MeetingSummaryDto
    {
        public string AttendeeName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Type { get; set; } 
        public string Title { get; set; }
        public string Purpose { get; set; }
        public string Location { get; set; }
        public decimal TotalHours { get; set; }
    }
}
