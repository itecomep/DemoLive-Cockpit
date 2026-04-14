using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetScheduleAttachmentDto : BaseBlobEntityDto
{
    public int AssetScheduleID { get; set; }
}

public class AssetScheduleAttachmentDtoMapperProfile : Profile
{
    public AssetScheduleAttachmentDtoMapperProfile()
    {
        CreateMap<AssetScheduleAttachment, AssetScheduleAttachmentDto>()
              .ReverseMap()
             .ForMember(dest => dest.AssetSchedule, opt => opt.Ignore());
    }
}
