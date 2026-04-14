namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class TaskActionDto 
{
    public int TaskID { get; set; }
    public int OutcomeFlag { get; set; }
    public string? Comment { get; set; }
    public int StatusFlag { get; set; }
    public string? Action {  get; set; }
    public DateTime? followUpDate { get; set; }

}
