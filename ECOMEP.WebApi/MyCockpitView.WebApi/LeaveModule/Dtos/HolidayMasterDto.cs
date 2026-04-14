using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.LeaveModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.LeaveModule.Dtos;
public class HolidayMasterDto : BaseEntityDto
{
    [Required]
    [StringLength(50)]
    public string? Title { get; set; }
    public DateTime HolidayDate { get; set; }
}

public class HolidayMasterDtoMapperProfile : Profile
{
    public HolidayMasterDtoMapperProfile()
    {
        CreateMap<HolidayMaster, HolidayMasterDto>()
                     .ReverseMap();

    }
}
