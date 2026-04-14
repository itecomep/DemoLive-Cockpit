
using MyCockpitView.WebApi.LeaveModule.Services;

namespace MyCockpitView.WebApi.LeaveModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterLeaveServices(
     this IServiceCollection services)
    {

        //Leave
        services.AddScoped<ILeaveService, LeaveService>();
        services.AddScoped<IHolidayMasterService, HolidayMasterService>();
        services.AddScoped<ILeaveAttachmentService, LeaveAttachmentService>();
        return services;
    }
}
