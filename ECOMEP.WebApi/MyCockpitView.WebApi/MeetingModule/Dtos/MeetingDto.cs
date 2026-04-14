using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.MeetingModule.Entities;

namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class MeetingDto : BaseEntityDto
{
    public bool IsReadOnly { get; set; }
    public int? ParentID { get; set; }
    public string? Title { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Code { get; set; }
    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }
    public decimal Version { get; set; }
    public DateTime? ClosedOn { get; set; }
    public DateTime? FinalizedOn { get; set; }
    public bool IsEditable { get; set; }
    public bool IsDelayed { get; set; }
    public int? ProjectID { get; set; }
    public int? EntityID { get; set; }
    public string? Entity { get; set; }
    public string? EntityTitle { get; set; }
    public string? Location { get; set; }
    public bool? IsFollowUp { get; set; }
    public string? FollowUpRemark { get; set; }
    public bool IsSent { get; set; }
    public string? Purpose { get; set; }
    public string? Remark { get; set; }

    public virtual ICollection<MeetingAttachmentDto> Attachments { get; set; } = new List<MeetingAttachmentDto>();
    public virtual ICollection<MeetingAttendeeDto> Attendees { get; set; }= new HashSet<MeetingAttendeeDto>();
    public virtual ICollection<MeetingAgendaDto> Agendas { get; set; } = new HashSet<MeetingAgendaDto>();
    public virtual ICollection<MeetingVoucherDto> Vouchers { get; set; } = new HashSet<MeetingVoucherDto>();
    public virtual List<MeetingGmap> Gmaps { get; set; } = new List<MeetingGmap>();
    public virtual List<MeetingDocumentCarried> DocumentsCarried { get; set; } = new List<MeetingDocumentCarried>();
    public int Annexure { get; set; }


}

public class MeetingDtoMapperProfile : Profile
{
    public MeetingDtoMapperProfile()
    {
        CreateMap<Meeting, MeetingDto>()
            .ForMember(dest => dest.Agendas, opt => opt.MapFrom(src => src.Agendas.Where(x => !x.IsDeleted)))
            .ForMember(dest => dest.Attendees, opt => opt.MapFrom(src => src.Attendees.Where(x => !x.IsDeleted)))
     .ReverseMap()
        .ForMember(dest => dest.Attachments, opt => opt.Ignore())
        .ForMember(dest => dest.Vouchers, opt => opt.Ignore())
         .ForMember(dest => dest.Agendas, opt => opt.Ignore())
         .ForMember(dest => dest.Attendees, opt => opt.Ignore())
          .ForMember(dest => dest.Contact, opt => opt.Ignore());

    }
}

