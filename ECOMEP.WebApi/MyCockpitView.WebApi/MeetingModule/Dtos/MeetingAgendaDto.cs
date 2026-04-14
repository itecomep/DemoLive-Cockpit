using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.MeetingModule.Entities;

namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class MeetingAgendaDto : BaseEntityDto
{
    public int MeetingID { get; set; }
    public bool IsReadOnly { get; set; }
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Comment { get; set; }
    public DateTime? DueDate { get; set; }
    public bool NotDiscussed { get; set; }
    public string? ActionBy { get; set; }
    public int? ActionByContactID { get; set; }
    public string? PreviousComment { get; set; }
    public string? PreviousHistory { get; set; }
    public DateTime? PreviousDueDate { get; set; }
    public string? PreviousActionBy { get; set; }
    public int? PreviousAgendaID { get; set; }
    public virtual ICollection<MeetingAgendaAttachmentDto> Attachments { get; set; }= new List<MeetingAgendaAttachmentDto>();
    public bool IsDelayed { get; set; }
    public bool IsForwarded { get; set; }
    public int? PackageID { get; set; }
    public int ReminderCount { get; set; }
    public string? UpdateFrom { get; set; }
    public int? ProjectID { get; set; }
    public int? DesignScriptEntityID { get; set; }
    public bool IsInspection { get; set; }
    public bool SendUpdate { get; set; }
    public DateTime MeetingDate { get; set; }
    public string? MeetingTitle { get; set; }
    public decimal Progress { get; set; }
    public decimal PreviousProgress { get; set; }
    public int? TodoID { get; set; }
}


public class MeetingAgendaDtoMapperProfile : Profile
{
    public MeetingAgendaDtoMapperProfile()
    {


        CreateMap<MeetingAgenda, MeetingAgendaDto>()
            
             .ForMember(dest => dest.IsDelayed, opt => opt.MapFrom(src => src.DueDate != null
                                                               && (src.DueDate.Value < DateTime.UtcNow) ? true : false))
              .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Where(x => !x.IsDeleted)))
            .ReverseMap()
            .ForMember(dest => dest.Meeting, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());

    }
}


