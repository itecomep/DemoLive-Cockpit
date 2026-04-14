namespace MyCockpitView.WebApi.Extensions;

public static class CorsExtensions
{

    public static void ConfigureCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                builder => builder
                .AllowAnyOrigin() //WithOrigins("http://www.something.com")
                .AllowAnyMethod() //WithMethods("POST", "GET")
                .AllowAnyHeader() //WithHeaders("accept", "content-type")
                );
        });
    }

}
