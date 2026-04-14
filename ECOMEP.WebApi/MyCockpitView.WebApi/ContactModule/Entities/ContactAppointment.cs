using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.CoreModule;


namespace MyCockpitView.WebApi.ContactModule.Entities;

public class ContactAppointment : BaseEntity
{

    [StringLength(255)]
    public string? Designation { get; set; }

    [StringLength(255)]

    public string? Code { get; set; }
    public string? EmployeeCode { get; set; }
    public DateTime JoiningDate { get; set; }
    public DateTime? ResignationDate { get; set; }

     [Precision(18,2)] public decimal ManValue { get; set; }
     [Precision(18,2)] public decimal ExpectedVhr { get; set; }
     [Precision(18,2)] public decimal ExpectedRemuneration { get; set; }

    public string? BankAccountNo { get; set; }
    public string? Location { get; set; }
    public int ContactID { get; set; }

    public virtual Contact? Contact { get; set; }



    public int CompanyID { get; set; }
    public virtual Company? Company { get; set; }

    public int? ManagerContactID { get; set; }
    public virtual Contact? ManagerContact { get; set; }

    public virtual ICollection<ContactAppointmentAttachment> Attachments { get; set; } = new HashSet<ContactAppointmentAttachment>();


}

public class ContactAppointmentConfiguration : IEntityTypeConfiguration<ContactAppointment>
{
    public void Configure(EntityTypeBuilder<ContactAppointment> builder)
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
          .HasOne(u => u.Contact)
          .WithMany(x => x.Appointments)
          .HasForeignKey(x => x.ContactID).IsRequired()
                  .OnDelete(DeleteBehavior.Restrict); 


        builder
        .HasOne(u => u.ManagerContact)
        .WithMany()
        .HasForeignKey(x => x.ManagerContactID)
        .IsRequired(false)
        .OnDelete(DeleteBehavior.SetNull);


        builder.HasIndex(e => e.JoiningDate);

        builder.HasIndex(e => e.ResignationDate);
    }
}