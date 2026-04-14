using MyCockpitView.WebApi.RequestTicketModule.Services;

namespace MyCockpitView.WebApi.RequestTicketModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterRequestTicketServices(
     this IServiceCollection services)
    {

        //RequestTicket
        services.AddScoped<IRequestTicketService, RequestTicketService>();
        services.AddScoped<IRequestTicketAssigneeService, RequestTicketAssigneeService>();
        services.AddScoped<IRequestTicketAttachmentService, RequestTicketAttachmentService>();

        return services;
    }
}
