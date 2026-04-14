using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ImageLibraryModule.Entities;

namespace MyCockpitView.WebApi.ImageLibraryModule.Dtos;

public class ImageLibraryEntityDto : BaseBlobEntityDto
{
    public string? Category { get; set; }
}
public class ImageLibraryEntityDtoMapperProfile : Profile
{
    public ImageLibraryEntityDtoMapperProfile()
    {

        CreateMap<ImageLibraryEntity, ImageLibraryEntityDto>()
        .ReverseMap();
    }
}