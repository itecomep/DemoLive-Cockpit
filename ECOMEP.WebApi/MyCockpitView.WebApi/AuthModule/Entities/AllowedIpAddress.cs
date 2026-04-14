using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.AuthModule.Entities
{
    public class AllowedIpAddress
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string IpAddress { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }

    public class AllowedIpAddressConfiguration : IEntityTypeConfiguration<AllowedIpAddress>
    {
        public void Configure(EntityTypeBuilder<AllowedIpAddress> builder)
        {
            builder.HasKey(e => e.ID);
            // builder.Property(e => e.UID).HasDefaultValueSql("NEWID()");
            builder.Property(e => e.IsActive).HasDefaultValue(true);
            builder.HasIndex(e => e.IpAddress);
        }
    }
}
