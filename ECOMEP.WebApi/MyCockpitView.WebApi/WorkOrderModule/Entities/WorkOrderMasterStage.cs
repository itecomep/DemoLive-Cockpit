using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using Newtonsoft.Json;


namespace MyCockpitView.WebApi.WorkOrderModule.Entities;

public class WorkOrderMasterStage : BaseEntity
{
    [Required]
    public int WorkOrderMasterID { get; set; }
    public virtual WorkOrderMaster? WorkOrderMaster { get; set; }
    [Required]
    public string Title { get; set; }
    [Required]
    public int Value { get; set; }
}

public class WorkOrderMasterStageConfiguration : IEntityTypeConfiguration<WorkOrderMasterStage>
{
    public void Configure(EntityTypeBuilder<WorkOrderMasterStage> builder)
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


