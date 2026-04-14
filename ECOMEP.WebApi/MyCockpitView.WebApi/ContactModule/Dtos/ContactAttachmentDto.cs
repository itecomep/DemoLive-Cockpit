using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
namespace MyCockpitView.WebApi.ContactModule.Dtos;

public class ContactAttachmentDto : BaseBlobEntityDto
{
    public int ContactID { get; set; }

    public string? Title { get; set; }

}

public class ContactAttachmentDtoMapperProfile : Profile
{
    public ContactAttachmentDtoMapperProfile()
    {
        CreateMap<ContactAttachment, ContactAttachmentDto>()
                 .ReverseMap()
                .ForMember(dest => dest.Contact, opt => opt.Ignore());
    }
}