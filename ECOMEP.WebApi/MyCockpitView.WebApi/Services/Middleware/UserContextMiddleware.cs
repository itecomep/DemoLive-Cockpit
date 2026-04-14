using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Middleware;

public class UserContextMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserContextMiddleware> _logger;

    public UserContextMiddleware(RequestDelegate next, ILogger<UserContextMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ICurrentUserService currentUserService)
    {
        try
        {
            // Get and cache username at the start of request
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var username = context.User.Identity.Name;
                if (!string.IsNullOrEmpty(username))
                {
                    currentUserService.SetCachedUsername(username);
                    _logger.LogDebug("Username {Username} cached for request", username);
                }
            }

            await _next(context);
        }
        finally
        {
            // Clear the cached username at the end of request
            currentUserService.SetCachedUsername(null);
        }
    }
}
