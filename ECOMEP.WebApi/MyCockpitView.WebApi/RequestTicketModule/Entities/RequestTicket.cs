
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;


namespace MyCockpitView.WebApi.RequestTicketModule.Entities;

public class RequestTicket : BaseEntity
{
    [Required]
    [StringLength(255)]
    public string? Title { get; set; }

    [StringLength(255)]
    public string? Subtitle { get; set; }

    [Required]
    [StringLength(255)]
    public string? Purpose { get; set; }

    [StringLength(255)]
    public string? Authority { get; set; }

    [Required]
    [StringLength(50)]
    public string? Code { get; set; }

    [StringLength(255)]
    public string? StageTitle { get; set; }
    public int? StageID { get; set; }
    [Precision(18, 2)] public decimal Revision { get; set; } = 0;

    [Required]
    
    public DateTime NextReminderDate { get; set; }

    public string? RequestMessage { get; set; }
    public string? ResolutionMessage { get; set; }

    [Required]
    public int AssignerContactID { get; set; }
    public virtual Contact? AssignerContact { get; set; }

    
    [Precision(18,2)] public decimal ReminderInterval { get; set; }
    public int RepeatCount { get; set; }

    public bool IsRepeatRequired { get; set; } = true;

    [StringLength(255)]
    public string? Entity { get; set; }
    public int? EntityID { get; set; }
    [StringLength(255)]
    public string? EntityTitle { get; set; }
    public int? ProjectID { get; set; }
    public bool IsReadOnly { get; set; }
    public int? ParentID { get; set; }
public bool IsDraft {  get; set; }
    public virtual ICollection<RequestTicketAssignee> Assignees { get; set; } = new List<RequestTicketAssignee>();
    public virtual ICollection<RequestTicketAttachment> Attachments { get; set; } = new List<RequestTicketAttachment>();
}
public class RequestTicketConfiguration : IEntityTypeConfiguration<RequestTicket>
{
    public void Configure(EntityTypeBuilder<RequestTicket> builder)
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
        builder.HasIndex(e => e.Revision);
        builder.HasIndex(e => e.StageTitle);
        builder.HasIndex(e => e.Authority);
        builder.HasIndex(e => e.StageID);
        builder.HasIndex(e => e.Purpose);
        builder.HasIndex(e => e.Code);
        builder.HasIndex(e => e.NextReminderDate);
        builder.HasIndex(e => e.ProjectID);
        builder.HasIndex(e => e.ParentID);
        builder.HasIndex(e => e.AssignerContactID);
        builder.HasIndex(e => e.Entity);
        builder.HasIndex(e => e.EntityID);
    }
}