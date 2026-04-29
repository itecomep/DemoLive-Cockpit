using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.NotificationModule;
using MyCockpitView.WebApi.NotificationModule.Entities;

namespace MyCockpitView.WebApi.NotificationModule.Services
{
    public class BirthdayNotificationService
    {
        private readonly EntitiesContext _db;
        private readonly IHubContext<NotificationHub> _hub;

        public BirthdayNotificationService(
            EntitiesContext db,
            IHubContext<NotificationHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        public async Task CheckAndSendBirthdayNotifications()
        {
            var today = DateTime.UtcNow.Date;

            //prevent duplicate sending for same day
            var alreadySent = await _db.Notifications.AnyAsync(n =>
                n.Source == "birthday" &&
                n.CreatedAt.Date == today);

            if (alreadySent)
                return;

            //get today's birthdays
            var birthdays = await _db.Contacts
             .Where(c => c.Birth.HasValue &&
                         c.Birth.Value.Month == today.Month &&
                         c.Birth.Value.Day == today.Day &&
                         !c.IsDeleted)
             .Where(c => _db.ContactAppointments.Any(a =>
                 a.ContactID == c.ID &&
                 !a.IsDeleted &&
                 (a.StatusFlag == 0 || a.StatusFlag == 2)
             ))

             .ToListAsync();

            if (!birthdays.Any())
                return;

            var allUsers = await _db.Contacts
                .Where(x => !x.IsDeleted && !string.IsNullOrEmpty(x.Username))
                .ToListAsync();

            foreach (var person in birthdays)
            {
                foreach (var user in allUsers)
                {
                    var message = user.Username == person.Username
                        ? $"🎂 Happy Birthday {person.FirstName}!"
                        : $"🎉 Today is {person.FirstName}'s birthday";

                    var notification = new Notification
                    {
                        Username = user.Username,
                        Message = message,
                        Source = "birthday",
                        CreatedAt = DateTime.UtcNow
                    };

                    _db.Notifications.Add(notification);

                    if (NotificationHub.UserConnections.TryGetValue(user.Username, out var connectionId))
                    {
                        await _hub.Clients.Client(connectionId)
                            .SendAsync("ReceiveNotification", notification);
                    }
                }
            }
            await _db.SaveChangesAsync();
        }
    }
}