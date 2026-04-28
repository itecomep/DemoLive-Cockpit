using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ProjectModule.Dtos
{
    public class ProjectTargetDto
    {
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public string Stage { get; set; }

        [Required]
        public DateTime? TargetDate { get; set; }

        [Required]
        public string StageStatus { get; set; }

        public string Feedback { get; set; }
    }
}
