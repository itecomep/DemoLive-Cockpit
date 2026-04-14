using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AssetModule.Entities;

namespace MyCockpitView.WebApi.AssetModule.Dtos;

public class AssetDto : BaseEntityDto
{
    public string Title { get; set; }
    public string Subtitle { get; set; }
    public string Code { get; set; }
    public decimal Cost { get; set; }
    public int Quantity { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public DateTime? WarrantyDate { get; set; }
    public DateTime? ValidityDate { get; set; }

    public bool IsWarrantyExpired
    {
        get { return this.WarrantyDate != null && this.WarrantyDate < DateTime.UtcNow; }
    }
    public bool IsValidityExpired
    {
        get { return this.ValidityDate != null && this.ValidityDate < DateTime.UtcNow; }
    }

    public int AvailableQuantity
    {
        get
        {
            return this.PrimaryAssets.Any() ? Quantity - PrimaryAssets.Count : 0;
        }
    }

    public int CodeFlag { get; set; }

    public virtual ICollection<AssetAttributeDto> Attributes { get; set; }
    public virtual ICollection<AssetAttachmentDto> Attachments { get; set; }
    public string Category { get; set; }
    public virtual ICollection<AssetVendorDto> Vendors { get; set; }
    public virtual ICollection<AssetLinkDto> PrimaryAssets { get; set; } = new List<AssetLinkDto>();
    public virtual ICollection<AssetLinkDto> SecondaryAssets { get; set; } = new List<AssetLinkDto>();
    public virtual ICollection<AssetScheduleDto> Schedules { get; set; } = new List<AssetScheduleDto>();
}

public class AssetDtoMapperProfile : Profile
{
    public AssetDtoMapperProfile()
    {
        CreateMap<Asset, AssetDto>()
              .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Attributes.Where(x => !x.IsDeleted)))
             .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Where(x => !x.IsDeleted)))
              .ForMember(dest => dest.Vendors, opt => opt.MapFrom(src => src.Vendors.Where(x => !x.IsDeleted)))
               .ForMember(dest => dest.Schedules, opt => opt.MapFrom(src => src.Schedules.Where(x => !x.IsDeleted)))
               .ForMember(dest => dest.SecondaryAssets, opt => opt.MapFrom(src => src.SecondaryAssets.Where(x => !x.IsDeleted)))
            .ReverseMap()
             .ForMember(dest => dest.Vendors, opt => opt.Ignore())
            .ForMember(dest => dest.PrimaryAssets, opt => opt.Ignore())
             .ForMember(dest => dest.SecondaryAssets, opt => opt.Ignore())
             .ForMember(dest => dest.Schedules, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());
            
    }
}
