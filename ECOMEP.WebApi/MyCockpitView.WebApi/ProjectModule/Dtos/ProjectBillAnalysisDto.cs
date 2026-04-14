using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace MyCockpitView.WebApi.Entities;

public class ProjectBillAnalysisDto 
{
    public int TypeFlag { get; set; }
    public int ID { get; set; }
    public int ProjectID { get; set; }
    public string? ProjectCode { get; set; }
    public string? ProjectTitle { get; set; }
    public string? ProjectLocation { get; set; }
    public string? Team { get; set; }
    public int? ProjectWorkOrderID { get; set; }
    public DateTime? WorkOrderDate { get; set; }
    public string? WorkOrderNo { get; set; }
    public int? CompanyID { get; set; }
    public int? ClientContactID { get; set; }

    [StringLength(255)]
    public string? ProformaInvoiceNo { get; set; }

    [StringLength(255)]
    public string? TaxInvoiceNo { get; set; }

    [StringLength(255)]
    public string? SequenceNo { get; set; }
    public bool IsIGSTApplicable { get; set; }
    public bool IsLumpSump { get; set; }

    [Precision(18, 2)] public decimal ProjectFee { get; set; } = 0.0m;
    [Precision(18, 2)] public decimal BillPercentage { get; set; } = 0.0m;


    [Precision(18, 2)] public decimal WorkPercentage { get; set; } = 0.0m;


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
    //public string? ReverseTaxCharges { get; set; }
    //public string? AmountInWords { get; set; }

    //[StringLength(255)]
    //public string? HSN { get; set; }

    [Required]
    [StringLength(255)]
    public string? ClientName { get; set; }

    //public string? ClientAddress { get; set; }

    //[Required]
    //[StringLength(255)]
    //public string? ClientGSTIN { get; set; }

    //[StringLength(255)]
    //public string? ClientPAN { get; set; }
    //[StringLength(255)]
    //public string? ClientTAN { get; set; }

    //[Required]
    //[StringLength(255)]
    //public string? ClientGSTStateCode { get; set; }


    [Required]
    [StringLength(255)]
    public string? CompanyName { get; set; }

    //public string? CompanyAddress { get; set; }

    //[Required]
    //[StringLength(255)]
    //public string? CompanyGSTIN { get; set; }
    //[StringLength(255)]
    //public string? CompanyPAN { get; set; }
    //[StringLength(255)]
    //public string? CompanyTAN { get; set; }
    //[StringLength(255)]
    //public string? CompanyUDHYAM { get; set; }
    //[Required]
    //[StringLength(255)]
    //public string? CompanyGSTStateCode { get; set; }
    //public string? CompanyLogoUrl { get; set; }
    //[StringLength(255)]
    //public string? CompanyBank { get; set; }
    //public string? CompanyBankBranch { get; set; }
    //[StringLength(255)]
    //public string? CompanyBankIFSCCode { get; set; }
    //[StringLength(255)]
    //public string? CompanySwiftCode { get; set; }
    //[StringLength(255)]
    //public string? CompanyBankAccount { get; set; }
    //public string? CompanySignStampUrl { get; set; }
    public string? ProformaInvoiceUrl { get; set; }
    public string? TaxInvoiceUrl { get; set; }

    public List<BillStage> Stages { get; set; } = new List<BillStage>();
    public virtual ICollection<ProjectBillPaymentDto> Payments { get; set; } = new HashSet<ProjectBillPaymentDto>();

    public decimal TDSAmount { get {
            return Payments.Any() ? Payments.Sum(x => x.TDSAmount) : 0;
        } }
    public decimal ReceivedPayment
    {
        get
        {
            return Payments.Any() ? Payments.Sum(x => x.Amount) : 0;
        }
    }
    public decimal PendingPayment
    {
        get
        {
            return PayableAmount - ReceivedPayment;
        }
    }
}

public class ProjectBillAnalysisDtoMapperProfile : Profile
{
    public ProjectBillAnalysisDtoMapperProfile()
    {

        CreateMap<ProjectBill, ProjectBillAnalysisDto>();
    }
}