using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class WFStageActionDto : BaseEntity
{


    public int WFStageID { get; set; }


    public int TaskOutcomeFlag { get; set; }

    public int TaskStatusFlag { get; set; }


    public string? ActionByCondition { get; set; }
    public int ActionByCount { get; set; }



    public string? NextStageCode { get; set; }


    public string? ShowOnStatusFlag { get; set; }


    public string? ActivityText { get; set; }


    public string? ButtonClass { get; set; } = "primary";


    public string? ButtonText { get; set; }


    public string? ButtonTooltip { get; set; }

    public bool TriggerEntityFormSubmit { get; set; }

}