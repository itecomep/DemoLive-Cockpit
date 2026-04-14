using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;


namespace MyCockpitView.WebApi.CompanyModule;

public class Company : BaseEntity
{
    
    [StringLength(255)]
    public string? Title { get; set; }

    [StringLength(255)]
    public string? Initials { get; set; }
    [StringLength(255)]
    public string? GSTIN { get; set; }
    [StringLength(255)]
    public string? GSTStateCode { get; set; }
    [StringLength(255)]
    public string? PAN {  get; set; }
    [StringLength(255)]
    public string? TAN { get; set; }
    [StringLength(255)]
    public string? UDHYAM { get; set; }
    public string? LogoUrl { get; set; }
    [StringLength(255)]
    public string? Bank { get; set; }
    public string? BankBranch { get; set; }
    [StringLength(255)]
    public string? BankIFSCCode { get; set; }
    [StringLength(255)]
    public string? SwiftCode { get; set; }
    [StringLength(255)]
    public string? BankAccount { get; set; }
    public string? Address { get; set; }
    public string? SignStampUrl { get; set; }
    [Precision(18,2)] 
    public decimal VHrRate { get; set; } = 0.0m;


}

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
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

    }
}