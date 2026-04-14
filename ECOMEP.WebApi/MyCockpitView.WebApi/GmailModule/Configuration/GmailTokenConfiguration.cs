using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.WebApi.GmailModule.Entities;

namespace MyCockpitView.WebApi.GmailModule.Configurations
{
    public class GmailTokenConfiguration : IEntityTypeConfiguration<GmailToken>
    {
        public void Configure(EntityTypeBuilder<GmailToken> entity)
        {
            entity.ToTable("GmailTokens");

            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.ProjectId);

            entity.Property(e => e.AccessToken)
                  .IsRequired();

            entity.Property(e => e.RefreshToken)
                  .IsRequired();

            entity.Property(e => e.ExpiryTime)
                  .HasColumnType("datetime2(7)")
                  .IsRequired();

            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("SYSUTCDATETIME()")
                  .IsRequired();

            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("SYSUTCDATETIME()")
                  .IsRequired();
        }
    }
}
