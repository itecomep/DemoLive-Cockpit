using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.PackageModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.PackageModule.Dtos;

public class PackageAttachmentDto : BaseBlobEntityDto
{
    public int PackageID { get; set; }
    [StringLength(255)]
    public string? Title { get; set; }
}

public class PackageAttachmentDtoMapperProfile : Profile
{
    public PackageAttachmentDtoMapperProfile()
    {

        CreateMap<PackageAttachment, PackageAttachmentDto>()
        .ReverseMap();
    }
}
