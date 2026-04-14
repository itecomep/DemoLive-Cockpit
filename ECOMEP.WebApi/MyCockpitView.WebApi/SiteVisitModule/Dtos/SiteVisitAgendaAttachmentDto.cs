using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.SiteVisitModule.Entities;

namespace MyCockpitView.WebApi.SiteVisitModule.Dtos;

public class SiteVisitAgendaAttachmentDto : BaseBlobEntityDto
{
    public int SiteVisitAgendaID { get; set; }
}

public class SiteVisitAgendaAttachmentDtoMapperProfile : Profile
{
    public SiteVisitAgendaAttachmentDtoMapperProfile()
    {


        CreateMap<SiteVisitAgendaAttachment, SiteVisitAgendaAttachmentDto>()
             .ReverseMap()
                      .ForMember(dest => dest.SiteVisitAgenda, opt => opt.Ignore());

    }
}
