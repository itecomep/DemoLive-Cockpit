using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using AutoMapper;


namespace MyCockpitView.WebApi.Entities;
public class ProjectBillDto : BaseEntityDto
    {
    public bool IsPreDated { get; set; }
    [Required]
    public int ProjectID { get; set; }
    public int WorkOrderID { get; set; }
    public string? ProjectCode { get; set; }
    public string? ProjectTitle { get; set; }
    public string? ProjectLocation { get; set; }
    public int? ProjectWorkOrderID { get; set; }
    public DateTime? WorkOrderDate { get; set; }
    public string? WorkOrderNo { get; set; }
    public int? CompanyID { get; set; }
    public int? ClientContactID { get; set; }

    [StringLength(255)]
    public string? ProformaInvoiceNo { get; set; }

    [StringLength(255)]
    public string? TaxInvoiceNo { get; set; }

    //[StringLength(255)]
    //public string? SequenceNo { get; set; }
    public bool IsIGSTApplicable { get; set; }
    public bool IsLumpSump { get; set; }

    [Precision(18, 2)] public decimal ProjectFee { get; set; } = 0.0m;
    [Precision(18, 2)] public decimal BillPercentage { get; set; } = 0.0m;


    [Precision(18, 2)] public decimal WorkPercentage { get; set; } = 0.0m;

    public DateTime ProformaDate { get; set; }
    public DateTime BillDate { get; set; }
    [Precision(18, 2)]
    public decimal BillAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal PreviousBillAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal DueAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal IGSTShare { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal IGSTAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal CGSTShare { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal CGSTAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal SGSTShare { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal SGSTAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal PayableAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal TDSAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal AmountAfterTDS { get; set; } = 0.0m;
    public string? ReverseTaxCharges { get; set; }
    public string? AmountInWords { get; set; }

    [StringLength(255)]
    public string? HSN { get; set; }

    [Required]
    [StringLength(255)]
    public string? ClientName { get; set; }

    public string? ClientAddress { get; set; }

    [Required]
    [StringLength(255)]
    public string? ClientGSTIN { get; set; }

    [StringLength(255)]
    public string? ClientPAN { get; set; }
    [StringLength(255)]
    public string? ClientTAN { get; set; }

    [Required]
    [StringLength(255)]
    public string? ClientGSTStateCode { get; set; }


    [Required]
    [StringLength(255)]
    public string? CompanyName { get; set; }

    public string? CompanyAddress { get; set; }

    [Required]
    [StringLength(255)]
    public string? CompanyGSTIN { get; set; }
    [StringLength(255)]
    public string? CompanyPAN { get; set; }
    [StringLength(255)]
    public string? CompanyTAN { get; set; }
    [StringLength(255)]
    public string? CompanyUDHYAM { get; set; }
    [Required]
    [StringLength(255)]
    public string? CompanyGSTStateCode { get; set; }
    public string? CompanyLogoUrl { get; set; }
    [StringLength(255)]
    public string? CompanyBank { get; set; }
    public string? CompanyBankBranch { get; set; }
    [StringLength(255)]
    public string? CompanyBankIFSCCode { get; set; }
    [StringLength(255)]
    public string? CompanySwiftCode { get; set; }
    [StringLength(255)]
    public string? CompanyBankAccount { get; set; }
    public string? CompanySignStampUrl { get; set; }
    public string? ProformaInvoiceUrl { get; set; }
    public string? TaxInvoiceUrl { get; set; }

    public List<BillStage> Stages { get; set; }= new List<BillStage>();
    public virtual ICollection<ProjectBillPaymentDto> Payments { get; set; } = new HashSet<ProjectBillPaymentDto>();

}
public class ProjectBillDtoMapperProfile : Profile
{
    public ProjectBillDtoMapperProfile()
    {

        CreateMap<ProjectBill, ProjectBillDto>()
        .ReverseMap()
         .ForMember(dest => dest.Project, opt => opt.Ignore())
            .ForMember(dest => dest.Payments, opt => opt.Ignore());
    }
}
