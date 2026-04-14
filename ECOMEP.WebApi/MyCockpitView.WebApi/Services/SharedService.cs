using Microsoft.EntityFrameworkCore;
using MyCockpitView.Utility.Common;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using MyCockpitView.Utility.ZeptoMailClient;
using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.ContactModule.Entities;
using SendGrid.Helpers.Mail;

namespace MyCockpitView.WebApi.Services;

public interface ISharedService
{
    Task<int> GetBusinessEndMinutesIST();
    Task<int> GetBusinessStartMinutesIST();
    Task<ContactAppointment?> GetLastAppointment(int ContactID, int? CompanyID = null);
    Task<string> GetPresetValue(string Key);
    //Task<string> GetRDLCServiceUrl();
    Task SendMail(
         string subject,
         string senderName,
         string senderEmail,
         string mailBody,
     List<(string name, string email)> toAddresses,
     List<(string name, string email)>? ccAddresses = null,
     List<(string name, string email)>? bccAddresses = null,
              string? replyAddress = null, string? replyName = null);

    Task PushNotification(string username, string title, string body, string entity, string entityID);
}

public class SharedService : ISharedService
{
    private readonly EntitiesContext db;


    public SharedService(EntitiesContext db)
    {
        this.db = db;
    }

    public async Task<ContactAppointment?> GetLastAppointment(int ContactID, int? CompanyID = null)
    {

        var _contact = await db.Contacts.AsNoTracking()
           .Include(x => x.Appointments).ThenInclude(c => c.Company)

           .Where(x => x.ID == ContactID)
           .SingleOrDefaultAsync();

        if (_contact != null && _contact.Appointments.Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED).Any())
        {
            if (CompanyID != null)
            {
                return _contact.Appointments
                    .Where(x => x.CompanyID == CompanyID)
                    .Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
                    .OrderByDescending(x => x.JoiningDate).FirstOrDefault();

            }
            else
            {
                return _contact.Appointments
                        .Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
                        .OrderByDescending(x => x.JoiningDate).FirstOrDefault();
            }


        }

        return null;

    }

    public async Task<List<int>> GetContactIDByRoleAsync(string roleName)
    {
        return await db.Users
        .Join(db.UserRoles, user => user.Id, userRole => userRole.UserId, (user, userRole) => new { user, userRole })
        .Join(db.Roles, ur => ur.userRole.RoleId, role => role.Id, (ur, role) => new { ur.user, role })
                .Join(db.Contacts, ur => ur.user.UserName, contact => contact.Username, (ur, contact) => new { ur.user, ur.role, contact })
        .Where(ur => ur.role.Name == roleName)
        .Select(ur => ur.contact.ID)
                      .ToListAsync();
    }

    public async Task<string?> GetPresetValue(string Key)
    {

        var _query = await db.AppSettingMasters
            .AsNoTracking()
            .Where(x => x.PresetKey.Trim().ToLower() == Key.Trim().ToLower())
            .SingleOrDefaultAsync();

        if (_query == null) throw new Exception(Key + " not found in Presets!");
        return _query.PresetValue?.Trim();

    }

    public async Task<int> GetBusinessEndMinutesIST()
    {

        return ClockTools.ConvertTimestringToMinutes(await GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));

    }

    public async Task<int> GetBusinessStartMinutesIST()
    {

        return ClockTools.ConvertTimestringToMinutes(await GetPresetValue(McvConstant.OFFICE_OPEN_TIME));

    }


    #region Email

    public async Task SendMail(
        string subject,
        string senderName,
        string senderEmail,
        string mailBody,
    List<(string name, string email)>? toAddresses = null,
    List<(string name, string email)>? ccAddresses = null,
    List<(string name, string email)>? bccAddresses = null,
             string? replyAddress = null, string? replyName = null)
    {

        var zohoMailKey = await GetPresetValue(McvConstant.ZOHO_MAIL_API_KEY);
        var zohoMailApi = await GetPresetValue(McvConstant.ZOHO_MAIL_API);
        var _devmode = Convert.ToBoolean(await GetPresetValue(McvConstant.DEVMODE));
        var devmodeEmailTo = await GetPresetValue(McvConstant.DEVMODE_EMAIL_TO);

        ZeptoEmailUtility.SendEmail(
            zohoMailApi,
            zohoMailKey,
        subject,
        senderName,
        senderEmail,
        mailBody,
            _devmode ? new List<(string name, string email)>() { ("developer", devmodeEmailTo) } : toAddresses,
            _devmode ? null : ccAddresses,
            _devmode ? null : bccAddresses,
            replyAddress, replyName);


    }



    #endregion

    public async Task PushNotification(string username, string title, string body, string entity, string entityID)
    {

        var _devmode = Convert.ToBoolean(await GetPresetValue(McvConstant.DEVMODE));
        if (_devmode) return;

        //var contact = await db.Contacts.AsNoTracking().FirstOrDefaultAsync(x => x.ID == ContactID);
        //if (contact == null || contact.Username == null) return;

        var subscriptions = await db.WebPushSubscriptions.AsNoTracking()
            .Where(x => x.Username == username)
            .Select(x => x.Subscription)
            .ToListAsync();

        if (!subscriptions.Any()) return;

        var logoUrl = await GetPresetValue(McvConstant.APP_LOGO_URL);
        var api = await GetPresetValue(McvConstant.PUSH_NOTIFICATION_API);
        var pub = await GetPresetValue(McvConstant.PUSH_NOTIFICATION_PUBLIC_KEY);
        var prv = await GetPresetValue(McvConstant.PUSH_NOTIFICATION_PRIVATE_KEY);


        foreach (var subscription in subscriptions)
        {
            // Deserialize the subscription string into dynamic JObject
            JObject subscriptionObject = JsonConvert.DeserializeObject<JObject>(subscription);
            var requestPayload = new
            {
                subscription = subscriptionObject,
                notificationPayload = new
                {
                    notification = new
                    {
                        title,
                        body,
                        icon = logoUrl,
                        vibrate = new[] { 100, 50, 100 },
                        //tag = $"{entity}-{entityID}",
                        tag = Guid.NewGuid(),
                        data = new
                        {
                            entity,
                            entityID
                        },
                        //actions = new[]
                        //{
                        //    new { action = "open", title = "Open In App" }
                        //}
                    }
                },
                vapidPrivateKey = prv,
                vapidPublicKey = pub
            };

            try
            {
                using (var httpClient = new HttpClient())
                {
                    // Set the base URL of the Azure Function endpoint
                    httpClient.BaseAddress = new Uri(api);

                    // Convert notification payload to JSON
                    string jsonPayload = JsonConvert.SerializeObject(requestPayload);

                    // Convert JSON string to HttpContent
                    HttpContent content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");


                    // Send the HTTP POST request to the Azure Function endpoint
                    var response = await httpClient.PostAsync("", content);

                    // Check if the response is successful
                    if (!response.IsSuccessStatusCode)
                        throw new Exception($"HTTP POST request failed with status code {response.StatusCode},{response}");

                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"{e.Message}");
            }

        }
    }


}

