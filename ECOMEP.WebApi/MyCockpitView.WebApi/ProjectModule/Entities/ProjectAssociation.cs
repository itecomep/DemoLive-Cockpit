using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;


namespace MyCockpitView.WebApi.Entities;

public class ProjectAssociation : BaseEntity
{

    public string? Title { get; set; }
    public int ProjectID { get; set; }
    public virtual Project? Project { get; set; }
    public int ContactID { get; set; }
    public virtual Contact? Contact { get; set; }

}


public class ProjectAssociationConfiguration : IEntityTypeConfiguration<ProjectAssociation>
{
    public void Configure(EntityTypeBuilder<ProjectAssociation> builder)
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
        builder.Property(pa => pa.Title)
            .HasMaxLength(255);

        builder.Property(pa => pa.ProjectID)
            .IsRequired();

        builder.Property(pa => pa.ContactID)
            .IsRequired();

        // Relationships
        builder.HasOne(pa => pa.Project)
            .WithMany(p => p.Associations)
            .HasForeignKey(pa => pa.ProjectID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pa => pa.Contact)
            .WithMany()
            .HasForeignKey(pa => pa.ContactID)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}