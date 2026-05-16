using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MyCockpitView.WebApi.NotificationModule.Services
{
    public class BirthdayBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public BirthdayBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var service = scope.ServiceProvider
                        .GetRequiredService<BirthdayNotificationService>();

                    await service.CheckAndSendBirthdayNotifications();
                }

                // run every 1 hour
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}