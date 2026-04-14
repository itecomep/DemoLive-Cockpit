using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.ContactModule.Dtos;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetVendorDto : BaseEntityDto
{
    public int AssetID { get; set; }
    public int? ContactID { get; set; }
    public ContactDto? Contact { get; set; }
    public string Title { get; set; }
}

public class AssetVendorDtoMapperProfile : Profile
{
    public AssetVendorDtoMapperProfile()
    {
        CreateMap<AssetVendor, AssetVendorDto>()
            .ReverseMap()
            .ForMember(dest => dest.Contact, opt => opt.Ignore())
            .ForMember(dest => dest.Asset, opt => opt.Ignore());
    }
}
