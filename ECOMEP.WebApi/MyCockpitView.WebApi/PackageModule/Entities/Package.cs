using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.PackageModule.Entities;

public class Package:BaseEntity
{
    [Required]
    public int ProjectID { get; set; }
    public int? ProjectStageID { get; set; }
    public int? ProjectAreaID { get; set; }
    [Required]
    [StringLength(255)]
    public string? Title { get; set; }
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime DueDate { get; set; }
    public DateTime? SubmissionDate { get; set; }
    
    [Precision(18,2)] public decimal MHrAssigned { get; set; } = 0;
    
    [Precision(18,2)] public decimal MHrConsumed { get; set; } = 0;
    public virtual ICollection<PackageAttachment> Attachments { get; set; }= new List<PackageAttachment>();
    public virtual ICollection<PackageContact> Contacts { get; set; }= new List<PackageContact>();
    public virtual ICollection<PackageStudioWork> StudioWorks { get; set; } = new List<PackageStudioWork>();
}


public class PackageConfiguration : IEntityTypeConfiguration<Package>
{
    public void Configure(EntityTypeBuilder<Package> builder)
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

        builder.HasIndex(e => e.Title);
        builder.HasIndex(e => e.StartDate);
        builder.HasIndex(e => e.DueDate);
        builder.HasIndex(e => e.SubmissionDate);
        builder.HasIndex(e => e.ProjectAreaID);
        builder.HasIndex(e => e.ProjectStageID);
    }
}
