using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;


namespace MyCockpitView.WebApi.WFTaskModule.Entities;

public class WFStageAction : BaseEntity
{

    public int WFStageID { get; set; }

    public virtual WFStage? WFStage { get; set; }

    public int TaskOutcomeFlag { get; set; }

    public int TaskStatusFlag { get; set; }

    public string? ActionByCondition { get; set; }
    public int ActionByCount { get; set; }

    public string? NextStageCode { get; set; }

    public string? ShowOnStatusFlag { get; set; }

    public string? ActivityText { get; set; }

    public string? ButtonClass { get; set; } = "primary";

    public string? ButtonText { get; set; }

    public string? ButtonTooltip { get; set; }

    public bool TriggerEntityFormSubmit { get; set; }

}

public class WFStageActionConfiguration : IEntityTypeConfiguration<WFStageAction>
{
    public void Configure(EntityTypeBuilder<WFStageAction> builder)
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
        builder.Property(a => a.WFStageID)
            .IsRequired();

        builder.Property(a => a.TaskOutcomeFlag)
            .IsRequired();

        builder.Property(a => a.TaskStatusFlag)
            .IsRequired();

        builder.Property(a => a.ActionByCondition)
            .HasMaxLength(255);

        builder.Property(a => a.ActionByCount)
            .IsRequired();

        builder.Property(a => a.NextStageCode)
            .HasMaxLength(255);

        builder.Property(a => a.ShowOnStatusFlag)
            .HasMaxLength(255);

        builder.Property(a => a.ActivityText)
            .HasMaxLength(255);

        builder.Property(a => a.ButtonClass)
            .HasMaxLength(255)
            .HasDefaultValue("primary");

        builder.Property(a => a.ButtonText)
            .HasMaxLength(255);

        builder.Property(a => a.ButtonTooltip)
            .HasMaxLength(255);

        builder.Property(a => a.TriggerEntityFormSubmit);

        // Relationships
        builder.HasOne(a => a.WFStage)
            .WithMany(x => x.Actions)
            .HasForeignKey(a => a.WFStageID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

    }
}
