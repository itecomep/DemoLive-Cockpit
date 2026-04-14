namespace MyCockpitView.WebApi.Exceptions;

public static class ExceptionExtensions
{
    public static IApplicationBuilder AddGlobalErrorHandler(this IApplicationBuilder app) => app.UseMiddleware<ExceptionMiddleware>();
}
