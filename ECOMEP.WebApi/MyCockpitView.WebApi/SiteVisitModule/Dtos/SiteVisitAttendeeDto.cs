using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.SiteVisitModule.Entities;

namespace MyCockpitView.WebApi.SiteVisitModule.Dtos;

public class SiteVisitAttendeeDto : BaseEntityDto
{
    public int SiteVisitID { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Company { get; set; }
    public int? ContactID { get; set; }
    public int PendingAgendaCount { get; set; } = 0;
}
public class SiteVisitAttendeeDtoMapperProfile : Profile
{
    public SiteVisitAttendeeDtoMapperProfile()
    {
        CreateMap<SiteVisitAttendee, SiteVisitAttendeeDto>()
         .ReverseMap()
         .ForMember(dest => dest.SiteVisit, opt => opt.Ignore());

    }
}