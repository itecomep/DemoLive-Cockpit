using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.ContactModule.Dtos
{
    public class ContactAppointmentAttachmentDto : BaseBlobEntityDto
    {
        public int ContactAppointmentID { get; set; }
        public string? Title { get; set; }
    }

    public class ContactAppointmentAttachmentDtoMapperProfile : Profile
    {
        public ContactAppointmentAttachmentDtoMapperProfile()
        {
            CreateMap<ContactAppointmentAttachment, ContactAppointmentAttachmentDto>()
                     .ReverseMap()
                    .ForMember(dest => dest.ContactAppointment, opt => opt.Ignore());
        }
    }
}
