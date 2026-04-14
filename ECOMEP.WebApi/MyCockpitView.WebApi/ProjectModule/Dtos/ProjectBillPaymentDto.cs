using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AutoMapper;
using MyCockpitView.WebApi.Dtos;


namespace MyCockpitView.WebApi.Entities;

public class ProjectBillPaymentDto : BaseEntityDto
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
    public int ProjectBillID { get; set; }
    public virtual ICollection<ProjectBillPaymentAttachmentDto> Attachments { get; set; } = new HashSet<ProjectBillPaymentAttachmentDto>();

}
public class ProjectBillPaymentDtoMapperProfile : Profile
{
    public ProjectBillPaymentDtoMapperProfile()
    {

        CreateMap<ProjectBillPayment, ProjectBillPaymentDto>()
        .ReverseMap()
         .ForMember(dest => dest.ProjectBill        , opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());
    }
}