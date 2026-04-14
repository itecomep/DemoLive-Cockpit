using MyCockpitView.WebApi.AssetModule.Services;


namespace MyCockpitView.WebApi.AssetModule.Extensions;

public static class AssetExtensions
{
    public static IServiceCollection RegisterAssetServices(
       this IServiceCollection services)
    {

    
        services.AddScoped<IAssetService, AssetService>();
        services.AddScoped<IAssetAttributeMasterService, AssetAttributeMasterService>();
        services.AddScoped<IAssetScheduleService, AssetScheduleService>();
        services.AddScoped<IAssetAttributeService, AssetAttributeService>();
        return services;
    }
}
