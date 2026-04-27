namespace MyCockpitView.WebApi.ProjectModule.Entities
{
    public class ProjectTargetHistory
    {
        public int Id { get; set; }

        public int ProjectTargetId { get; set; }

        public string? FieldName { get; set; }   // TargetDate / StageStatus / Feedback

        public string? OldValue { get; set; }
        public string? NewValue { get; set; }

        public DateTime? ChangedOn { get; set; } = DateTime.Now;

        public ProjectTarget ProjectTarget { get; set; }
    }
}
