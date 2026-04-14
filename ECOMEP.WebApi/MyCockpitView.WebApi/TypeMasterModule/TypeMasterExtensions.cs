namespace MyCockpitView.WebApi.TypeMasterModule;

public static class TypeMasterExtensions
{

    public static IServiceCollection RegisterTypeMasterServices(
     this IServiceCollection services)
    {
        services.AddScoped<ITypeMasterService, TypeMasterService>();

        return services;
    }
}
