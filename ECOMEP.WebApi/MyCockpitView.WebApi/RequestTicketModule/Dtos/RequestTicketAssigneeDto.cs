using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.RequestTicketModule.Entities;

namespace MyCockpitView.WebApi.RequestTicketModule.Dtos;

public class RequestTicketAssigneeDto : BaseEntityDto
{
    [Required]
    public int ContactID { get; set; }

    [Required]
    [StringLength(255)]
    public string? Name { get; set; }

    [Required]
    [StringLength(255)]
    public string? Email { get; set; }


    [StringLength(255)]
    public string? Company { get; set; }

    [Required]
    public int RequestTicketID { get; set; }

}

public class RequestTicketAssigneeDtoMapperProfile : Profile
{
    public RequestTicketAssigneeDtoMapperProfile()
    {
        CreateMap<RequestTicketAssignee, RequestTicketAssigneeDto>()
     .ReverseMap();

    }
}