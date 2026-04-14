
using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ActivityModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Dtos;

namespace MyCockpitView.WebApi.ActivityModule.Dtos;

public class ActivityDto : BaseEntityDto
{
    public int ContactID { get; set; }

    public string? Action { get; set; }

    public int? WFTaskID { get; set; }

    public string? Comments { get; set; }

    public string? Status { get; set; }

    public Guid ContactUID { get; set; }

    public string? ContactName { get; set; }
    public string? ContactPhotoUrl { get; set; }

    public ICollection<ActivityAttachmentDto> Attachments { get; set; } = new List<ActivityAttachmentDto>();

    public string? Entity { get; set; }
    public int? EntityID { get; set; }
    public string? EntityTitle { get; set; }

}

public class ActivityDtoMapperProfile : Profile
{
    public ActivityDtoMapperProfile()
    {

        CreateMap<Activity, ActivityDto>()
             .ReverseMap();

    }
}