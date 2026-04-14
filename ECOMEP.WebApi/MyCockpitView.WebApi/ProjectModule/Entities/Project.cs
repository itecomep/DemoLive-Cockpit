
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.Entities;

public class Project : BaseEntity
{
    [StringLength(255)]
    public string? Code { get; set; }
    [StringLength(255)]
    public string? Title { get; set; }
    [StringLength(255)]
    public string? Location { get; set; }
    [StringLength(255)]
    public string? City { get; set; }
    [StringLength(255)]
    public string? State { get; set; }
    [StringLength(255)]
    public string? Country { get; set; }
    [StringLength(255)]
    public string? StateCode { get; set; }
    public string? PinCode { get; set; }
    [StringLength(255)]
    public string? PAN { get; set; }
    [StringLength(255)]
    public string? TAN { get; set; }
    [StringLength(255)]
    public string? GSTIN { get; set; }
    [StringLength(255)]
    public string? HSN { get; set; }
    [StringLength(255)]
    public string? ARN { get; set; }
    public DateTime? ContractStartDate { get; set; }
    public string? Comment { get; set; }
    public DateTime? ContractCompletionDate { get; set; }

    public DateTime? ExpectedCompletionDate { get; set; }

    public DateTime? InquiryConvertionDate { get; set; }
    
    [Precision(18,2)] public decimal Fee { get; set; }

    
    [Precision(18,2)] public decimal Discount { get; set; }
    [StringLength(255)]
    public string? BillingTitle { get; set; }

    public int? CompanyID { get; set; }
    public virtual Company? Company { get; set; }
    [StringLength(500)]
    public string? Segment { get; set; }

    [StringLength(500)]
    public string? Typology { get; set; }
    public int? ClientContactID { get; set; }
    public virtual Contact? ClientContact { get; set; }

    public int? ReferredByContactID { get; set; }
    public virtual Contact? ReferredByContact { get; set; }

    public int? GroupCompanyContactID { get; set; }
    public virtual Contact? GroupCompanyContact { get; set; }

    public int? GroupContactID { get; set; }
    public virtual Contact? GroupContact { get; set; }

    public int? ProjectManagerContactID { get; set; }
    public virtual Contact? ProjectManagerContact { get; set; }
    public int? AssistantProjectManagerContactID { get; set; }
    public virtual Contact? AssistantProjectManagerContact { get; set; }
    [Precision(18,2)] public decimal ExpectedMHr { get; set; }
    public string? ScopeOfWork { get; set; }

    public virtual ICollection<ProjectInward> Inwards { get; set; } = new HashSet<ProjectInward>();
    public virtual ICollection<ProjectNote> Notes { get; set; } = new HashSet<ProjectNote>();
    public virtual ICollection<ProjectAttachment> Attachments { get; set; } = new HashSet<ProjectAttachment>();
    public virtual ICollection<ProjectAssociation> Associations { get; set; } = new HashSet<ProjectAssociation>();

    public virtual ICollection<ProjectArea> Areas { get; set; } = new HashSet<ProjectArea>();

    public virtual ICollection<ProjectStage> Stages { get; set; } = new HashSet<ProjectStage>();

    public int? ParentID { get; set; }
    public virtual Project? Parent { get; set; }
    public virtual ICollection<Project> Children { get; set; } = new HashSet<Project>();

    public virtual ICollection<ProjectBill> Bills { get; set; }= new HashSet<ProjectBill>();
    public virtual ICollection<ProjectWorkOrder> WorkOrders { get; set; } = new List<ProjectWorkOrder>();

    //public int? TeamID { get; set; }

    public virtual ICollection<ProjectTeam> Teams { get; set; } = new List<ProjectTeam>();
}


public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
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
   
        // Relationships
        builder.HasOne(p => p.Company)
            .WithMany()
            .HasForeignKey(p => p.CompanyID)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.ClientContact)
            .WithMany()
            .HasForeignKey(p => p.ClientContactID)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.GroupContact)
            .WithMany()
            .HasForeignKey(p => p.GroupContactID)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.ProjectManagerContact)
           .WithMany()
           .HasForeignKey(p => p.ProjectManagerContactID)
           .IsRequired(false)
           .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.AssistantProjectManagerContact)
          .WithMany()
          .HasForeignKey(p => p.AssistantProjectManagerContactID)
          .IsRequired(false)
          .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.ReferredByContact)
            .WithMany()
            .HasForeignKey(p => p.ReferredByContactID)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.GroupCompanyContact)
            .WithMany()
            .HasForeignKey(p => p.GroupCompanyContactID)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.Location);
        builder.HasIndex(e => e.BillingTitle);
        builder.HasIndex(e => e.Title);
        builder.HasIndex(e => e.Code);
        builder.HasIndex(e => e.Segment);
    }
}
