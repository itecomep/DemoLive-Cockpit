using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.TodoModule.Entities;

public class Todo : BaseEntity
{
    public string? Title { get; set; }

    public string? SubTitle { get; set; }

    public DateTime DueDate { get; set; }


    public DateTime StartDate { get; set; }

    public string? Comment { get; set; }

    public int AssigneeContactID { get; set; }

    public int AssignerContactID { get; set; }

    public int? ParentID { get; set; }
    public virtual Contact? Assignee { get; set; }

    public virtual Contact? Assigner { get; set; }

    public virtual ICollection<TodoAttachment> Attachments { get; set; } = new List<TodoAttachment>();

    public virtual ICollection<TodoAgenda> Agendas { get; set; } = new List<TodoAgenda>();
    
    [Precision(18,2)] public decimal MHrAssigned { get; set; }
    
    [Precision(18,2)] public decimal MHrConsumed { get; set; }
    public int? ProjectID { get; set; }
    public virtual Project? Project { get; set; }

    [StringLength(50)]
    public string? Priority { get; set; }
}


public class TodoConfiguration : IEntityTypeConfiguration<Todo>
{
    public void Configure(EntityTypeBuilder<Todo> builder)
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


        builder.Property(t => t.ProjectID);

        // Relationships
        builder.HasOne(t => t.Assignee)
            .WithMany()
            .HasForeignKey(t => t.AssigneeContactID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Assigner)
            .WithMany()
            .HasForeignKey(t => t.AssignerContactID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Project)
            .WithMany()
            .HasForeignKey(t => t.ProjectID)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.DueDate);
    }
}
