using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectAreaDto : BaseEntityDto
{
    public int ProjectID { get; set; }

    [StringLength(255)]
    [Required]
    public string? Title { get; set; }
    
    public decimal Area { get; set; } = 0.0m;

    public string? Unit { get; set; } = "unit";

    public int? ParentID { get; set; }
    public virtual ICollection<ProjectAreaDto> Children { get; set; } = new List<ProjectAreaDto>();

    
    public decimal Percentage { get; set; }
    
    public decimal Amount { get; set; }
    
    

    public virtual ICollection<ProjectAreaStageDto> Stages { get; set; } = new List<ProjectAreaStageDto>();
}
public class ProjectAreaDtoMapperProfile : Profile
{
    public ProjectAreaDtoMapperProfile()
    {

        CreateMap<ProjectArea, ProjectAreaDto>()
            .ReverseMap()
                          .ForMember(dest => dest.Project, opt => opt.Ignore())
                              .ForMember(dest => dest.Children, opt => opt.Ignore())
                                  .ForMember(dest => dest.Parent, opt => opt.Ignore())
              .ForMember(dest => dest.Stages, opt => opt.Ignore());

    }
}