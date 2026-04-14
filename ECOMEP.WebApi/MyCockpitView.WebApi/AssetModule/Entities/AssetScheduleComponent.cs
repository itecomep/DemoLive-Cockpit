using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.AssetModule.Entities;

public class AssetScheduleComponent : BaseEntity
{
    [Required]
    [StringLength(255)]
    public string Component { get; set; }
    public DateTime? WarrantyDate { get; set; }
    public decimal Cost { get; set; }
    public int ScheduleID { get; set; }
    public virtual AssetSchedule? Schedule { get; set; }
}
public class AssetScheduleComponentConfiguration : IEntityTypeConfiguration<AssetScheduleComponent>
{
    public void Configure(EntityTypeBuilder<AssetScheduleComponent> builder)
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
        builder.HasIndex(e => e.WarrantyDate);
    }
}

