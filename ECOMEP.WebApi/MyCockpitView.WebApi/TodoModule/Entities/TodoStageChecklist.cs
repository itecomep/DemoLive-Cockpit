using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.TodoModule.Entities
{
    public class TodoStageChecklist
    {
        // [StringLength(255)]
        public string? Title { get; set; }

        public int CategoryID { get; set; }

        public virtual TodoStageCategory? Category { get; set; }

        public string? Description { get; set; }

        public string? AttachmentUrl { get; set; }

        public DateTime Created { get; set; }          // ✅ NEW
        public DateTime? Modified { get; set; }        // ✅ NEW (NULL initially)

        public bool IsDeleted { get; internal set; }
        public int ID { get; internal set; }
    }
}