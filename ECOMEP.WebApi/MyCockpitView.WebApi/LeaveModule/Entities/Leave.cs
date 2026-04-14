using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.LeaveModule.Entities;
public class Leave : BaseEntity
{
    [Required]
    public int ContactID { get; set; }

    [Required]
    public DateTime Start { get; set; }

    [Required]
    public DateTime End { get; set; }
    public bool AllDay { get; set; }
    public decimal Total { get; set; }

    [Required]
    public string Reason { get; set; }
    public Contact Contact { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<LeaveAttachment> Attachments { get; set; } = new List<LeaveAttachment>();
}

public class LeaveConfiguration : IEntityTypeConfiguration<Leave>
{
    public void Configure(EntityTypeBuilder<Leave> builder)
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
            .HasDefaultValueSql("NEWID()");

        builder.Property(e => e.Created);

        builder.Property(e => e.Modified);

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