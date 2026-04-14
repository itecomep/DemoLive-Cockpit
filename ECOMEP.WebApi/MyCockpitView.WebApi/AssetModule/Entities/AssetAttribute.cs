using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace MyCockpitView.WebApi.AssetModule.Entities;

public class AssetAttribute : BaseEntity
{
    public int AssetID { get; set; }
    public virtual Asset? Asset { get; set; }
    [StringLength(255)]
    public string AttributeKey { get; set; }
    public string? AttributeValue { get; set; }

    [Required]
    [StringLength(255)]
    public string InputType { get; set; }

    public string? InputOptions { get; set; }
    public bool IsRequired { get; set; }

    [NotMapped]
    public string FormattedValue
    {
        get
        {
            if (AttributeValue == null) return string.Empty;

            if (InputType != null && InputType == McvConstant.ASSET_ATTRIBUTE_INPUT_TYPE_DATE)
                return ClockTools.GetIST(DateTime.Parse(AttributeValue, null, System.Globalization.DateTimeStyles.RoundtripKind)).ToString("dd MMM yyyy");

            if (InputType != null && InputType == McvConstant.ASSET_ATTRIBUTE_INPUT_TYPE_CURRENCY)
                return Convert.ToDecimal(AttributeValue).ToString("C", CultureInfo.CreateSpecificCulture("en-IN"));

            return AttributeValue;
        }
    }
}
public class AssetAttributeConfiguration : IEntityTypeConfiguration<AssetAttribute>
{
    public void Configure(EntityTypeBuilder<AssetAttribute> builder)
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
        builder.HasIndex(e => e.AttributeKey);
    }
}

