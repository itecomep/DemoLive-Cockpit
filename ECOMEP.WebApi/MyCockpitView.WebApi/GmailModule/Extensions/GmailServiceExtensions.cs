using Microsoft.Extensions.DependencyInjection;
using MyCockpitView.WebApi.GmailModule.Services;

namespace MyCockpitView.WebApi.GmailModule.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection RegisterGmailServices(
        this IServiceCollection services)
    {
        services.AddHttpClient<IGmailService, GmailService>();

        return services;
    }
}
