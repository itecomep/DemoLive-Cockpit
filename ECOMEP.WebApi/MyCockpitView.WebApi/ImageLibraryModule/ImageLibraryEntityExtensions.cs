using MyCockpitView.WebApi.ImageLibraryModule.Services;

namespace MyCockpitView.WebApi.ImageLibraryModule;

public static class ImageLibraryEntityExtensions
{

    public static IServiceCollection RegisterImageLibraryEntityServices(
     this IServiceCollection services)
    {

        services.AddScoped<IImageLibraryEntityService, ImageLibraryEntityService>();

        return services;
    }
}
