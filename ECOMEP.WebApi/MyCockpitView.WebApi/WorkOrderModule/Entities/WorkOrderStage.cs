using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.WorkOrderModule.Entities;

public class WorkOrderStage : BaseEntity
{
    [Required]
    public int WorkOrderID { get; set; }
    public virtual WorkOrder? WorkOrder { get; set; }

    [Required]
    public int ProjectID { get; set; }
    public virtual Project? Project { get; set; }
    [StringLength(255)]
    [Required]
    public string? Title { get; set; }
    [StringLength(10)]
    public string? Abbreviation { get; set; }
    [Precision(18, 2)] public decimal Percentage { get; set; }
    [Precision(18, 2)] public decimal Amount { get; set; }
    public bool IsLumpsum { get; set; }
    public int Revisions { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? BillingDate { get; set; }
    public DateTime? PaymentReceivedDate { get; set; }
    public int? ParentID { get; set; }
    public virtual WorkOrderStage? Parent { get; set; }
    public virtual ICollection<WorkOrderStage> Children { get; set; } = new HashSet<WorkOrderStage>();
}

public class WorkOrderStageConfiguration : IEntityTypeConfiguration<WorkOrderStage>
{
    public void Configure(EntityTypeBuilder<WorkOrderStage> builder)
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

        //builder
        //    .HasOne(u => u.WorkOrder)
        //    .WithMany(c => c.Stages)
        //    .HasForeignKey(x => x.WorkOrderID)
        //    .OnDelete(DeleteBehavior.Cascade); 
        builder
        .HasOne(x => x.WorkOrder)
        .WithMany(c => c.Stages)
        .HasForeignKey(x => x.WorkOrderID)
        .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectID)
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentID)
            .OnDelete(DeleteBehavior.NoAction);


        builder.HasIndex(x => x.Title);
        builder.HasIndex(x => x.Abbreviation);
        builder.HasIndex(x => x.Percentage);
        builder.HasIndex(x => x.DueDate);
        builder.HasIndex(x => x.BillingDate);
        builder.HasIndex(x => x.PaymentReceivedDate);
        builder.HasIndex(x => x.IsLumpsum);
    }
}


