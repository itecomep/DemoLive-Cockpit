using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.ContactModule.Dtos;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetScheduleDto : BaseEntityDto
{
    public int AssetID { get; set; }
    //public virtual AssetDto? Asset { get; set; }
    public string Category { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? ContactID { get; set; }
    public ContactDto? Contact { get; set; }
    [StringLength(255)]
    public string Title { get; set; }
    public bool IsRepeat { get; set; }
    [StringLength(20)]
    public string? CronExpression { get; set; }
    public decimal Cost { get; set; }
    public DateTime? NextScheduleDate { get; set; }
    public int? ExpenseID { get; set; }
    public string? Description { get; set; }
    public string? ResolutionMessage { get; set; }
    public virtual ICollection<AssetScheduleAttachmentDto> Attachments { get; set; }

    public virtual ICollection<AssetScheduleComponentDto> Components { get; set; } = new List<AssetScheduleComponentDto>();
}

public class AssetScheduleDtoMapperProfile : Profile
{
    public AssetScheduleDtoMapperProfile()
    {
        CreateMap<AssetSchedule, AssetScheduleDto>()
          .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Where(x => !x.IsDeleted)))
          .ReverseMap()
          .ForMember(dest => dest.Contact, opt => opt.Ignore())
          .ForMember(dest => dest.Attachments, opt => opt.Ignore())
          .ForMember(dest => dest.Asset, opt => opt.Ignore());
    }
}
