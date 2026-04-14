using MyCockpitView.CoreModule;
using AutoMapper;


namespace MyCockpitView.WebApi.Entities;

public class ContactWorkOrderPaymentAttachmentDto : BaseBlobEntityDto
{
    public int ContactWorkOrderPaymentID { get; set; }
}

public class ContactWorkOrderPaymentAttachmentDtoMapperProfile : Profile
{
    public ContactWorkOrderPaymentAttachmentDtoMapperProfile()
    {

        CreateMap<ContactWorkOrderPaymentAttachment, ContactWorkOrderPaymentAttachmentDto>()
        .ReverseMap();
    }
}