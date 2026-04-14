using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyCockpitView.WebApi.Entities
{
    public class BypassAllowedUserConfiguration : IEntityTypeConfiguration<BypassAllowedUser>
    {
        public void Configure(EntityTypeBuilder<BypassAllowedUser> builder)
        {
            builder.ToTable("BypassAllowedUsers");

            builder.HasKey(x => x.ID);

            builder.Property(x => x.Username)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.HasIndex(x => x.Username)
                   .IsUnique();

            builder.Property(x => x.IsActive)
                   .IsRequired();

            builder.Property(x => x.CreatedAt)
                   .IsRequired();

              builder.Ignore(x => x.Created);
              builder.Ignore(x => x.CreatedBy);
              builder.Ignore(x => x.CreatedByContactID);
              builder.Ignore(x => x.Description);
              builder.Ignore(x => x.IsDeleted);
              builder.Ignore(x => x.IsReadOnly);
              builder.Ignore(x => x.IsVersion);
              builder.Ignore(x => x.Modified);
              builder.Ignore(x => x.ModifiedBy);
              builder.Ignore(x => x.ModifiedByContactID);
              builder.Ignore(x => x.OrderFlag);
              builder.Ignore(x => x.ParentVersionID);
              builder.Ignore(x => x.StatusFlag);
              builder.Ignore(x => x.TypeFlag);
              builder.Ignore(x => x.UID);
              builder.Ignore(x => x._searchTags);
              builder.Ignore(x => x.SearchTags);
        }
    }
}
