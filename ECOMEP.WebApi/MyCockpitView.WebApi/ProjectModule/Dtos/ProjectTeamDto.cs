using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectTeamDto : BaseEntityDto
{
    public int ProjectID { get; set; }
    public int ContactTeamID { get; set; }

    public virtual ContactTeamDto? ContactTeam { get; set; }
}
public class ProjectTeamDtoMapperProfile : Profile
{
    public ProjectTeamDtoMapperProfile()
    {


        CreateMap<ProjectTeam, ProjectTeamDto>()
       .ReverseMap()
       .ForMember(dest => dest.ContactTeam, opt => opt.Ignore())
    .ForMember(dest => dest.Project, opt => opt.Ignore());

    }
}