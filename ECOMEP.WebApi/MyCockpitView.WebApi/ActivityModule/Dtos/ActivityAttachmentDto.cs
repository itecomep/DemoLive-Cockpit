
using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ActivityModule.Entities;

namespace MyCockpitView.WebApi.ActivityModule.Dtos;

public class ActivityAttachmentDto : BaseBlobEntityDto
{

    public int ActivityID { get; set; }

}

public class ActivityAttachmentDtoMapperProfile : Profile
{
    public ActivityAttachmentDtoMapperProfile()
    {

        CreateMap<ActivityAttachment, ActivityAttachmentDto>()
             .ReverseMap();

    }
}