using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetAttributeMasterDto : BaseEntityDto
{
    public string Category { get; set; }
    public string Attribute { get; set; }
    public string InputType { get; set; }
    public string InputOptions { get; set; }
    public bool IsRequired { get; set; }
}

public class AssetAttributeMasterDtoMapperProfile : Profile
{
    public AssetAttributeMasterDtoMapperProfile()
    {
        CreateMap<AssetAttributeMaster, AssetAttributeMasterDto>()
              .ReverseMap();
    }
}
