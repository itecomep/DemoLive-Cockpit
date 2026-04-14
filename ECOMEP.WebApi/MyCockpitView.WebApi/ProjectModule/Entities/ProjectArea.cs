using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.Entities;

public class ProjectArea : BaseEntity
{
    public int ProjectID { get; set; }

    public virtual Project? Project { get; set; }

    [StringLength(255)]
    [Required]
    public string? Title { get; set; }

    
    [Precision(18,2)] public decimal Area { get; set; } = 0.0m;

    public string? Unit { get; set; } = "unit";

    public int? ParentID { get; set; }

    public virtual ProjectArea? Parent { get; set; }
    public virtual ICollection<ProjectArea> Children { get; set; } = new List<ProjectArea>();

    
    [Precision(18,2)] public decimal Percentage { get; set; }
    
    [Precision(18,2)] public decimal Amount { get; set; }

    public virtual ICollection<ProjectAreaStage> Stages { get; set; }=new List<ProjectAreaStage>();
  
}

public class ProjectAreaConfiguration : IEntityTypeConfiguration<ProjectArea>
{
    public void Configure(EntityTypeBuilder<ProjectArea> builder)
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
        builder
            .HasOne(u => u.Project)
            .WithMany(c => c.Areas)
            .HasForeignKey(x => x.ProjectID).IsRequired();

        builder.HasIndex(x => x.Title);

            builder.HasIndex(x => x.Percentage);

        builder
          .HasOne(u => u.Parent)
          .WithMany(c => c.Children)
          .HasForeignKey(x => x.ParentID)
          .OnDelete(DeleteBehavior.NoAction);
    }
}