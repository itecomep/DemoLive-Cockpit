using MyCockpitView.CoreModule;
using AutoMapper;


namespace MyCockpitView.WebApi.Entities;

public class ProjectBillPaymentAttachmentDto : BaseBlobEntityDto
{
    public int ProjectBillPaymentID { get; set; }
}

public class ProjectBillPaymentAttachmentDtoMapperProfile : Profile
{
    public ProjectBillPaymentAttachmentDtoMapperProfile()
    {

        CreateMap<ProjectBillPaymentAttachment, ProjectBillPaymentAttachmentDto>()
        .ReverseMap();
    }
}