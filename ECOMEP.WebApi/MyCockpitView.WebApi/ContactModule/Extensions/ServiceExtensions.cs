
using MyCockpitView.WebApi.ContactModule.Services;

namespace MyCockpitView.WebApi.ContactModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterContactServices(
     this IServiceCollection services)
    {

        //Contact
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IContactAssociationService, ContactAssociationService>();
        services.AddScoped<IContactAppointmentService, ContactAppointmentService>();
        services.AddScoped<IContactAttachmentService, ContactAttachmentService>();
        services.AddScoped<IContactAppointmentAttachmentService, ContactAppointmentAttachmentService>();
        services.AddScoped<IContactWorkOrderService, ContactWorkOrderService>();
        services.AddScoped<IContactWorkOrderAttachmentService, ContactWorkOrderAttachmentService>();
        services.AddScoped<IContactWorkOrderPaymentService, ContactWorkOrderPaymentService>();
        services.AddScoped<IContactWorkOrderPaymentAttachmentService, ContactWorkOrderPaymentAttachmentService>();
        services.AddScoped<IContactTeamService, ContactTeamService>();
        services.AddScoped<IContactTeamMemberService, ContactTeamMemberService>();
        return services;
    }
}
