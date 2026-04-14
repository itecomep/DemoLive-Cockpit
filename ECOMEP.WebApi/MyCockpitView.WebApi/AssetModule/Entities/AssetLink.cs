using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AssetModule.Entities;

public class AssetLink : BaseEntity
{
    public int PrimaryAssetID { get; set; }
    public int SecondaryAssetID { get; set; }
    public virtual Asset? PrimaryAsset { get; set; }
    public virtual Asset? SecondaryAsset { get; set; }
}
public class AssetLinkConfiguration : IEntityTypeConfiguration<AssetLink>
{
    public void Configure(EntityTypeBuilder<AssetLink> builder)
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

        builder.HasOne(al => al.PrimaryAsset)
            .WithMany(a => a.PrimaryAssets)
            .HasForeignKey(al => al.PrimaryAssetID)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(al => al.SecondaryAsset)
            .WithMany(a => a.SecondaryAssets)
            .HasForeignKey(al => al.SecondaryAssetID)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

