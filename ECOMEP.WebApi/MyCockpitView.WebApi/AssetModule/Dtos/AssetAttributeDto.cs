using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetAttributeDto : BaseEntityDto
{
    public int AssetID { get; set; }
    public virtual Asset? Asset { get; set; }
    public string AttributeKey { get; set; }
    public string? AttributeValue { get; set; }
    public string InputType { get; set; }
    public string? InputOptions { get; set; }
    public bool IsRequired { get; set; }
}

public class AssetAttributeDtoMapperProfile : Profile
{
    public AssetAttributeDtoMapperProfile()
    {
        CreateMap<AssetAttribute, AssetAttributeDto>()
              .ReverseMap()
             .ForMember(dest => dest.Asset, opt => opt.Ignore());
    }
}
