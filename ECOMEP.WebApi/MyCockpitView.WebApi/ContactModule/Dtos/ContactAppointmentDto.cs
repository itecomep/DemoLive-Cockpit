using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.ContactModule.Dtos
{
    public class ContactAppointmentDto : BaseEntityDto
    {
        public string? Designation { get; set; }
        public Company? Company { get; set; }
        public string? Status { get; set; }
        public string? Code { get; set; }
        public string? EmployeeCode { get; set; }
        public string? Location { get; set; }
        public decimal ExpectedVhr { get; set; }
        public decimal ExpectedRemuneration { get; set; }
        public DateTime JoiningDate { get; set; }
        public DateTime? ResignationDate { get; set; }
        public decimal ManValue { get; set; }
        public int ContactID { get; set; }
        public int CompanyID { get; set; }
        public int? ManagerContactID { get; set; }
        public virtual ICollection<ContactAppointmentAttachmentDto> Attachments { get; set; } = new HashSet<ContactAppointmentAttachmentDto>();
        public ContactDto? ManagerContact  { get; set; }
    }

    public class AppointmentMapperProfile : Profile
    {
        public AppointmentMapperProfile()
        {

            CreateMap<ContactAppointment, ContactAppointmentDto>()
             .ReverseMap()
             .ForMember(dest => dest.Contact, opt => opt.Ignore())
             .ForMember(dest => dest.ManagerContact, opt => opt.Ignore())
                          .ForMember(dest => dest.Attachments, opt => opt.Ignore())
              .ForMember(dest => dest.Company, opt => opt.Ignore());

            CreateMap<ContactAppointment, ContactAppointmentDto>();

        }
    }
}
