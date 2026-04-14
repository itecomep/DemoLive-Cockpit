using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using Newtonsoft.Json;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.ContactModule.Entities;

public class Contact : BaseEntity
{

    public bool IsCompany { get; set; }


    [Required]
    [StringLength(255)]
    public string? FullName { get; set; }
    //public string? FullName => ($"{Title} {FirstName} {LastName}").Trim();

    public string? Name => $"{FirstName} {LastName}".Trim();


    [StringLength(50)]
    public string? Title { get; set; }


    [Required]
    [StringLength(255)]
    public string? FirstName { get; set; }

    [StringLength(255)]
    public string? MiddleName { get; set; }

    [StringLength(255)]
    public string? LastName { get; set; }

    [StringLength(50)]
    public string? Gender { get; set; }

    public string? AddressesJson { get; set; }

    [NotMapped]
    public List<ContactAddress> Addresses
    {
        get => AddressesJson != null && AddressesJson != string.Empty ? JsonConvert.DeserializeObject<List<ContactAddress>>(AddressesJson) : new List<ContactAddress>();
        set => AddressesJson = JsonConvert.SerializeObject(value);
    }

    public string? PhonesJson { get; set; }

    [NotMapped]
    public List<ContactPhone> Phones
    {
        get => PhonesJson != null && PhonesJson != string.Empty ? JsonConvert.DeserializeObject<List<ContactPhone>>(PhonesJson) : new List<ContactPhone>();
        set => PhonesJson = JsonConvert.SerializeObject(value);
    }

    public string? EmailsJson { get; set; }

    [NotMapped]
    public List<ContactEmail> Emails
    {
        get => EmailsJson != null && EmailsJson != string.Empty ? JsonConvert.DeserializeObject<List<ContactEmail>>(EmailsJson) : new List<ContactEmail>();
        set => EmailsJson = JsonConvert.SerializeObject(value);
    }



    [StringLength(255)]
    public string? Website { get; set; }
    public DateTime? Birth { get; set; }

    public DateTime? Anniversary { get; set; }
    [StringLength(255)]
    public string? PAN { get; set; }

    [StringLength(255)]
    public string? TAN { get; set; }

    [StringLength(255)]
    public string? GSTIN { get; set; }

    [StringLength(255)]
    public string? GSTStateCode { get; set; }

    [StringLength(255)]
    public string? ARN { get; set; }

    [StringLength(255)]
    public string? PhotoFilename { get; set; }

    public string? PhotoUrl { get; set; }

    public string? Username { get; set; }

    [Column("Categories")]
    public string? _categories { get; set; } = string.Empty;

    [NotMapped]
    public List<string> Categories
    {
        get
        {
            return !string.IsNullOrEmpty(_categories)?
                _categories.Split(',').ToList() :
                new List<string>();
        }
        set
        {
            _categories = string.Join(",", value);
        }
    }

    public string? Notes { get; set; }


    [Column("Urls")]
    public string? _urls { get; set; }

    [NotMapped]
    public List<string> Urls
    {
        get
        {
            return !string.IsNullOrEmpty(_urls)?
                _urls.Split(',').ToList() :
                new List<string>();
        }
        set
        {
            _urls = string.Join(",", value);
        }
    }

    [StringLength(255)]
    public string? MaritalStatus { get; set; }

    [StringLength(255)]
    public string? FamilyContactName { get; set; }

    [StringLength(255)]
    public string? FamilyContactRelation { get; set; }

    [StringLength(255)]
    public string? FamilyContactPhone { get; set; }

    [StringLength(255)]
    public string? EmergencyContactName { get; set; }

    [StringLength(255)]
    public string? EmergencyContactRelation { get; set; }
    [StringLength(255)]
    public string? EmergencyContactPhone { get; set; }


    [StringLength(255)]
    public string? BankName { get; set; }
    [StringLength(255)]
    public string? IFSCCode { get; set; }
    [StringLength(255)]
    public string? UDHYAM { get; set; }
    [StringLength(255)]
    public string? AADHAAR { get; set; }
    [StringLength(255)]
    public string? BankAccountNo { get; set; }
    [StringLength(255)]
    public string? DrivingLicenseNo { get; set; }

    
    public virtual ICollection<ContactAssociation> AssociatedCompanies { get; set; } = new HashSet<ContactAssociation>();
    public virtual ICollection<ContactAssociation> AssociatedContacts { get; set; } = new HashSet<ContactAssociation>();
    public virtual ICollection<ContactAppointment> Appointments { get; set; } = new HashSet<ContactAppointment>();
    public virtual ICollection<ContactAttachment> Attachments { get; set; } = new HashSet<ContactAttachment>();
    public virtual ICollection<ContactWorkOrder> WorkOrders { get; set; } = new HashSet<ContactWorkOrder>();

    public int? ParentID { get; set; }
    public virtual Contact? Parent { get; set; }
    public virtual ICollection<Contact> Children { get; set; } = new HashSet<Contact>();

    public virtual ICollection<ContactTeamMember> TeamMemberships { get; set; } = new HashSet<ContactTeamMember>();
}
public class ContactPhone
{
    public string? Title { get; set; }
    public string? Phone { get; set; }
    public bool IsPrimary { get; set; }
}

public class ContactEmail
{
    public string? Title { get; set; }
    public string? Email { get; set; }
    public bool IsPrimary { get; set; }
}

public class ContactAddress 
{
    public string? Title { get; set; }
    public string? Street { get; set; }
    public string? Area { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PinCode { get; set; }
    public bool IsPrimary { get; set; }
}

public class ContactConfiguration : IEntityTypeConfiguration<Contact>
{
    public void Configure(EntityTypeBuilder<Contact> builder)
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

        builder.HasIndex(e => e.Username);

    }
}

