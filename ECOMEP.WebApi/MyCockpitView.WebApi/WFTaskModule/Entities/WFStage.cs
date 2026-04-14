using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.WFTaskModule.Entities;

public class WFStage : BaseEntity
{
    [StringLength(255)]
    public string? Code { get; set; }
    [StringLength(255)]
    public string? TaskTitle { get; set; }
    [StringLength(255)]
    public string? Entity { get; set; }
    [StringLength(255)]
    public string? EntityTypeFlag { get; set; }

    public bool IsSystem { get; set; }
    public bool IsStart { get; set; }
    
    [Precision(18,2)] public decimal DueDays { get; set; }

    public bool IsAssignByRole { get; set; }

    public bool ShowAssessment { get; set; }
    [StringLength(255)]
    public string? AssessmentForStage { get; set; }
    [StringLength(255)]
    public string? AssignByProperty { get; set; }
    [StringLength(255)]
    public string? AssignByEntityProperty { get; set; }
    public bool ShowComment { get; set; }
    public bool ShowFollowUpDate { get; set; }
    public bool ShowAttachment { get; set; }
    [StringLength(255)]
    public string? ActionType { get; set; }

    public virtual ICollection<WFStageAction> Actions { get; set; } = new List<WFStageAction>();

    public bool IsCommentRequired { get; set; }

    public int InitialRevison { get; set; }
    public bool IsAssessmentRequired { get; set; }
    public bool IsPreAssignedTimeTask { get; set; }

}

public class WFStageConfiguration : IEntityTypeConfiguration<WFStage>
{
    public void Configure(EntityTypeBuilder<WFStage> builder)
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

        builder.HasIndex(e => e.Entity);
        builder.HasIndex(e => e.Code);
        builder.HasIndex(e => e.ShowAssessment);
        builder.HasIndex(e => e.IsAssignByRole);
        builder.HasIndex(e => e.IsAssessmentRequired);
        builder.HasIndex(e => e.ActionType);
        builder.HasIndex(e => e.AssessmentForStage);
        builder.HasIndex(e => e.EntityTypeFlag);
        builder.HasIndex(e => e.InitialRevison);
        builder.HasIndex(e => e.IsStart);
        builder.HasIndex(e => e.IsSystem);
        builder.HasIndex(e => e.TaskTitle);
    }
}