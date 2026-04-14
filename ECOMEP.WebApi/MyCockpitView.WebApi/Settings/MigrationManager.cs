using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.GmailModule.Data;

namespace MyCockpitView.WebApi.Settings;

public static class MigrationManager
{
    public static WebApplication MigrateDatabase(this WebApplication webApp)
    {
        // using (var scope = webApp.Services.CreateScope())
        // {
        //     using (var appContext = scope.ServiceProvider.GetRequiredService<EntitiesContext>())
        //     {
        //         try
        //         {
        //             appContext.Database.Migrate();
        //             SeedData(appContext);
        //         }
        //         catch (Exception ex)
        //         {
        //             //Log errors or do anything you think it's needed
        //             // throw;
        //             Console.WriteLine($"DB Migration Failed |  {ex.Message}");
        //         }
        //     }
        // }
        using (var scope = webApp.Services.CreateScope())
        {
            try
            {
                var appContext = scope.ServiceProvider
                    .GetRequiredService<EntitiesContext>();

                appContext.Database.Migrate();
                SeedData(appContext);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Main DB Migration Failed | {ex.Message}");
            }

            try
            {
                var gmailContext = scope.ServiceProvider
                    .GetRequiredService<GmailEmailContext>();

                gmailContext.Database.Migrate();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gmail DB Migration Failed | {ex.Message}");
            }
        }

        return webApp;
    }

    public static void SeedData(EntitiesContext context)
    {

        Console.WriteLine("Seeding Data....");
        try
        {

        }
        catch (Exception ex)
        {
            //Log errors or do anything you think it's needed
            // throw;
            Console.WriteLine($"DB Seeding Failed |  {ex.Message}");
        }
    }
}
