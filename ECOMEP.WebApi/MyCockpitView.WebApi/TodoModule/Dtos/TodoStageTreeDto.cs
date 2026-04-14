namespace MyCockpitView.WebApi.TodoModule.Dtos
{
    public class TodoStageTreeDto
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public int OrderFlag { get; set; }

        public List<TodoStageCategoryDto> Categories { get; set; } = new();
    }

    public class TodoStageCategoryDto
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public int StageID { get; set; }

        public int OrderFlag { get; set; }

        public List<TodoStageChecklistDto> Checklists { get; set; } = new();
    }

    public class TodoStageChecklistDto
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public int CategoryID { get; set; }

        public int OrderFlag { get; set; }
       
        public string? Description { get; set; }
      
        public string? AttachmentUrl { get; set; }
    }
}

