using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.TodoModule.Entities
{
    public class TodoStageCategory
    {
        [StringLength(255)]
        public string? Title { get; set; }

        public int StageID { get; set; }

        public virtual TodoStage? Stage { get; set; }

        public virtual ICollection<TodoStageChecklist> Checklists { get; set; } = new List<TodoStageChecklist>();
        public bool IsDeleted { get; internal set; }
        public int ID { get; internal set; }
    }
}
