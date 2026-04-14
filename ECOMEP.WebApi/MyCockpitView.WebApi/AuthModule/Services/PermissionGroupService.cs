using DocumentFormat.OpenXml.Vml.Office;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.AuthModule.Services;
public interface IPermissionGroupService : IBaseEntityService<PermissionGroup>
{
    Task Update(PermissionGroup Entity);
}

public class PermissionGroupService : BaseEntityService<PermissionGroup>, IPermissionGroupService
{

    private readonly UserManager<User> _userManager;
    private readonly IContactService contactService;
    public PermissionGroupService(
        EntitiesContext db,
        UserManager<User> userManager ,
        IContactService contactService

        ) : base(db)
    {

        _userManager = userManager;
        this.contactService = contactService;
    }


    public async Task Update(PermissionGroup Entity)
    {
        var existing = await db.PermissionGroups
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.ID == Entity.ID);

        if (existing == null)
            throw new NotFoundException("Permission group not found.");

        var oldRoles = existing.RoleCodes?.Select(x => x.Trim()).ToList() ?? new List<string>();
        var newRoles = Entity.RoleCodes?.Select(x => x.Trim()).ToList() ?? new List<string>();

        // 3. Compute differences
        var rolesAdded = newRoles.Except(oldRoles).ToList();
        var rolesRemoved = oldRoles.Except(newRoles).ToList();

        db.Entry(Entity).State = EntityState.Modified;
        await db.SaveChangesAsync();

        var userMappings = await db.UserPermissionGroupMaps
            .Where(x => x.PermissionGroupID == Entity.ID)
            .ToListAsync();

        if (userMappings == null || !userMappings.Any())
            return;

        foreach (var map in userMappings)
        {
            // Get (User, PermissionGroup) using your existing method
            var (user, group) = await GetUserAndGroupAsync(map.UserID, map.PermissionGroupID);

            // Get user's current roles
            var userRoles = await _userManager.GetRolesAsync(user);

            // ----- REMOVE OLD ROLES -----
            // Only remove roles that the user actually has
            var rolesToRemove = rolesRemoved.Intersect(userRoles, StringComparer.OrdinalIgnoreCase).ToList();
            if (rolesToRemove.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!removeResult.Succeeded)
                {
                    var errors = string.Join(", ", removeResult.Errors.Select(e => e.Description));
                    throw new BadRequestException($"Failed to remove roles: {errors}");
                }
            }

            // ----- ADD NEW ROLES -----
            // Only add roles that the user doesn't already have
            var rolesToAdd = rolesAdded.Except(userRoles, StringComparer.OrdinalIgnoreCase).ToList();
            if (rolesToAdd.Any())
            {
                var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
                if (!addResult.Succeeded)
                {
                    var errors = string.Join(", ", addResult.Errors.Select(e => e.Description));
                    throw new BadRequestException($"Failed to add roles: {errors}");
                }
            }
        }
    }

    public async Task<(User user, PermissionGroup group)> GetUserAndGroupAsync(int userId, int permissionGroupID)
    {
        // Get contact for the given UserID
        var contact = await contactService.GetById(userId);
        if (contact == null)
            throw new NotFoundException("Contact not found for the given UserID.");

        // Get Identity user by username
        var user = await _userManager.Users
            .SingleOrDefaultAsync(u => u.UserName == contact.Username);

        if (user == null)
            throw new NotFoundException("User not found.");

        // Get permission group
   
        var group = await db.PermissionGroups.AsNoTracking().SingleOrDefaultAsync(x => x.ID == permissionGroupID);
        if (group == null)
            throw new NotFoundException("Permission group not found.");

        return (user, group);
    }

}