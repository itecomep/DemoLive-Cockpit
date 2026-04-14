using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using AutoMapper;


namespace MyCockpitView.WebApi.Entities;

public class ContactWorkOrderPaymentDto : BaseEntityDto
{

    public string? Mode { get; set; }

    public decimal Amount { get; set; } = 0.0m;
    public decimal TDSAmount { get; set; } = 0.0m;

    public bool IsTDSPaid { get; set; }
    public decimal TDSShare { get; set; } = 0.0m;

    public decimal NetAmount { get; set; } = 0.0m;
    public decimal AdjustmentAmount { get; set; } = 0.0m;
    public decimal ExchangeRate { get; set; } = 0.0m;
    public string? Currency { get; set; } = "INR";
    public string? Comment { get; set; }


    public string? TransactionNo { get; set; }


    public DateTime? TransactionDate { get; set; }

    public string? BankDetail { get; set; }

    public string? RefUrl { get; set; }

    public string? RefGuid { get; set; }

    [Required]
    public int ContactWorkOrderID { get; set; }
    public virtual ICollection<ContactWorkOrderPaymentAttachmentDto> Attachments { get; set; } = new HashSet<ContactWorkOrderPaymentAttachmentDto>();

}
public class ContactWorkOrderPaymentDtoMapperProfile : Profile
{
    public ContactWorkOrderPaymentDtoMapperProfile()
    {

        CreateMap<ContactWorkOrderPayment, ContactWorkOrderPaymentDto>()
        .ReverseMap()
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());
    }
}