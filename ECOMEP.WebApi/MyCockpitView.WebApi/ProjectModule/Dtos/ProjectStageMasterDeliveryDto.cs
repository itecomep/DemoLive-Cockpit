using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ProjectModule.Dtos
{
    public class ProjectStageMasterDeliveryDto : BaseEntityDto
    {
        public int ProjectStageMasterID { get; set; }

        [Required]
        [StringLength(255)]
        public string? Title { get; set; }

        [StringLength(10)]
        public string? Abbrivation { get; set; }
        public decimal Percentage { get; set; } = 0;
    }

    public class ProjectStagMasterDeliveryDtoMapperProfile : Profile
    {
        public ProjectStagMasterDeliveryDtoMapperProfile()
        {

            CreateMap<ProjectStageMasterDelivery, ProjectStageMasterDeliveryDto>()
                .ReverseMap()
                  .ForMember(dest => dest.ProjectStageMaster, opt => opt.Ignore());

        }
    }
}
