using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.MeetingModule.Entities;

public class Meeting : BaseEntity
{
    public bool IsReadOnly { get; set; }
    public int? ParentID { get; set; }
   
    [Required]
    [StringLength(255)]
    public string? Title { get; set; }


    [StringLength(255)]
    public string? Code { get; set; }

    public string? Remark { get; set; }

    [Required]
    public string Purpose { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [StringLength(255)]
    public string? Location { get; set; }
    public DateTime? ClosedOn { get; set; }
    public DateTime? FinalizedOn { get; set; }
    public bool? IsFollowUp { get; set; }
    public string? FollowUpRemark { get; set; }

    [Precision(18,2)] public decimal Version { get; set; }
    public int ContactID { get; set; }
    public virtual Contact? Contact { get; set; }
    public virtual ICollection<MeetingAttachment> Attachments { get; set; } = new List<MeetingAttachment>();
    public virtual ICollection<MeetingAttendee> Attendees { get; set; }= new HashSet<MeetingAttendee>();

    public virtual ICollection<MeetingAgenda> Agendas { get; set; }= new HashSet<MeetingAgenda>();
    public virtual ICollection<MeetingVoucher> Vouchers { get; set; } = new HashSet<MeetingVoucher>();

    public string? GmapsJson { get; set; }

    [NotMapped]
    public List<MeetingGmap> Gmaps
    {
        get => GmapsJson != null && GmapsJson != string.Empty ? JsonConvert.DeserializeObject<List<MeetingGmap>>(GmapsJson) : new List<MeetingGmap>();
        set => GmapsJson = JsonConvert.SerializeObject(value);
    }

    public string? DocumentsCarriedJson { get; set; }

    [NotMapped]
    public List<MeetingDocumentCarried> DocumentsCarried
    {
        get => DocumentsCarriedJson != null && DocumentsCarriedJson != string.Empty ? JsonConvert.DeserializeObject<List<MeetingDocumentCarried>>(DocumentsCarriedJson) : new List<MeetingDocumentCarried>();
        set => DocumentsCarriedJson = JsonConvert.SerializeObject(value);
    }

    public int? ProjectID { get; set; }

    public int Annexure { get; set; }
}


public class MeetingGmap
{
    public string? Title { get; set; }
    public string? Url { get; set; }
}


public class MeetingDocumentCarried
{
    public string? Title { get; set; }
}

    public class MeetingConfiguration : IEntityTypeConfiguration<Meeting>
{
    public void Configure(EntityTypeBuilder<Meeting> builder)
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
        builder.HasIndex(e => e.Code);
        builder.HasIndex(e => e.StartDate);
        builder.HasIndex(e => e.EndDate);
        builder.HasIndex(e => e.ProjectID);

    }
}