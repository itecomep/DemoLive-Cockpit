
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.WFTaskModule.Entities;

public class Assessment : BaseEntity
{
    public int ContactID { get; set; }
    public virtual Contact? Contact { get; set; }

    [StringLength(255)]
    public string? TaskTitle { get; set; }

    [StringLength(255)]
    public string? Category { get; set; }
    
    [Precision(18,2)] public decimal Points { get; set; }
    
    [Precision(18,2)] public decimal ScoredPoints { get; set; }

    public string? Comment { get; set; }

    public int? WFTaskID { get; set; }
    public virtual WFTask? WFTask { get; set; }

    [StringLength(255)]
    public string? Entity { get; set; }


    public int? EntityID { get; set; }
    [StringLength(255)]
    public string? EntityTitle { get; set; }
}

public class AssessmentConfiguration : IEntityTypeConfiguration<Assessment>
{
    public void Configure(EntityTypeBuilder<Assessment> builder)
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
    
        // Relationships
        builder.HasOne(a => a.Contact)
            .WithMany()
            .HasForeignKey(a => a.ContactID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.WFTask)
            .WithMany(x => x.Assessments)
            .HasForeignKey(a => a.WFTaskID)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
