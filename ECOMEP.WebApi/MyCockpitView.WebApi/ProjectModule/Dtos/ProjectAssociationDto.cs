using AutoMapper;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectAssociationDto : BaseEntityDto
{
    public string? Title { get; set; }
    public int ProjectID { get; set; }
    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }
}

public class ProjectAssociationDtoMapperProfile : Profile
{
    public ProjectAssociationDtoMapperProfile()
    {

     

        CreateMap<ProjectAssociation, ProjectAssociationDto>()
        .ReverseMap()
        .ForMember(dest => dest.Contact, opt => opt.Ignore())
     .ForMember(dest => dest.Project, opt => opt.Ignore());

    }
}