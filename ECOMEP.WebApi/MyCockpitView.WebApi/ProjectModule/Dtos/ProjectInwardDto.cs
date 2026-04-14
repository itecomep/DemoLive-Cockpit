
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectInwardDto : BaseEntityDto
{
    
    [StringLength(255)]
    public string? Title { get; set; }
    [StringLength(255)]
    public string? Category { get; set; }
    public string? Message { get; set; }

    
    public DateTime? ReceivedDate { get; set; }

    
    public int ProjectID { get; set; }
    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }
    public virtual ICollection<ProjectInwardAttachmentDto> Attachments { get; set; } = new HashSet<ProjectInwardAttachmentDto>();

}
public class ProjectInwardDtoMapperProfile : Profile
{
    public ProjectInwardDtoMapperProfile()
    {


        CreateMap<ProjectInward, ProjectInwardDto>()
       .ReverseMap()
       .ForMember(dest => dest.Contact, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore())
    .ForMember(dest => dest.Project, opt => opt.Ignore());

    }
}