
namespace MyCockpitView.WebApi.ActivityModule;

public static class ActivityExtensions
{

    public static IServiceCollection RegisterActivityServices(
     this IServiceCollection services)
    {
        services.AddScoped<IActivityService, ActivityService>();

        return services;
    }
}
