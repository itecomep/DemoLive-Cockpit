using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class AssessmentDto : BaseEntityDto
{

    public int? EntityID { get; set; }
    public string? Entity { get; set; }
    public string? EntityTitle { get; set; }
    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }


    public string? TaskTitle { get; set; }
    public string? Category { get; set; }

    public decimal Points { get; set; }

    public decimal ScoredPoints { get; set; }

    public string? Comment { get; set; }

    public int? WFTaskID { get; set; }

}