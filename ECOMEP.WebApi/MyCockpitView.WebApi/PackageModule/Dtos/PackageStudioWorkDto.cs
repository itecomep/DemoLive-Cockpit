using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.PackageModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.PackageModule.Dtos;

public class PackageStudioWorkDto : BaseEntityDto
{

    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }

    public string? Comment { get; set; }

    public int AssigneeContactID { get; set; }

    public int? AssignerContactID { get; set; }

    public virtual Contact? Assignee { get; set; }

    public virtual Contact? Assigner { get; set; }

    public virtual ICollection<PackageStudioWorkAttachmentDto> Attachments { get; set; } = new List<PackageStudioWorkAttachmentDto>();

    
    public decimal MHrAssigned { get; set; }
    
    public decimal MHrConsumed { get; set; }
    public int PackageID { get; set; }

}

public class PackageStudioWorkDtoMapperProfile : Profile
{
    public PackageStudioWorkDtoMapperProfile()
    {

        CreateMap<PackageStudioWork, PackageStudioWorkDto>()
        .ReverseMap()
                      .ForMember(dest => dest.Attachments, opt => opt.Ignore())
              .ForMember(dest => dest.Assignee, opt => opt.Ignore())
          .ForMember(dest => dest.Assigner, opt => opt.Ignore());
    }
}
