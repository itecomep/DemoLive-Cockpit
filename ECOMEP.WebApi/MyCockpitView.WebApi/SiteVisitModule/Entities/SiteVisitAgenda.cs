using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;

using System.ComponentModel.DataAnnotations;
namespace MyCockpitView.WebApi.SiteVisitModule.Entities;

public class SiteVisitAgenda: BaseEntity
{
    public bool IsReadOnly { get; set; }

    [Required]
    public int SiteVisitID { get; set; }
    public virtual SiteVisit? SiteVisit { get; set; }
    public DateTime? SiteVisitDate { get; set; }
    public string? SiteVisitTitle { get; set; }

    [StringLength(255)]
    public string? Title { get; set; }

    [StringLength(255)]
    public string? Subtitle { get; set; }

    public string? Comment { get; set; }


    public DateTime? DueDate { get; set; }

    [StringLength(255)]
    public string? ActionBy { get; set; }

    public int? ActionByContactID { get; set; }

    public string? PreviousHistory { get; set; }

    public DateTime? PreviousDueDate { get; set; }

    public string? PreviousActionBy { get; set; }
    public string? PreviousComment { get; set; }

    public int? PreviousAgendaID { get; set; }

    public bool IsForwarded { get; set; }

    public int ReminderCount { get; set; }

    [StringLength(255)]
    public string? UpdateFrom { get; set; }
    public int? ProjectID { get; set; }


    public bool IsInspection { get; set; }

    public bool NotDiscussed { get; set; }

    public bool SendUpdate { get; set; }


    [Precision(18, 2)] public decimal Progress { get; set; }


    [Precision(18, 2)] public decimal PreviousProgress { get; set; }


    public int? TodoID { get; set; }
    public virtual ICollection<SiteVisitAgendaAttachment> Attachments { get; set; } = new List<SiteVisitAgendaAttachment>();

}

public class SiteVisitAgendaConfiguration : IEntityTypeConfiguration<SiteVisitAgenda>
{
    public void Configure(EntityTypeBuilder<SiteVisitAgenda> builder)
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
        builder.HasIndex(e => e.IsReadOnly);
        builder.HasIndex(e => e.Title);
        builder.HasIndex(e => e.Subtitle);
        builder.HasIndex(e => e.DueDate);
        builder.HasIndex(e => e.ActionBy);
        builder.HasIndex(e => e.ActionByContactID);
        builder.HasIndex(e => e.PreviousAgendaID);
        builder.HasIndex(e => e.SiteVisitDate);
        builder.HasIndex(e => e.SiteVisitTitle);
        builder.HasIndex(e => e.IsForwarded);
        builder.HasIndex(e => e.ReminderCount);
        builder.HasIndex(e => e.IsForwarded);
        builder.HasIndex(e => e.ProjectID);
        builder.HasIndex(e => e.IsInspection);
        builder.HasIndex(e => e.NotDiscussed);
        builder.HasIndex(e => e.SendUpdate);
        builder.HasIndex(e => e.TodoID);
    }
}

