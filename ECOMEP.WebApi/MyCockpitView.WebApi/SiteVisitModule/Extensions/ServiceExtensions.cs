
using MyCockpitView.WebApi.SiteVisitModule.Services;

namespace MyCockpitView.WebApi.SiteVisitModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterSiteVisitServices(
     this IServiceCollection services)
    {

        //SiteVisit
        services.AddScoped<ISiteVisitService, SiteVisitService>();
        services.AddScoped<ISiteVisitAttendeeService, SiteVisitAttendeeService>();
        services.AddScoped<ISiteVisitAgendaService, SiteVisitAgendaService>();
        services.AddScoped<ISiteVisitAgendaAttachmentService, SiteVisitAgendaAttachmentService>();

        return services;
    }
}