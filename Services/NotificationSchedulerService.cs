using Microsoft.EntityFrameworkCore;
using AplikasiSurat.Data;

namespace AplikasiSurat.Services
{
    public class NotificationSchedulerService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private DateTime _lastRun = DateTime.MinValue;

        public NotificationSchedulerService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.Now;
                
                // Check if it's the 1st of the month and we haven't run today (or this month)
                // Also setting time to specific hour (e.g., 9 AM) would be better, but user just said "tanggal 1"
                // To be safe, we check if Day == 1 and we haven't sent for this month.
                
                if (now.Day == 1 && _lastRun.Month != now.Month)
                {
                    await SendNotificationsAsync();
                    _lastRun = now;
                }

                // Check every hour
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        private async Task SendNotificationsAsync()
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                    await notificationService.SendNotificationsAsync(force: false);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in notification scheduler: {ex.Message}");
            }
        }
    }
}
