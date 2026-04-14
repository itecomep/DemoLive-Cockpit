
using MyCockpitView.WebApi.PackageModule.Services;

namespace MyCockpitView.WebApi.PackageModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterPackageServices(
     this IServiceCollection services)
    {

        //Meeting
        services.AddScoped<IPackageService, PackageService>();
        services.AddScoped<IPackageAttachmentService, PackageAttachmentService>();
        services.AddScoped<IPackageContactService, PackageContactService>();
        services.AddScoped<IPackageStudioWorkService, PackageStudioWorkService>();
        services.AddScoped<IPackageStudioWorkAttachmentService, PackageStudioWorkAttachmentService>();

        return services;
    }
}
