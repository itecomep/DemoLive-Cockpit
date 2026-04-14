
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AuthModule.Entities;

public class UserPermissionGroupMap : BaseEntity
{
    public int UserID { get; set; }
    public int PermissionGroupID { get; set; }
}
public class UserPermissionGroupMapConfiguration : BaseEntityConfiguration<UserPermissionGroupMap>, IEntityTypeConfiguration<UserPermissionGroupMap>
{
    public void Configure(EntityTypeBuilder<UserPermissionGroupMap> builder)
    {
        base.Configure(builder);

        builder.HasIndex(e => e.UserID);
        builder.HasIndex(e => e.PermissionGroupID);

    }
}