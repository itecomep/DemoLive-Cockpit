
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.AuthModule.Entities;

public class LoginSession : BaseEntity
{

    [Required]
    public int ContactID { get; set; }
    public virtual Contact? Contact { get; set; }
    [Required]
    public string? Username { get; set; }
    public string? Person { get; set; }
    public string? Token { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? OS { get; set; }

    public string? BrowserName { get; set; }
    public string? Device { get; set; }
    public string? DeviceType { get; set; }
    public DateTime? LogoutDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsOTPRequired { get; set; }
    public bool IsOTPVerified { get; set; }
    public string? OTP { get; set; }
    public string? GeoLocation { get; set; }

    [NotMapped]
    public bool IsOutsideIP { get; set; }
}

public class LoginSessionConfiguration : IEntityTypeConfiguration<LoginSession>
{
    public void Configure(EntityTypeBuilder<LoginSession> builder)
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
        builder.HasIndex(e => e.Username);
        builder.HasIndex(e => e.ContactID);
        builder.HasIndex(e => e.IsOTPVerified);
        builder.HasIndex(e => e.IsActive);
        builder.HasIndex(e => e.IsOTPRequired);
        builder.HasIndex(e => e.Username);
    }
}

