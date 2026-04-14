using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.AssetModule.Entities;

public class Asset : BaseEntity
{
    [StringLength(255)]
    public string Title { get; set; }

    [StringLength(255)]
    public string Subtitle { get; set; }

    [StringLength(255)]
    public string Code { get; set; }

    public int CodeFlag { get; set; }

    public decimal Cost { get; set; }

    public int Quantity { get; set; }

    public DateTime? PurchaseDate { get; set; }

    public DateTime? WarrantyDate { get; set; }

    public DateTime? ValidityDate { get; set; }

    [StringLength(255)]
    public string Category { get; set; }
    public virtual ICollection<AssetAttachment> Attachments { get; set; } = new List<AssetAttachment>();
    public virtual ICollection<AssetAttribute> Attributes { get; set; } = new List<AssetAttribute>();
    public virtual ICollection<AssetVendor> Vendors { get; set; } = new List<AssetVendor>();
    public virtual ICollection<AssetLink> PrimaryAssets { get; set; } = new List<AssetLink>();
    public virtual ICollection<AssetLink> SecondaryAssets { get; set; } = new List<AssetLink>();
    public virtual ICollection<AssetSchedule> Schedules { get; set; } = new List<AssetSchedule>();
}
public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
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
        builder.HasIndex(e => e.Subtitle);
        builder.HasIndex(e => e.Code);
        builder.HasIndex(e => e.CodeFlag);
        builder.HasIndex(e => e.Cost);
        builder.HasIndex(e => e.Quantity);
        builder.HasIndex(e => e.PurchaseDate);
        builder.HasIndex(e => e.WarrantyDate);
        builder.HasIndex(e => e.ValidityDate);
        builder.HasIndex(e => e.Category);
    }
}

