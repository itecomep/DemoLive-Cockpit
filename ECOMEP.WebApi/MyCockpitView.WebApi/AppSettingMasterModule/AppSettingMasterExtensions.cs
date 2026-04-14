
namespace MyCockpitView.WebApi.AppSettingMasterModule;

public static class AppSettingMasterExtensions
{

    public static IServiceCollection RegisterAppSettingMasterServices(
     this IServiceCollection services)
    {
        services.AddScoped<IAppSettingMasterService, AppSettingMasterService>();

        return services;
    }
}
