using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.MeetingModule.Entities;

namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class MeetingVoucherAttachmentDto : BaseBlobEntityDto
{
    public int MeetingVoucherID { get; set; }
}

public class MeetingVoucherAttachmentDtoMapperProfile : Profile
{
    public MeetingVoucherAttachmentDtoMapperProfile()
    {


        CreateMap<MeetingVoucherAttachment, MeetingVoucherAttachmentDto>()
             .ReverseMap()
             .ForMember(dest => dest.MeetingVoucher, opt => opt.Ignore());

    }
}
