using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetLinkDto : BaseEntityDto
{
    public int PrimaryAssetID { get; set; }
    public int SecondaryAssetID { get; set; }
    public virtual AssetDto? PrimaryAsset { get; set; }
    public virtual AssetDto? SecondaryAsset { get; set; }


}

public class AssetLinkDtoMapperProfile : Profile
{
    public AssetLinkDtoMapperProfile()
    {
        CreateMap<AssetLink, AssetLinkDto>()
            .ReverseMap()
                .ForMember(dest => dest.PrimaryAsset, opt => opt.Ignore())
                .ForMember(dest => dest.SecondaryAsset, opt => opt.Ignore());
    }
}
