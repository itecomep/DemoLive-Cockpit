using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.Settings;

namespace MyCockpitView.WebApi.Extensions;

public static class SQLServerExtensions
{
    public static IServiceCollection AddSqlServerDb(
       this IServiceCollection services,
       SqlServerDbSettings sqlServerDbSettings)
    {
        var dataAssemblyName = typeof(EntitiesContext).Assembly.GetName().Name;
        var connectionstring = $"Server={sqlServerDbSettings.Server};User={sqlServerDbSettings.Username};Password={sqlServerDbSettings.Password};Database={sqlServerDbSettings.Database};TrustServerCertificate={sqlServerDbSettings.TrustServerCertificate};Encrypt={sqlServerDbSettings.Encrypt};MultipleActiveResultSets=True;";

        Console.WriteLine($"SQLConn:{connectionstring}");
        services.AddDbContext<EntitiesContext>(options =>
                                        options.UseSqlServer(connectionstring,
                                        x => x.MigrationsAssembly(dataAssemblyName).UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery).EnableRetryOnFailure()
         ))
            .AddIdentity<User, Role>(options =>
        {
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(1d);
            options.Lockout.MaxFailedAccessAttempts = 5;
        })
                .AddEntityFrameworkStores<EntitiesContext>()
                .AddDefaultTokenProviders();

        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddScoped<EntitiesContext, EntitiesContext>();

        return services;
    }

}
