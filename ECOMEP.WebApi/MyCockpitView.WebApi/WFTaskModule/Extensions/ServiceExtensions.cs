using MyCockpitView.WebApi.WFTaskModule.Services;

namespace MyCockpitView.WebApi.WFTaskModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterWFTaskServices(
     this IServiceCollection services)
    {

        //WFTask
        services.AddScoped<IWFTaskService, WFTaskService>();
        services.AddScoped<IWFStageService, WFStageService>();
        services.AddScoped<IAssessmentMasterService, AssessmentMasterService>();
        services.AddScoped<IAssessmentService, AssessmentService>();
        services.AddScoped<ITimeEntryService, TimeEntryService>();
        services.AddScoped<IWFTaskAttachmentService, WFTaskAttachmentService>();

        return services;
    }
}
