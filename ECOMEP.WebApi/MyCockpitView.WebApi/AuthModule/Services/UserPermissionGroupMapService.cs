using AutoMapper;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.LeaveModule.Services;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using System.IdentityModel.Tokens.Jwt;

using System.Text;

namespace MyCockpitView.WebApi.AuthModule.Services;

public interface IUserPermissionGroupMapService : IBaseEntityService<UserPermissionGroupMap>
{
    Task<UserPermissionGroupMapDto?> CreatePermissionGroupMap(UserPermissionGroupMapDto dto);
    Task DeleteUserPermissionGroupMap(int id);
    Task<List<UserPermissionGroupMapDto>> GetByPermissionGroupID(int permissionGroupId);
    Task<(User user, PermissionGroup group)> GetUserAndGroupAsync(int userId, int permissionGroupId);

}

public class UserPermissionGroupMapService : BaseEntityService<UserPermissionGroupMap>, IUserPermissionGroupMapService
{
    private readonly EntitiesContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IMapper mapper;
    private readonly IContactService contactService;
  

    public UserPermissionGroupMapService(
        EntitiesContext db,
        UserManager<User> userManager,
        IContactService contactService,
       
        IMapper mapper) : base(db)
    {
        _userManager = userManager;
        this.contactService = contactService;
     
        this.mapper = mapper;
    }


    public async Task<UserPermissionGroupMapDto?> CreatePermissionGroupMap(UserPermissionGroupMapDto dto)
    {
        var entity = mapper.Map<UserPermissionGroupMap>(dto);
        var id = await Create(entity);
        var resultDto = mapper.Map<UserPermissionGroupMapDto>(
                await Get().SingleOrDefaultAsync(i => i.ID == id)
            );
        if (resultDto == null)
            throw new BadRequestException($"{nameof(UserPermissionGroupMap)} could not be created!");

        var (user, group) = await GetUserAndGroupAsync(entity.UserID, entity.PermissionGroupID);
        var userRoles = await _userManager.GetRolesAsync(user);

        // Get only the roles that the user doesn't already have
        var rolesToAdd = group.RoleCodes.Except(userRoles, StringComparer.OrdinalIgnoreCase);

        // Assign only the new roles
        IdentityResult? result = null;
        if (rolesToAdd.Any())
        {
            result = await _userManager.AddToRolesAsync(user, rolesToAdd);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new BadRequestException($"Failed to assign roles: {errors}");
            }
        }

        return resultDto;
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


    public async Task DeleteUserPermissionGroupMap(int id)
    {

        var _result = mapper.Map<UserPermissionGroupMapDto>(
           await Get().SingleOrDefaultAsync(i => i.ID == id)
       );

        if (_result == null) throw new NotFoundException($"{nameof(UserPermissionGroupMap)} not found!");
        // ONE helper call
        var (user, group) = await GetUserAndGroupAsync(_result.UserID, _result.PermissionGroupID);

        // Remove roles
        var result = await _userManager.RemoveFromRolesAsync(user, group.RoleCodes);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new BadRequestException($"Failed to assign roles: {errors}");
        }

        await Delete(id);

    }

    public async Task<List<UserPermissionGroupMapDto>> GetByPermissionGroupID(int permissionGroupId)
    {
        var items = await Get()
            .Where(x => x.PermissionGroupID == permissionGroupId)
            .ToListAsync();

        if (items == null || !items.Any())
            return null;

        return mapper.Map<List<UserPermissionGroupMapDto>>(items);
    }

}