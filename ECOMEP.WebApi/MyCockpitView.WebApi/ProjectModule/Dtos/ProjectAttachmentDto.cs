using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectAttachmentDto : BaseBlobEntityDto
{

    public int ProjectID { get; set; }
    public string? Title { get; set; }
    public string? ReceivedFromContactName { get; set; }
    public int? ReceivedFromContactID { get; set; }
    public DateTime? ReceivedDate { get; set; }

}
public class ProjectAttachmentDtoMapperProfile : Profile
{
    public ProjectAttachmentDtoMapperProfile()
    {

        CreateMap<ProjectAttachment, ProjectAttachmentDto>()
        .ReverseMap();
    }
}