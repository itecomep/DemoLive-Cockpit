using AutoMapper;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.SiteVisitModule.Entities;

namespace MyCockpitView.WebApi.SiteVisitModule.Dtos;

public class SiteVisitDto : BaseEntityDto
{
    public bool IsReadOnly { get; set; }
    public int? ParentID { get; set; }
    public string? Title { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Code { get; set; }
    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }
    public decimal Version { get; set; }
    public DateTime? ClosedOn { get; set; }
    public DateTime? FinalizedOn { get; set; }
    public bool IsEditable { get; set; }
    public bool IsDelayed { get; set; }
    public int? ProjectID { get; set; }
    public int? EntityID { get; set; }
    public string? Entity { get; set; }
    public string? EntityTitle { get; set; }
    public string? Location { get; set; }

    public bool IsSent { get; set; }

    public IEnumerable<SiteVisitAttendeeDto> Attendees { get; set; } = new HashSet<SiteVisitAttendeeDto>();
    public IEnumerable<SiteVisitAgendaDto> Agendas { get; set; } = new HashSet<SiteVisitAgendaDto>();
    public int Annexure { get; set; }


}

public class SiteVisitDtoMapperProfile : Profile
{
    public SiteVisitDtoMapperProfile()
    {
        CreateMap<SiteVisit, SiteVisitDto>()
            .ForMember(dest => dest.Agendas, opt => opt.MapFrom(src => src.Agendas.Where(x => !x.IsDeleted)))
            .ForMember(dest => dest.Attendees, opt => opt.MapFrom(src => src.Attendees.Where(x => !x.IsDeleted)))
     .ReverseMap()
         .ForMember(dest => dest.Agendas, opt => opt.Ignore())
         .ForMember(dest => dest.Attendees, opt => opt.Ignore())
          .ForMember(dest => dest.Contact, opt => opt.Ignore());

    }
}

