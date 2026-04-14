using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;


namespace MyCockpitView.WebApi.ContactModule.Entities;

public class ContactAttachment : BaseBlobEntity
{
    [Required]
    public int ContactID { get; set; }

    public virtual Contact? Contact { get; set; }

    [StringLength(255)]
    public string? Title { get; set; }
}

public class ContactAttachmentConfiguration : IEntityTypeConfiguration<ContactAttachment>
{
    public void Configure(EntityTypeBuilder<ContactAttachment> builder)
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
        builder.HasQueryFilter(x => !x.IsDeleted);

        builder.Property(e => e.Filename)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(e => e.ContentType)
            .HasMaxLength(255);

        builder.HasIndex(e => e.Filename);

        builder.HasQueryFilter(x => !x.IsDeleted);
        builder
            .HasOne(u => u.Contact)
            .WithMany(c => c.Attachments)
            .HasForeignKey(x => x.ContactID).IsRequired();
    }
}
