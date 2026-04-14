using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using AutoMapper;


namespace MyCockpitView.WebApi.Entities;

public class ContactWorkOrderAttachmentDto : BaseBlobEntity
{
    [Required]
    public int ContactWorkOrderID { get; set; }
}

public class ContactWorkOrderAttachmentDtoMapperProfile : Profile
{
    public ContactWorkOrderAttachmentDtoMapperProfile()
    {

        CreateMap<ContactWorkOrderAttachment, ContactWorkOrderAttachmentDto>()
        .ReverseMap();
    }
}