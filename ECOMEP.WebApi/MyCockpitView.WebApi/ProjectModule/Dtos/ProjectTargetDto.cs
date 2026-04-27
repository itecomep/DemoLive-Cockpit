namespace MyCockpitView.WebApi.ProjectModule.Dtos
{
    public class ProjectTargetDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Stage { get; set; }
        public DateTime? TargetDate { get; set; }
        public string StageStatus { get; set; }
        public string Feedback { get; set; }
    }
}
