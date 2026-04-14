using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MyCockpitView.WebApi.Entities;

public class ProjectWorkOrder : BaseEntity
{
    [StringLength(50)]
    public string? AreaTitle { get; set; }

    [Precision(18,2)] public decimal Area { get; set; } = 0.0m;

    [StringLength(50)]
    public string? Unit { get; set; }

    [Precision(18,2)] public decimal Rate { get; set; } = 0.0m;
    [Precision(18,2)] public decimal Fees { get; set; } = 0.0m;
    [Precision(18,2)] public decimal Share { get; set; } = 0.0m;
    [Required]
    public int ProjectID { get; set; }

    public virtual Project? Project { get; set; }
    public int? ClientContactID { get; set; }
    public int? CompanyID { get; set; }
    [StringLength(255)]
    public string? WorkOrderNo { get; set; }

    public DateTime? DueDate { get; set; }

    [Required]
    
    public DateTime WorkOrderDate { get; set; }

    public virtual ICollection<ProjectWorkOrderAttachment> Attachments { get; set; } = new List<ProjectWorkOrderAttachment>();

    [StringLength(255)]
    public string? WorkDetail { get; set; } //"Architecture Design Consultancy"

    [StringLength(255)]
    public string? WorkProposalTemplate { get; set; }

    [Precision(18,2)] public decimal InteriorCost { get; set; } = 0.0m;

    public string? BlobUrl { get; set; }

    public virtual ICollection<ProjectWorkOrderSegment> Segments { get; set; } = new List<ProjectWorkOrderSegment>();
    public virtual ICollection<ProjectWorkOrderArea> Areas { get; set; } = new List<ProjectWorkOrderArea>();
    public virtual ICollection<ProjectWorkOrderServiceAmount> ServiceAmounts { get; set; } = new List<ProjectWorkOrderServiceAmount>();
}
public class ProjectWorkOrderConfiguration : IEntityTypeConfiguration<ProjectWorkOrder>
{
    public void Configure(EntityTypeBuilder<ProjectWorkOrder> builder)
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


    }
}