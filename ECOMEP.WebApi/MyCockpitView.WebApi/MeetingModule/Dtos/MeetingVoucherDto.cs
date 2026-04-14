using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.MeetingModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class MeetingVoucherDto : BaseBlobEntityDto
{
    public int MeetingID { get; set; }

    [Precision(14, 2)]
    public decimal ExpenseAmount { get; set; } = 0;

    [Required]
    [StringLength(255)]
    public string? ExpenseHead { get; set; }

    [Required]
    [StringLength(255)]
    public string? Particulars { get; set; }
    public virtual ICollection<MeetingVoucherAttachmentDto> Attachments { get; set; } = new List<MeetingVoucherAttachmentDto>();
}

public class MeetingVoucherDtoMapperProfile : Profile
{
    public MeetingVoucherDtoMapperProfile()
    {
        CreateMap<MeetingVoucher, MeetingVoucherDto>()
             .ReverseMap()
             .ForMember(dest => dest.Attachments, opt => opt.Ignore())
             .ForMember(dest => dest.Meeting, opt => opt.Ignore());
    }
}

