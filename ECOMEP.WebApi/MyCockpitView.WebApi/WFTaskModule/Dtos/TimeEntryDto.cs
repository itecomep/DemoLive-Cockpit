using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;



namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class TimeEntryDto : BaseEntityDto
{

    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }


    public string? TaskTitle { get; set; }

    public decimal ManHours { get; set; }


    public DateTime StartDate { get; set; }


    public DateTime? EndDate { get; set; }

    public int? WFTaskID { get; set; }

    public bool IsPaused { get; set; }

    public int? ProjectID { get; set; }
    public int CompanyID { get; set; }
    public decimal ManValue { get; set; }
    public decimal ValueHourRate { get; set; } = 0;
    public decimal ValueHourCost { get; set; } = 0;
    public int? EntityID { get; set; }
    public string? Entity { get; set; }
    public string? EntityTitle { get; set; }
}