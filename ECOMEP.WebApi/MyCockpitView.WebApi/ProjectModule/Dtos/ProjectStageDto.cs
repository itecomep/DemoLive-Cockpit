using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ProjectModule.Dtos;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectStageDto : BaseEntityDto
{
    [Required]
    public int ProjectID { get; set; }


    [StringLength(255)]
    [Required]
    public string? Title { get; set; }

    [StringLength(10)]
    public string? Abbreviation { get; set; }
    
    public decimal Percentage { get; set; }
    
    public decimal Amount { get; set; }
    public bool IsLumpsum { get; set; }

    public int Revisions { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? BillingDate { get; set; }
    public DateTime? PaymentReceivedDate { get; set; }
    public int? ParentID { get; set; }
    public virtual ICollection<ProjectStageDeliveryDto> Deliveries { get; set; } = new List<ProjectStageDeliveryDto>();
}
public class ProjectStageDtoMapperProfile : Profile
{
    public ProjectStageDtoMapperProfile()
    {

        CreateMap<ProjectStage, ProjectStageDto>()
            .ReverseMap()
            .ForMember(dest => dest.Children, opt => opt.Ignore())
           .ForMember(dest => dest.Parent, opt => opt.Ignore())
   .ForMember(dest => dest.Project, opt => opt.Ignore())
              .ForMember(dest => dest.Project, opt => opt.Ignore())
             .ForMember(dest => dest.Deliveries, opt => opt.Ignore());

    }
}
