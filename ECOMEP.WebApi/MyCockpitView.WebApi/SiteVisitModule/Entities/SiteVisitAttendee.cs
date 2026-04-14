using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.SiteVisitModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.SiteVisitModule.Entities;

public class SiteVisitAttendee: BaseEntity
{
    [Required]
    public int SiteVisitID { get; set; }


    [Required]
    [StringLength(255)]
    public string? Name { get; set; }

    [StringLength(255)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? Company { get; set; }

    public int? ContactID { get; set; }

    public virtual SiteVisit? SiteVisit { get; set; }
}
public class SiteVisitAttendeeConfiguration : IEntityTypeConfiguration<SiteVisitAttendee>
{
    public void Configure(EntityTypeBuilder<SiteVisitAttendee> builder)
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
        builder.HasIndex(e => e.Name);
        builder.HasIndex(e => e.Email);
        builder.HasIndex(e => e.Company);
        builder.HasIndex(e => e.ContactID);


    }
}

