using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.ProjectModule.Entities
{
    public class ProjectTarget
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Stage { get; set; }
        public DateTime? TargetDate { get; set; }
        public string StageStatus { get; set; }
        public string Feedback { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }

        public Project Project { get; set; }
    }
}
