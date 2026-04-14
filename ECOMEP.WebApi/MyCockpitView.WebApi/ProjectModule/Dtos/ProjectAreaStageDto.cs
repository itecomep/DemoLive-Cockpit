using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ProjectModule.Dtos;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectAreaStageDto : BaseEntityDto
{

    public int? ProjectID { get; set; }

    [Required]
    public int ProjectAreaID { get; set; }


    [StringLength(255)]
    [Required]
    public string? Title { get; set; }

    [StringLength(10)]
    public string? Abbreviation { get; set; }
    
    public decimal Percentage { get; set; }
    
    public decimal Amount { get; set; }

    public virtual ICollection<ProjectAreaStageDeliveryDto> Deliveries { get; set; } = new List<ProjectAreaStageDeliveryDto>();

    public int? ProjectStageID { get; set; }
}
public class ProjectAreaStageDtoMapperProfile : Profile
{
    public ProjectAreaStageDtoMapperProfile()
    {

        CreateMap<ProjectAreaStage, ProjectAreaStageDto>()
            .ReverseMap()
              .ForMember(dest => dest.ProjectArea, opt => opt.Ignore())
             .ForMember(dest => dest.Deliveries, opt => opt.Ignore());

    }
}