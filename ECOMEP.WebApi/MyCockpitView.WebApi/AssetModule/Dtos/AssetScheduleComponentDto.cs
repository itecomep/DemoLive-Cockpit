using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetScheduleComponentDto : BaseEntityDto
{
    public string Component { get; set; }
    public DateTime? WarrantyDate { get; set; }
    public decimal Cost { get; set; }
    public int ScheduleID { get; set; }
}

public class AssetScheduleComponentDtoMapperProfile : Profile
{
    public AssetScheduleComponentDtoMapperProfile()
    {
        CreateMap<AssetScheduleComponent, AssetScheduleComponentDto>()
             .ReverseMap()
             .ForMember(dest => dest.Schedule, opt => opt.Ignore());
    }
}
