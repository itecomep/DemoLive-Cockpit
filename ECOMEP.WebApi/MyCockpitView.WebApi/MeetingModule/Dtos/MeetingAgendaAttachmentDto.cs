using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.MeetingModule.Entities;

namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class MeetingAgendaAttachmentDto : BaseBlobEntityDto
{
    public int MeetingAgendaID { get; set; }
}

public class MeetingAgendaAttachmentDtoMapperProfile : Profile
{
    public MeetingAgendaAttachmentDtoMapperProfile()
    {


        CreateMap<MeetingAgendaAttachment, MeetingAgendaAttachmentDto>()
             .ReverseMap()
                      .ForMember(dest => dest.MeetingAgenda, opt => opt.Ignore());

    }
}
