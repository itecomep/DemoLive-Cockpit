using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;

using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.WFTaskModule.Entities;
public class WFTask : BaseEntity
{
    public int? AssignerContactID { get; set; }

    public virtual Contact? Assigner { get; set; }

    public int ContactID { get; set; }

    public virtual Contact? Contact { get; set; }

    [Required]
    [StringLength(255)]
    public string? Title { get; set; }

    [Required]
    [StringLength(255)]
    public string? Subtitle { get; set; }
    [StringLength(255)]
    public string? WFStageCode { get; set; }
    public int? StageIndex { get; set; }
    public int StageRevision { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public int OutcomeFlag { get; set; }
    public string? Comment { get; set; }
    public string? History { get; set; }
    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();

    public virtual ICollection<Assessment> Assessments { get; set; } = new List<Assessment>();
    public virtual ICollection<WFTaskAttachment> Attachments { get; set; } = new List<WFTaskAttachment>();

    public bool IsPreAssignedTimeTask { get; set; }

    public int CompanyID { get; set; }
     [Precision(18,2)] public decimal ManValue { get; set; }

     [Precision(18,2)] public decimal AssessmentPoints { get; set; }
     [Precision(18,2)] public decimal MHrAssigned { get; set; }
     [Precision(18,2)] public decimal MHrConsumed { get; set; }
     [Precision(18,2)] public decimal MHrAssessed { get; set; }
     [Precision(18,2)] public decimal VHrAssigned { get; set; }
     [Precision(18,2)] public decimal VHrConsumed { get; set; }
     [Precision(18,2)] public decimal VHrAssessed { get; set; }
     [Precision(18,2)] public decimal VHrAssignedCost { get; set; }
     [Precision(18,2)] public decimal VHrConsumedCost { get; set; }
     [Precision(18,2)] public decimal VHrAssessedCost { get; set; }
     [Precision(18,2)] public decimal VHrRate { get; set; }

    public bool IsAssessmentRequired { get; set; }

    [StringLength(255)]
    public string? PreviousStageCode { get; set; }
    public int? PreviousStageRevision { get; set; }
    public int? PreviousTaskID { get; set; }

    public string? AssessmentRemark { get; set; }
    public string? Entity { get; set; }
    public int? EntityID { get; set; }
    public int? ProjectID { get; set; }
    [StringLength(50)]
    public string? Priority { get; set; }
}

public class WFTaskConfiguration : IEntityTypeConfiguration<WFTask>
{
    public void Configure(EntityTypeBuilder<WFTask> builder)
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
        builder.HasOne(t => t.Assigner)
            .WithMany()
            .HasForeignKey(t => t.AssignerContactID)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.Contact)
            .WithMany()
            .HasForeignKey(t => t.ContactID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.Entity);
        builder.HasIndex(e => e.EntityID);
        builder.HasIndex(e => e.DueDate);
        builder.HasIndex(e => e.StageRevision);
        builder.HasIndex(e => e.IsAssessmentRequired);
        builder.HasIndex(e => e.IsPreAssignedTimeTask);
        builder.HasIndex(e => e.StartDate);
        builder.HasIndex(e => e.CompletedDate);
        builder.HasIndex(e => e.FollowUpDate);
        builder.HasIndex(e => e.OutcomeFlag);
        builder.HasIndex(e => e.WFStageCode);

    }
}