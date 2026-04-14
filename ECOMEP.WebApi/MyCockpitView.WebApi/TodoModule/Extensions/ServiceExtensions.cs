using MyCockpitView.WebApi.TodoModule.Services;

namespace MyCockpitView.WebApi.TodoModule.Extensions;

public static class ServiceExtensions
{

    public static IServiceCollection RegisterTodoServices(
     this IServiceCollection services)
    {

        //Todo
        services.AddScoped<ITodoService, TodoService>();
        services.AddScoped<ITodoAgendaService, TodoAgendaService>();
        services.AddScoped<ITodoAttachmentService, TodoAttachmentService>();

        return services;
    }
}
