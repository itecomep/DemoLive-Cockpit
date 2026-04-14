using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetAttachmentDto : BaseBlobEntityDto
{
    public int AssetID { get; set; }
}

public class AssetAttachmentDtoMapperProfile : Profile
{
    public AssetAttachmentDtoMapperProfile()
    {
        CreateMap<AssetAttachment, AssetAttachmentDto>()
             .ReverseMap()
             .ForMember(dest => dest.Asset, opt => opt.Ignore());
    }
}
