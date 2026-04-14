using AutoMapper;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.ContactModule.Dtos;

public class ContactListDto : BaseEntityDto
{
    public bool IsCompany { get; set; }
    public string? FullName { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }
    public ICollection<string>? Categories { get; set; }
    public string? PAN { get; set; }
    public string? TAN { get; set; }
    public string? GSTIN { get; set; }
    public string? GSTStateCode { get; set; }
    public string? ARN { get; set; }
    public ICollection<string>? Urls { get; set; }
    public IEnumerable<ContactAppointmentDto> Appointments { get; set; } = new List<ContactAppointmentDto>();

    public string? BankName { get; set; }
    public string? IFSCCode { get; set; }
    public string? DrivingLicenseNo { get; set; }

    public string? Username { get; set; }
}
public class ContactDto : ContactListDto
{
    public string? Title { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    public string? Website { get; set; }
    public DateTime? Birth { get; set; }
    public DateTime? Anniversary { get; set; }
    public string? PhotoFilename { get; set; }
    public virtual ICollection<ContactAttachmentDto> Attachments { get; set; } = new HashSet<ContactAttachmentDto>();
    public virtual ICollection<ContactWorkOrderDto> WorkOrders { get; set; } = new HashSet<ContactWorkOrderDto>();

    public string? Notes { get; set; }
    public string? MaritalStatus { get; set; }
    public string? FamilyContactName { get; set; }
    public string? FamilyContactRelation { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactRelation { get; set; }

    public string? UDHYAM { get; set; }
    public string? AADHAAR { get; set; }
    public string? FamilyContactPhone { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public string? BankAccountNo { get; set; }
  
    public virtual ICollection<ContactAssociationDto> AssociatedCompanies { get; set; } = new HashSet<ContactAssociationDto>();
    public virtual ICollection<ContactAssociationDto> AssociatedContacts { get; set; } = new HashSet<ContactAssociationDto>();
    public virtual List<ContactPhone> Phones { get; set; } = new List<ContactPhone>();
    public virtual List<ContactEmail> Emails { get; set; } = new List<ContactEmail>();
    public virtual List<ContactAddress> Addresses { get; set; } = new List<ContactAddress>();   
    public int? ParentID { get; set; }
    public virtual ContactListDto? Parent { get; set; }
    public virtual ICollection<ContactListDto> Children { get; set; } = new HashSet<ContactListDto>();
}

public class ContactDtoMapperProfile : Profile
{
    public ContactDtoMapperProfile()
    {
        CreateMap<Contact, ContactDto>()
            .ReverseMap()
            .ForMember(dest => dest.Children, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore())
            .ForMember(dest => dest.WorkOrders, opt => opt.Ignore())
            .ForMember(dest => dest.AssociatedContacts, opt => opt.Ignore())
            .ForMember(dest => dest.Appointments, opt => opt.Ignore())
            .ForMember(dest => dest.AssociatedCompanies, opt => opt.Ignore());

        CreateMap<Contact, ContactListDto>()
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phones.Any(c => c.IsPrimary) ? src.Phones.FirstOrDefault(c=>c.IsPrimary).Phone:null))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Emails.Any(c => c.IsPrimary) ? src.Emails.FirstOrDefault(c => c.IsPrimary).Email : null));
    }
}
