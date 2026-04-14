using Microsoft.AspNetCore.Http;
using MyCockpitView.WebApi.AuthModule.Services;
using System.Threading.Tasks;

namespace MyCockpitView.WebApi.Middleware
{
  public class OutsideIpAccessMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceProvider _serviceProvider;

    public OutsideIpAccessMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
    {
        _next = next;
        _serviceProvider = serviceProvider;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Create scope for scoped services
        using var scope = _serviceProvider.CreateScope();
        var loginSessionService = scope.ServiceProvider.GetRequiredService<ILoginSessionService>();

        // Check token
        if (context.Request.Headers.TryGetValue("Authorization", out var authHeader))
        {
            var token = authHeader.ToString().Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                var session = await loginSessionService.GetByToken(token);

                if (session != null && session.IsOutsideIP)
                {
                    var path = context.Request.Path.Value?.ToLower() ?? "";
                    if (!path.StartsWith("/leave-list"))
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        await context.Response.WriteAsync("Access denied: Only Leave module is accessible from outside IP.");
                        return;
                    }
                }
            }
        }

        await _next(context);
    }
}


    // Extension method for convenience
    public static class OutsideIpAccessMiddlewareExtensions
    {
        public static IApplicationBuilder UseOutsideIpAccess(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<OutsideIpAccessMiddleware>();
        }
    }
}
