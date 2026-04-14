using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.MeetingModule.Entities;

namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class MeetingAttendeeDto : BaseEntityDto
{
    public int MeetingID { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Company { get; set; }
    public int? ContactID { get; set; }
    public int PendingAgendaCount { get; set; } = 0;
    public bool? isRecipient { get; set; }
}
public class MeetingAttendeeDtoMapperProfile : Profile
{
    public MeetingAttendeeDtoMapperProfile()
    {
        CreateMap<MeetingAttendee, MeetingAttendeeDto>()
         .ReverseMap()
         .ForMember(dest => dest.Meeting, opt => opt.Ignore());

    }
}