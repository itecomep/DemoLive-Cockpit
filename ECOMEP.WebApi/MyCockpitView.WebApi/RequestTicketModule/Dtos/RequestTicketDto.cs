
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using MyCockpitView.CoreModule;
using AutoMapper;
using MyCockpitView.WebApi.RequestTicketModule.Entities;
using MyCockpitView.WebApi.ContactModule.Dtos;
using Microsoft.EntityFrameworkCore;

namespace MyCockpitView.WebApi.RequestTicketModule.Dtos;

public class RequestTicketDto : BaseEntityDto
{
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Purpose { get; set; }
    public string? Authority { get; set; }
    public string? Code { get; set; }
    public string? StageTitle { get; set; }
    public int? StageID { get; set; }
    [Precision(18, 2)] public decimal Revision { get; set; } = 0;


    public DateTime NextReminderDate { get; set; }
    public int AssignerContactID { get; set; }
    public virtual ContactListDto? AssignerContact { get; set; }
    public string? RequestMessage { get; set; }
    public string? ResolutionMessage { get; set; }
    public decimal ReminderInterval { get; set; }
    public int RepeatCount { get; set; }

    public bool IsRepeatRequired { get; set; }

    public string? Entity { get; set; }
    public int? EntityID { get; set; }
   
    public string? EntityTitle { get; set; }
    public int? ProjectID { get; set; }
    public bool IsReadOnly { get; set; }
    public int? ParentID { get; set; }
    public bool IsDraft {  get; set; }
    public virtual ICollection<RequestTicketAssigneeDto> Assignees { get; set; } = new List<RequestTicketAssigneeDto>();
    public virtual ICollection<RequestTicketAttachmentDto> Attachments { get; set; } = new List<RequestTicketAttachmentDto>();
}


public class RequestTicketDtoMapperProfile : Profile
{
    public RequestTicketDtoMapperProfile()
    {
        CreateMap<RequestTicket, RequestTicketDto>()
            .ForMember(dest => dest.Assignees, opt => opt.MapFrom(src => src.Assignees.Where(x => !x.IsDeleted)))
            .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Where(x => !x.IsDeleted)))
     .ReverseMap()
         .ForMember(dest => dest.AssignerContact, opt => opt.Ignore())
          .ForMember(dest => dest.Assignees, opt => opt.Ignore())
         .ForMember(dest => dest.Attachments, opt => opt.Ignore());

    }
}