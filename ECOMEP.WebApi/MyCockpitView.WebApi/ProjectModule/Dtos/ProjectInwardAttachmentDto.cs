using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectInwardAttachmentDto : BaseBlobEntityDto
{

    public int ProjectInwardID { get; set; }
}
public class ProjectInwardAttachmentDtoMapperProfile : Profile
{
    public ProjectInwardAttachmentDtoMapperProfile()
    {

        CreateMap<ProjectInwardAttachment, ProjectInwardAttachmentDto>()
        .ReverseMap();
    }
}