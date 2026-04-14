using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.WorkOrderModule.Entities;

namespace MyCockpitView.WebApi.WorkOrderModule.Dtos;

public class WorkOrderAttachmentDto : BaseBlobEntityDto
{
    public int WorkOrderID { get; set; }
}

public class WorkOrderAttachmentDtoMapperProfile : Profile
{
    public WorkOrderAttachmentDtoMapperProfile()
    {

        CreateMap<WorkOrderAttachment, WorkOrderAttachmentDto>()
             .ReverseMap()
             .ForMember(dest => dest.WorkOrder, opt => opt.Ignore());
    }
}
