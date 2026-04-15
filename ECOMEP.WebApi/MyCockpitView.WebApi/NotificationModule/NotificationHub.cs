using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace MyCockpitView.WebApi.NotificationModule
{
    public class NotificationHub : Hub
    {
        public static Dictionary<string, string> UserConnections =
    new(StringComparer.OrdinalIgnoreCase);

        public override async Task OnConnectedAsync()
        {
            var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value;

            if (!string.IsNullOrEmpty(username))
            {
                UserConnections[username] = Context.ConnectionId;
                Console.WriteLine($"User Connected: {username} | {Context.ConnectionId}");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value;

            if (!string.IsNullOrEmpty(username))
            {
                UserConnections.Remove(username);
                Console.WriteLine($"User Disconnected: {username}");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}