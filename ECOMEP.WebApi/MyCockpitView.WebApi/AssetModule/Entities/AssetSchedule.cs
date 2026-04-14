using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AssetModule.Entities;

public class AssetSchedule : BaseEntity
{
    public int AssetID { get; set; }
    public virtual Asset? Asset { get; set; }
    public string Category { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? ContactID { get; set; }
    public Contact? Contact { get; set; }
    [StringLength(255)]
    public string Title { get; set; }
    public bool IsRepeat { get; set; }
    [StringLength(20)]
    public string? CronExpression { get; set; }

    public decimal Cost { get; set; }

    public DateTime? NextScheduleDate { get; set; }
    public int? ExpenseID { get; set; }

    public string? ResolutionMessage { get; set; }
    public string? Description { get; set; }

    public virtual ICollection<AssetScheduleComponent> Components { get; set; } = new List<AssetScheduleComponent>();

    public virtual ICollection<AssetScheduleAttachment> Attachments { get; set; } = new List<AssetScheduleAttachment>();
}
public class AssetScheduleConfiguration : IEntityTypeConfiguration<AssetSchedule>
{
    public void Configure(EntityTypeBuilder<AssetSchedule> builder)
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
        builder.HasIndex(e => e.Title);
        builder.HasIndex(e => e.StartDate);
        builder.HasIndex(e => e.EndDate);
        builder.HasIndex(e => e.ContactID);
        builder.HasIndex(e => e.IsRepeat);
        builder.HasIndex(e => e.CronExpression);
        builder.HasIndex(e => e.NextScheduleDate);
    }
}

