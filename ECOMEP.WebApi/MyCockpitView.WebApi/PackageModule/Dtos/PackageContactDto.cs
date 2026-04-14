using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.PackageModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.PackageModule.Dtos;

public class PackageContactDto : BaseEntityDto
{
    public string? Title { get; set; }
    public int PackageID { get; set; }
    public int ContactID { get; set; }

    [Required]
    [StringLength(255)]
    public string? Name { get; set; }

    [StringLength(255)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? Company { get; set; }
}


public class PackageAssociationDtoMapperProfile : Profile
{
    public PackageAssociationDtoMapperProfile()
    {
        CreateMap<PackageContact, PackageContactDto>()
        .ReverseMap()
        //.ForMember(dest => dest.Contact, opt => opt.Ignore())
     .ForMember(dest => dest.Package, opt => opt.Ignore());

    }
}