using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.RequestTicketModule.Entities;

namespace MyCockpitView.WebApi.RequestTicketModule.Dtos;

public class RequestTicketAttachmentDto : BaseBlobEntityDto
{
    [Required]
    public int RequestTicketID { get; set; }
}

public class RequestTicketAttachmentDtoMapperProfile : Profile
{
    public RequestTicketAttachmentDtoMapperProfile()
    {
        CreateMap<RequestTicketAttachment, RequestTicketAttachmentDto>()
     .ReverseMap();

    }
}