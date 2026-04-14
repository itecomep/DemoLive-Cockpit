
using MyCockpitView.WebApi.MeetingModule.Services;

namespace MyCockpitView.WebApi.MeetingModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterMeetingServices(
     this IServiceCollection services)
    {

        //Meeting
        services.AddScoped<IMeetingService, MeetingService>();
        services.AddScoped<IMeetingAttendeeService, MeetingAttendeeService>();
        services.AddScoped<IMeetingAgendaService, MeetingAgendaService>();
        services.AddScoped<IMeetingAgendaAttachmentService, MeetingAgendaAttachmentService>();
        services.AddScoped<IMeetingAttachmentService, MeetingAttachmentService>();
        services.AddScoped<IMeetingVoucherService, MeetingVoucherService>();
        services.AddScoped<IMeetingVoucherAttachmentService, MeetingVoucherAttachmentService>();
        return services;
    }
}
