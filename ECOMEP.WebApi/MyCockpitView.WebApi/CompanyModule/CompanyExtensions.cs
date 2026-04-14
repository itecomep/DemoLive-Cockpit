namespace MyCockpitView.WebApi.CompanyModule;

public static class CompanyExtensions
{

    public static IServiceCollection RegisterCompanyServices(
     this IServiceCollection services)
    {
        services.AddScoped<ICompanyService, CompanyService>();

        return services;
    }
}
