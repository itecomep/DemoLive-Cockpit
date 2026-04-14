using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.PackageModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.PackageModule.Dtos;

public class PackageDto : BaseEntityDto
{
    [Required]
    public int ProjectID { get; set; }
    public int? ProjectStageID { get; set; }
    public int? ProjectAreaID { get; set; }
    [Required]
    [StringLength(255)]
    public string? Title { get; set; }
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime DueDate { get; set; }
    public DateTime? SubmissionDate { get; set; }
    public decimal ExpectedMHr { get; set; } = 0;
    public decimal ActualMHr { get; set; } = 0;

    public virtual ICollection<PackageAttachmentDto> Attachments { get; set; } = new List<PackageAttachmentDto>();

    public virtual ICollection<PackageContactDto> Contacts { get; set; }= new List<PackageContactDto>();
}

public class PackageDtoMapperProfile : Profile
{
    public PackageDtoMapperProfile()
    {
        CreateMap<Package, PackageDto>()
            .ReverseMap()
              .ForMember(dest => dest.Attachments, opt => opt.Ignore())
              .ForMember(dest => dest.Contacts, opt => opt.Ignore());

    }
}