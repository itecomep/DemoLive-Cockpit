using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MyCockpitView.WebApi.Exceptions;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        HttpStatusCode statusCode;
        var exceptionType = ex.GetType();

        if (exceptionType == typeof(NotFoundException))
        {
            statusCode = HttpStatusCode.NotFound;
        }
        else if (exceptionType == typeof(KeyNotFoundException))
        {
            statusCode = HttpStatusCode.BadRequest;
        }
        else if (exceptionType == typeof(BadRequestException))
        {
            statusCode = HttpStatusCode.BadRequest;
        }
        else if (exceptionType == typeof(NotImplementedException))
        {
            statusCode = HttpStatusCode.NotImplemented;
        }
        else if (exceptionType == typeof(UnAuthorizedAccesException))
        {
            statusCode = HttpStatusCode.Unauthorized;
        }
        else
        {
            statusCode = HttpStatusCode.InternalServerError;
        }

        var exceptionResult = JsonSerializer.Serialize(new { error = ex.Message, stackTrace = ex.StackTrace },
        new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            //WriteIndented = true,
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
        });
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        return context.Response.WriteAsync(exceptionResult);
    }
}
