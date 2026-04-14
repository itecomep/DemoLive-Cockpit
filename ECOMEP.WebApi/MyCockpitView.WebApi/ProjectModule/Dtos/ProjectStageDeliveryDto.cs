using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ProjectModule.Dtos
{
    public class ProjectStageDeliveryDto : BaseEntityDto
    {
        [Required]
        [StringLength(255)]
        public string? Title { get; set; }
        [StringLength(10)]
        public string? Abbreviation { get; set; }
        
        public decimal Percentage { get; set; } = 0.0m;
        
        public decimal Amount { get; set; } = 0.0m;
        public int ProjectStageID { get; set; }
    }

    public class ProjectStageDeliveryDtoMapperProfile : Profile
    {
        public ProjectStageDeliveryDtoMapperProfile()
        {

            CreateMap<ProjectStageDelivery, ProjectStageDeliveryDto>()
                .ReverseMap()
                  .ForMember(dest => dest.ProjectStage, opt => opt.Ignore());

        }
    }
}
