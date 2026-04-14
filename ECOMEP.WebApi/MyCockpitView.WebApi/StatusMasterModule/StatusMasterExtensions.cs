
namespace MyCockpitView.WebApi.StatusMasterModule;

public static class StatusMasterExtensions
{

    public static IServiceCollection RegisterStatusMasterServices(
     this IServiceCollection services)
    {
        services.AddScoped<IStatusMasterService, StatusMasterService>();

        return services;
    }
}
