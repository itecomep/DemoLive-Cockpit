using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MyCockpitView.WebApi.Dtos;


namespace MyCockpitView.WebApi.Entities;

public class ProjectWorkOrderAttachmentDto : BaseBlobEntity
{
    [Required]
    public int ProjectWorkOrderID { get; set; }
}

public class ProjectWorkOrderAttachmentDtoMapperProfile : Profile
{
    public ProjectWorkOrderAttachmentDtoMapperProfile()
    {

        CreateMap<ProjectWorkOrderAttachment, ProjectWorkOrderAttachmentDto>()
        .ReverseMap();
    }
}