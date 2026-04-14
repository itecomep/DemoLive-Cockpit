using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace MyCockpitView.WebApi.Entities;

public class ContactWorkOrderPayment : BaseEntity
{

    public string? Mode { get; set; }

    [Precision(18, 2)]
    public decimal Amount { get; set; } = 0.0m;

    [Precision(18, 2)]
    public decimal TDSAmount { get; set; } = 0.0m;

    public bool IsTDSPaid { get; set; }
    [Precision(18, 2)]
    public decimal TDSShare { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal NetAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
    public decimal AdjustmentAmount { get; set; } = 0.0m;
    [Precision(18, 2)]
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

    public virtual ContactWorkOrder? ContactWorkOrder { get; set; }

    public virtual ICollection<ContactWorkOrderPaymentAttachment> Attachments { get; set; } = new HashSet<ContactWorkOrderPaymentAttachment>();

}

public class ContactWorkOrderPaymentConfiguration : IEntityTypeConfiguration<ContactWorkOrderPayment>
{
    public void Configure(EntityTypeBuilder<ContactWorkOrderPayment> builder)
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
    }
}