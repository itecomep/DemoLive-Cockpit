using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AssetModule.Entities;

public class AssetVendor : BaseEntity
{
    public int AssetID { get; set; }
    public virtual Asset? Asset { get; set; }
    public int? ContactID { get; set; }
    public Contact? Contact { get; set; }

    [StringLength(255)]
    public string Title { get; set; }

}
public class AssetVendorConfiguration : IEntityTypeConfiguration<AssetVendor>
{
    public void Configure(EntityTypeBuilder<AssetVendor> builder)
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
        builder.HasIndex(e => e.Title);
        builder.HasIndex(e => e.ContactID);
    }
}

