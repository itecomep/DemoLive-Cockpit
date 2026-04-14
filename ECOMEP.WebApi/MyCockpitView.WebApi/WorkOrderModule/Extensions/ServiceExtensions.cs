
using MyCockpitView.WebApi.WorkOrderModule.Services;

namespace MyCockpitView.WebApi.WorkOrderModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterWorkOrderServices(
     this IServiceCollection services)
    {

        //WorkOreder
        services.AddScoped<IWorkOrderService, WorkOrderService>();
        services.AddScoped<IWorkOrderMasterService, WorkOrderMasterService>();
        services.AddScoped<IWorkOrderAttachmentService, WorkOrderAttachmentService>();
        services.AddScoped<IWorkOrderMasterStageService, WorkOrderMasterStageService>();
        services.AddScoped<IWorkOrderStageService, WorkOrderStageService>();
        return services;
    }
}
