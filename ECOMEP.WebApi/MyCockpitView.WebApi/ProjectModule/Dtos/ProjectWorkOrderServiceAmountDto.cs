using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using AutoMapper;


namespace MyCockpitView.WebApi.Entities;

public class ProjectWorkOrderServiceAmountDto : BaseEntityDto
{
    [Required]
    public int ProjectWorkOrderID { get; set; }
    public string? Service { get; set; }
    public int Amount { get; set; }
}

public class ProjectWorkOrderServiceAmountDtoMapperProfile : Profile
{
    public ProjectWorkOrderServiceAmountDtoMapperProfile()
    {

        CreateMap<ProjectWorkOrderServiceAmount, ProjectWorkOrderServiceAmountDto>()
        .ReverseMap();
    }
}