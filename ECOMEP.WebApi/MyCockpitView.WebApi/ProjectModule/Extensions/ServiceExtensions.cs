

using MyCockpitView.WebApi.ProjectInwardModule.Services;
using MyCockpitView.WebApi.ProjectModule.Services;

namespace MyCockpitView.WebApi.ProjectModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterProjectServices(
     this IServiceCollection services)
    {

        //Project
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IProjectAttachmentService, ProjectAttachmentService>();
        services.AddScoped<IProjectAssociationService, ProjectAssociationService>();
        services.AddScoped<IProjectInwardService, ProjectInwardService>();
        services.AddScoped<IProjectInwardAttachmentService, ProjectInwardAttachmentService>();
        services.AddScoped<IProjectNoteService, ProjectNoteService>();
        services.AddScoped<IProjectAreaService, ProjectAreaService>();
        services.AddScoped<IProjectAreaStageService, ProjectAreaStageService>();
        services.AddScoped<IProjectStageMasterService, ProjectStageMasterService>();
        services.AddScoped<IProjectStagMasterDeliveryService, ProjectStageMasterDeliveryService>();
        services.AddScoped<IProjectAreaStageDeliveryService, ProjectAreaStageDeliveryService>();
        services.AddScoped<IProjectStageService, ProjectStageService>();
        services.AddScoped<IProjectStageDeliveryService, ProjectStageDeliveryService>();
        services.AddScoped<IProjectBillService, ProjectBillService>();
        services.AddScoped<IProjectWorkOrderService, ProjectWorkOrderService>();
        services.AddScoped<IProjectWorkOrderAttachmentService, ProjectWorkOrderAttachmentService>(); 
        services.AddScoped<IProjectWorkOrderSegmentService, ProjectWorkOrderSegmentService>();
        services.AddScoped<IProjectBillPaymentService, ProjectBillPaymentService>();
        services.AddScoped<IProjectBillPaymentAttachmentService, ProjectBillPaymentAttachmentService>();
        services.AddScoped<IProjectTeamService, ProjectTeamService>();
        services.AddScoped<IProjectWorkOrderServiceAmountService, ProjectWorkOrderServiceAmountService>();
        return services;
    }
}
