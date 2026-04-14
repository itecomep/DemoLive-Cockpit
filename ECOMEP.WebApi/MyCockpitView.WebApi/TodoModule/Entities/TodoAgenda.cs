
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;


namespace MyCockpitView.WebApi.TodoModule.Entities;

public class TodoAgenda : BaseEntity
{
    
    [StringLength(255)]
    public string? Title { get; set; }

    public string? Comment { get; set; }

    
    public int TodoID { get; set; }

    public virtual Todo? Todo { get; set; }

}

public class TodoAgendaConfiguration : IEntityTypeConfiguration<TodoAgenda>
{
    public void Configure(EntityTypeBuilder<TodoAgenda> builder)
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
        builder.Property(ta => ta.Title)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(ta => ta.Comment);

        builder.Property(ta => ta.TodoID)
            .IsRequired();

        // Relationships
        builder.HasOne(ta => ta.Todo)
            .WithMany(t => t.Agendas)
            .HasForeignKey(ta => ta.TodoID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
