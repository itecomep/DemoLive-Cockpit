using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.LeaveModule.Entities;

public class LeaveAttachment : BaseBlobEntity
{
    public int LeaveID { get; set; }
    public virtual Leave? Leave { get; set; }
}

public class LeaveAttachmentConfiguration : IEntityTypeConfiguration<LeaveAttachment>
{
    public void Configure(EntityTypeBuilder<LeaveAttachment> builder)
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
        builder.Property(e => e.Filename)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(e => e.ContentType)
            .HasMaxLength(255);

        builder.HasIndex(e => e.Filename);
        builder.HasQueryFilter(x => !x.IsDeleted);
        builder
            .HasOne(u => u.Leave)
            .WithMany(t => t.Attachments)
            .HasForeignKey(u => u.LeaveID).IsRequired();
    }
}
