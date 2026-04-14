using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class WFTaskDto : BaseEntityDto
{
    public int? AssignerContactID { get; set; }
    public virtual ContactListDto? AssignerContact { get; set; }
    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }


    public string? Title { get; set; }


    public string? Subtitle { get; set; }



    public string? WFStageCode { get; set; }


    public int StageIndex { get; set; }


    public int StageRevision { get; set; }




    public DateTime StartDate { get; set; }



    public DateTime? CompletedDate { get; set; }




    public DateTime DueDate { get; set; }


    public DateTime? FollowUpDate { get; set; }


    public int OutcomeFlag { get; set; }
    public string? Comment { get; set; }
    public string? History { get; set; }
    public virtual ICollection<TimeEntryDto> TimeEntries { get; set; } = new List<TimeEntryDto>();
    public virtual ICollection<AssessmentDto> Assessments { get; set; } = new List<AssessmentDto>();
    public virtual ICollection<WFTaskAttachmentDto> Attachments { get; set; } = new List<WFTaskAttachmentDto>();

    public bool IsPreAssignedTimeTask { get; set; }
     public decimal MHrAssigned { get; set; }
     public decimal MHrConsumed { get; set; }
     public decimal MHrAssessed { get; set; }
     public decimal VHrAssigned { get; set; }
     public decimal VHrConsumed { get; set; }
     public decimal VHrAssessed { get; set; }
     public decimal VHrAssignedCost { get; set; }
     public decimal VHrConsumedCost { get; set; }
     public decimal VHrAssessedCost { get; set; }
     public decimal VHrRate { get; set; }
    public bool IsDelayed { get; set; }
     public decimal ManValue { get; set; }
     public decimal? AssessmentPoints { get; set; }
    public bool IsAssessmentRequired { get; set; }
    public string? PreviousStageCode { get; set; }
    public int? PreviousStageRevision { get; set; }
    public int? PreviousTaskID { get; set; }

    public string? AssessmentRemark { get; set; }
    public string? AlertMessage { get; set; }
    public bool IsShowAlert { get; set; }

    public WFStageDto? WFStage { get; set; }

    public string? Entity { get; set; }
    public int? EntityID { get; set; }
    public string? EntityTitle { get; set; }
    public int? ProjectID { get; set; }

    public int CompanyID { get; set; }
    [StringLength(50)]
    public string? Priority { get; set; }
}
