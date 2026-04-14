using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.MeetingModule.Entities;

public class MeetingVoucher : BaseEntity
{
    [Required]
    public int MeetingID { get; set; }

    public virtual Meeting? Meeting { get; set; }

    [Precision(14, 2)]
    public decimal ExpenseAmount { get; set; } = 0;

    [Required]
    [StringLength(255)]
    public string? ExpenseHead { get; set; }

    [Required]
    [StringLength(255)]
    public string? Particulars { get; set; }
    public virtual ICollection<MeetingVoucherAttachment> Attachments { get; set; } = new List<MeetingVoucherAttachment>();
}


public class MeetingVoucherConfiguration : IEntityTypeConfiguration<MeetingVoucher>
{
    public void Configure(EntityTypeBuilder<MeetingVoucher> builder)
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
        builder.HasIndex(e => e.ExpenseAmount);
        builder.HasIndex(e => e.Particulars);
        builder.HasIndex(e => e.ExpenseHead);
    }
}