using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;

using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ContactModule.Entities;

public class ContactAssociation : BaseEntity
{
    public int PersonContactID { get; set; }
    public int CompanyContactID { get; set; }
    public virtual Contact? Person { get; set; }
    public virtual Contact? Company { get; set; }

    [StringLength(255)]
    public string? Department { get; set; }
    [StringLength(255)]
    public string? Designation { get; set; }
}

public class ContactAssociationConfiguration : IEntityTypeConfiguration<ContactAssociation>
{
public void Configure(EntityTypeBuilder<ContactAssociation> builder)
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

        builder
           .HasOne(u => u.Person)
            .WithMany(c => c.AssociatedCompanies)
            .HasForeignKey(x => x.PersonContactID)
             .OnDelete(DeleteBehavior.Restrict).IsRequired();

        builder
              .HasOne(u => u.Company)
              .WithMany(c => c.AssociatedContacts)
              .HasForeignKey(x => x.CompanyContactID)
               .OnDelete(DeleteBehavior.Restrict).IsRequired();

    }
}