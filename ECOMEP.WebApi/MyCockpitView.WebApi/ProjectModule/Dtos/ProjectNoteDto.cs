
using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectNoteDto : BaseEntityDto
{

    public string? Notes { get; set; }

    
    public int ProjectID { get; set; }

}

public class ProjectNoteDtoMapperProfile : Profile
{
    public ProjectNoteDtoMapperProfile()
    {


        CreateMap<ProjectNote, ProjectNoteDto>()
      .ReverseMap()
   .ForMember(dest => dest.Project, opt => opt.Ignore());
    }
}