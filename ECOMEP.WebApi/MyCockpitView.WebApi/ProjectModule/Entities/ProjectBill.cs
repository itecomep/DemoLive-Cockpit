
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;


namespace MyCockpitView.WebApi.Entities;
public class ProjectBill : BaseEntity
    {

    public bool IsPreDated { get; set; }

    [Required]
    public int ProjectID { get; set; }
    public int WorkOrderID { get; set; }
    public virtual Project? Project { get; set; }
    public string? ProjectCode { get; set; }
    public string? ProjectTitle {  get; set; }
    public string? ProjectLocation { get; set; }
    public int? ProjectWorkOrderID { get; set; }
    public DateTime? WorkOrderDate { get; set; }
    public string? WorkOrderNo { get; set; }

    [StringLength(255)]
    public string? ProformaInvoiceNo { get; set; }

    [StringLength(255)]
    public string? TaxInvoiceNo { get; set; }

    //[StringLength(255)]
    //public string? SequenceNo { get; set; }
    public bool IsIGSTApplicable { get; set; }
    public bool IsLumpSump { get; set; }

    [Precision(18, 2)] 
    public decimal ProjectFee { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal BillPercentage { get; set; } = 0.0m;
    [Precision(18,2)] public decimal WorkPercentage { get; set; } = 0.0m;

    
    public DateTime? ProformaDate { get; set; }
    public DateTime BillDate { get; set; }

    [Precision(18,2)] 
    public decimal BillAmount { get; set; } = 0.0m;
    [Precision(18, 2)] 
    public decimal PreviousBillAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal DueAmount { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal IGSTShare { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal IGSTAmount { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal CGSTShare { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal CGSTAmount { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal SGSTShare { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal SGSTAmount { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal PayableAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal TDSAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal AmountAfterTDS { get; set; } = 0.0m;
    public string? ReverseTaxCharges { get; set; }
    public string? AmountInWords { get; set; }

    [StringLength(255)]
    public string? HSN { get; set; }
    public int? ClientContactID { get; set; }
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

    public int? CompanyID { get; set; }
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
    public string? _stages { get; set; }

    [NotMapped]
    public List<BillStage> Stages
    {
        get => !string.IsNullOrEmpty(_stages) ? JsonConvert.DeserializeObject<List<BillStage>>(_stages) : new List<BillStage>();
        set => _stages = JsonConvert.SerializeObject(value);
    }
    public virtual ICollection<ProjectBillPayment> Payments { get; set; } = new HashSet<ProjectBillPayment>();

}
public class ProjectBillConfiguration : IEntityTypeConfiguration<ProjectBill>
{
    public void Configure(EntityTypeBuilder<ProjectBill> builder)
    {
        builder.HasQueryFilter(x => !x.IsDeleted);
        builder.HasKey(e => e.ID);
        builder.Property(e => e.ID)
            .ValueGeneratedOnAdd()
            .HasColumnName("ID");

        builder.Property(e => e._searchTags)
            .HasColumnName("SearchTags");

        builder.Ignore(e => e.SearchTags);

        builder.Property(e => e.UID)
            .HasColumnName("UID")
            .HasDefaultValueSql("NEWID()")
            ;

        builder.Property(e => e.Created)
            ;

        builder.Property(e => e.Modified)
            ;

        builder.Property(e => e.CreatedBy)
            .HasMaxLength(255);

        builder.Property(e => e.ModifiedBy)
            .HasMaxLength(255);

        builder.Property(e => e.OrderFlag)
            //.HasColumnType("decimal(14,2)")
            .HasDefaultValue(0);

        builder.Property(e => e.StatusFlag)
    .HasDefaultValue(0);

        builder.Property(e => e.TypeFlag)
    .HasDefaultValue(0);

        builder.Property(e => e.IsDeleted)
.HasDefaultValue(false);

        builder.HasIndex(e => e.UID);
        builder.HasIndex(e => e.Created);
        builder.HasIndex(e => e.Modified);
        builder.HasIndex(e => e.CreatedByContactID);
        builder.HasIndex(e => e.ModifiedByContactID);
        builder.HasIndex(e => e.StatusFlag);
        builder.HasIndex(e => e.TypeFlag);
        builder.HasIndex(e => e.IsDeleted);
        builder.HasIndex(e => e.OrderFlag);

        builder.HasIndex(e => e.BillDate);
        builder.HasIndex(e => e.ProformaInvoiceNo);
        builder.HasIndex(e => e.TaxInvoiceNo);
        builder.HasIndex(e => e.BillPercentage);
        //builder.HasIndex(e => e.SequenceNo);

    }

}

public class BillStage
{
    public int ID {  get; set; }
    public string? Title { get; set; }
    public string? Abbreviation { get; set; }
    public decimal Percentage { get; set; }
    public decimal Amount { get; set; }
    public int OrderFlag { get; set; }
    public int StatusFlag { get; set; }

}