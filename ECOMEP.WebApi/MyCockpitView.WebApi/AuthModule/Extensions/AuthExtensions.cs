using MyCockpitView.WebApi.AuthModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;

namespace MyCockpitView.WebApi.AuthModule.Extensions;

public static class AuthExtensions
{
    public static IServiceCollection RegisterAuthServices(
       this IServiceCollection services)
    {

        services.AddScoped<ITokenGenerator, TokenGenerator>();
        services.AddScoped<IAccessTokenService, AccessTokenService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<ILoginSessionService, LoginSessionService>();
        services.AddScoped<IPermissionGroupService, PermissionGroupService>();
        services.AddScoped<IUserPermissionGroupMapService, UserPermissionGroupMapService>();
        return services;
    }
}
