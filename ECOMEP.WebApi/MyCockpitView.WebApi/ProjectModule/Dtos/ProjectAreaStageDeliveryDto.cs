using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ProjectModule.Dtos
{
    public class ProjectAreaStageDeliveryDto : BaseEntityDto
    {
        [Required]
        [StringLength(255)]
        public string? Title { get; set; }
        [StringLength(10)]
        public string? Abbreviation { get; set; }
        
        public decimal Percentage { get; set; } = 0.0m;
        
        public decimal Amount { get; set; } = 0.0m;
        public int ProjectAreaStageID { get; set; }
        public int? ProjectID { get; set; }
        public int? ProjectStageID { get; set; }
        public int? ProjectStageDeliveryID { get; set; }
    }

    public class ProjectAreaStageDeliveryDtoMapperProfile : Profile
    {
        public ProjectAreaStageDeliveryDtoMapperProfile()
        {

            CreateMap<ProjectAreaStageDelivery, ProjectAreaStageDeliveryDto>()
                .ReverseMap()
                  .ForMember(dest => dest.ProjectAreaStage, opt => opt.Ignore());

        }
    }
}
