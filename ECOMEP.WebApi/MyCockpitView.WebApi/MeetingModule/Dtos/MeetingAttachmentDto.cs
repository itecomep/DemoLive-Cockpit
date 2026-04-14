using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.MeetingModule.Entities;

namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class MeetingAttachmentDto : BaseBlobEntityDto
{
    public int MeetingID { get; set; }
}

public class MeetingAttachmentDtoMapperProfile : Profile
{
    public MeetingAttachmentDtoMapperProfile()
    {


        CreateMap<MeetingAttachment, MeetingAttachmentDto>()
             .ReverseMap()
                      .ForMember(dest => dest.Meeting, opt => opt.Ignore());

    }
}
