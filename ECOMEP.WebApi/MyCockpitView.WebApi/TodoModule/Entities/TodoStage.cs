using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.TodoModule.Entities
{
    public class TodoStage 
    {
        [StringLength(255)]
        public string? Title { get; set; }

        public virtual ICollection<TodoStageCategory> Categories { get; set; } = new List<TodoStageCategory>();
        public bool IsDeleted { get; internal set; }
        public int ID { get; set; }
    }
}
