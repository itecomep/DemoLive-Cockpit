using Microsoft.AspNetCore.Http;

namespace MyCockpitView.WebApi.TodoModule.Dtos
{
    public class ChecklistSaveDto
    {
        public int? StageId { get; set; }
        public string? NewStage { get; set; }

        public int? CategoryId { get; set; }
        public string? NewCategory { get; set; }

        public List<ChecklistItemDto> Items { get; set; }
    }

    public class ChecklistItemDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string FileKey { get; set; }
    }
}
