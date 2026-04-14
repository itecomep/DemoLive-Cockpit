using MyCockpitView.CoreModule;




namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class WFStageDto : BaseEntity
{




    public string? Code { get; set; }


    public string? TaskTitle { get; set; }


    public string? Entity { get; set; }


    public string? EntityTypeFlag { get; set; }

    public bool IsSystem { get; set; }
    public bool IsStart { get; set; }

    public decimal DueDays { get; set; }

    public bool IsAssignByRole { get; set; }

    public bool ShowAssessment { get; set; }


    public string? AssessmentForStage { get; set; }


    public string? AssignByProperty { get; set; }


    public string? AssignByEntityProperty { get; set; }
    public bool ShowComment { get; set; }
    public bool ShowFollowUpDate { get; set; }
    public bool ShowAttachment { get; set; }


    public string? ActionType { get; set; }

    public virtual ICollection<WFStageActionDto> Actions { get; set; } = new List<WFStageActionDto>();

    public bool IsCommentRequired { get; set; }

    public int InitialRevison { get; set; }
    public bool IsAssessmentRequired { get; set; }
    public bool IsPreAssignedTimeTask { get; set; }


}