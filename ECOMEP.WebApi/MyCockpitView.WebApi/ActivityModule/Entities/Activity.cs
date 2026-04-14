using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.ActivityModule.Entities;

public class Activity : BaseEntity
{
    [StringLength(255)]

    public string? Action { get; set; }

    public int? WFTaskID { get; set; }

    public string? Comments { get; set; }

    [StringLength(50)]
    public string? Status { get; set; }


    public int ContactID { get; set; }

    public Guid ContactUID { get; set; }

    [StringLength(255)]
    public string? ContactName { get; set; }
    public string? ContactPhotoUrl { get; set; }

    [StringLength(255)]

    public string? Entity { get; set; }


    public int? EntityID { get; set; }

    [StringLength(255)]
    public string? EntityTitle { get; set; }
    public virtual ICollection<ActivityAttachment> Attachments { get; set; } = new List<ActivityAttachment>();
    public string? PropertyChangesJson { get; set; }

    [NotMapped]
    public IEnumerable<EntityPropertyChange> PropertyChanges
    {
        get => PropertyChangesJson != null && PropertyChangesJson != string.Empty ? JsonConvert.DeserializeObject<List<EntityPropertyChange>>(PropertyChangesJson) : new List<EntityPropertyChange>();
        set => PropertyChangesJson = JsonConvert.SerializeObject(value);
    }
}

public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
{
    public void Configure(EntityTypeBuilder<Activity> builder)
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
        builder.HasQueryFilter(x => !x.IsDeleted);
        builder.HasIndex(e => e.ContactID);
        builder.HasIndex(e => e.Entity);
        builder.HasIndex(e => e.EntityID);
    }
}