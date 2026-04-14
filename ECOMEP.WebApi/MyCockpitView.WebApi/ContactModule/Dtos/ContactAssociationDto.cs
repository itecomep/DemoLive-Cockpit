using AutoMapper;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ContactModule.Dtos;

public class ContactAssociationDto : BaseEntityDto
{

    public int PersonContactID { get; set; }
    public int CompanyContactID { get; set; }
    public virtual ContactListDto? Person { get; set; }
    public virtual ContactListDto? Company { get; set; }

    [StringLength(255)]
    public string? Department { get; set; }
    [StringLength(255)]
    public string? Designation { get; set; }
}


public class ContactAssociationMapperProfile : Profile
{
    public ContactAssociationMapperProfile()
    {
 
        CreateMap<ContactAssociation, ContactAssociationDto>()
            .ReverseMap()
             .ForMember(dest => dest.Person, opt => opt.Ignore())
                 .ForMember(dest => dest.Company, opt => opt.Ignore());
    }
}
