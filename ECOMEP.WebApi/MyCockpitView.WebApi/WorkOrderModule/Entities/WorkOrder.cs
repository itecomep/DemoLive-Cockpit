using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.Entities;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.WorkOrderModule.Entities;

public class WorkOrder : BaseEntity
{
    [Required]
    public int ProjectID { get; set; }
    public virtual Project? Project { get; set; }
    public int CompanyID { get; set; }
    public virtual Company? Company { get; set; }

    [Required]
    public string Typology { get; set; }

    [StringLength(255)]
    public string? WorkOrderNo { get; set; }
    [Required]
    public DateTime WorkOrderDate { get; set; }
    public DateTime? DueDate { get; set; }
    [Precision(18, 2)] public decimal? Area { get; set; } = 0.0m;
    public bool IsLumpSum { get; set; }
    [Precision(18, 2)] public decimal? Rate { get; set; } = 0.0m;
    public int Amount { get; set; }
    public virtual ICollection<WorkOrderAttachment> Attachments { get; set; } = new List<WorkOrderAttachment>();
    public virtual ICollection<WorkOrderStage> Stages { get; set; } = new List<WorkOrderStage>();
}

public class WorkOrderConfiguration : IEntityTypeConfiguration<WorkOrder>
{
    public void Configure(EntityTypeBuilder<WorkOrder> builder)
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
    }
}


