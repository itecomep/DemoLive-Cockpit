using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyCockpitView.CoreModule;
public abstract class BaseEntity
{
    public bool IsReadOnly { get; set; } = false;
    public int? ParentVersionID { get; set; }
    public bool IsVersion { get; set; } = false;
    public DateTime Created { get; set; }
    public string? CreatedBy { get; set; }
    public int? CreatedByContactID { get; set; }
    public string? Description { get; set; }
    public int ID { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime Modified { get; set; }
    public string? ModifiedBy { get; set; }
    public int? ModifiedByContactID { get; set; }
    public int OrderFlag { get; set; }
    public string? _searchTags { get; set; }= string.Empty;
    public ICollection<string> SearchTags
    {
        get
        {
            return _searchTags != null && _searchTags != string.Empty ?
                _searchTags.Split(',').ToList() :
                new List<string>() { };
        }
        set
        {
            _searchTags = string.Join(",", value.Select(x => x.Trim()));
        }
    }

    public int StatusFlag { get; set; }
    public int TypeFlag { get; set; }
    public Guid UID { get; set; }

}


public class BaseEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : BaseEntity
{
    public void Configure(EntityTypeBuilder<T> builder)
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
        builder.HasIndex(e => e.IsVersion);
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

public class EntityPropertyChange
{
    public string? PropertyName { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? DataType { get; set; }
}
