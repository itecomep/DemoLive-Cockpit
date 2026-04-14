using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ProjectModule.Dtos
{
    public class ProjectStageMasterDto : BaseEntityDto
    {
        [Required]
        [StringLength(255)]
        public string? Title { get; set; }

        public decimal Percentage { get; set; } = 0;
        public virtual ICollection<ProjectStageMasterDeliveryDto> Deliveries { get; set; } = new List<ProjectStageMasterDeliveryDto>();
    }

    public class ProjectStageMasterDtoMapperProfile : Profile
    {
        public ProjectStageMasterDtoMapperProfile()
        {

            CreateMap<ProjectStageMaster, ProjectStageMasterDto>()
                .ReverseMap();
                  

        }
    }
}
