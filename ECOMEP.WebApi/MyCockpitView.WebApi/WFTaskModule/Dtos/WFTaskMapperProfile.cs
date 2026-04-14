using AutoMapper;
using MyCockpitView.WebApi.WFTaskModule.Entities;

namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class WFTaskMapperProfile : Profile
{
    public WFTaskMapperProfile()
    {


        CreateMap<WFTask, WFTaskDto>()
                .ForMember(dest=>dest.ContactID,opt=>opt.MapFrom(src=>src.ContactID))
                .ForMember(dest => dest.Contact, opt => opt.MapFrom(src => src.Contact))
                .ReverseMap()
                                .ForMember(dest => dest.ContactID, opt => opt.MapFrom(src => src.ContactID))
                .ForMember(dest => dest.Contact, opt => opt.MapFrom(src => src.Contact))
                .ForMember(dest => dest.Attachments, opt => opt.Ignore())
                .ForMember(dest => dest.TimeEntries, opt => opt.Ignore())
                .ForMember(dest => dest.Assessments, opt => opt.Ignore())
                .ForMember(dest => dest.Assigner, opt => opt.Ignore())
                 .ForMember(dest => dest.Contact, opt => opt.Ignore())
                 .ForMember(dest => dest.Assigner, opt => opt.Ignore());

        CreateMap<WFTaskAttachment, WFTaskAttachmentDto>()
                    .ReverseMap()
                    .ForMember(dest => dest.WFTask, opt => opt.Ignore());


        CreateMap<TimeEntry, TimeEntryDto>()
                 .ReverseMap()
                 .ForMember(dest => dest.ManHours, opt => opt.Ignore())
                  .ForMember(dest => dest.Contact, opt => opt.Ignore());

        CreateMap<Assessment, AssessmentDto>()
                    .ReverseMap()
                    .ForMember(dest => dest.Contact, opt => opt.Ignore());
        CreateMap<WFStageAction, WFStageActionDto>()
                    .ReverseMap();

        CreateMap<WFStage, WFStageDto>()
                    .ReverseMap();
    }
}
