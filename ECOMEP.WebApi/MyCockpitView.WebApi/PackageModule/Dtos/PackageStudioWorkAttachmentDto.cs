using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.PackageModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.PackageModule.Dtos;

public class PackageStudioWorkAttachmentDto : BaseBlobEntityDto
{
    public int PackageStudioWorkID { get; set; }
    [StringLength(255)]
    public string? Title { get; set; }
}

public class PackageStudioWorkAttachmentDtoMapperProfile : Profile
{
    public PackageStudioWorkAttachmentDtoMapperProfile()
    {

        CreateMap<PackageStudioWorkAttachment, PackageStudioWorkAttachmentDto>()
        .ReverseMap();
    }
}

