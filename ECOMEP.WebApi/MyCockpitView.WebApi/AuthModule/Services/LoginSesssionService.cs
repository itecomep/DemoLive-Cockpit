
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.Utility.Common;
using System.Text;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.AuthModule.Services;

public interface ILoginSessionService : IBaseEntityService<LoginSession>
{
    Task CloseExpiredSessions();
    Task LogoutUser(string username, string? token = null);
    Task UpdateRefreshToken(string refreshTokenId);
    Task VerifyEmailOTP(EmailOTPVerificationDto dto);
    Task<LoginSession?> GetByToken(string token);
}

public class LoginSessionService : BaseEntityService<LoginSession>, ILoginSessionService
{
    private readonly IContactService _contactService;
    private readonly ICurrentUserService _currentUserService;

    public LoginSessionService(
        EntitiesContext db,
        IContactService contactService,
        ICurrentUserService currentUserService) : base(db)
    {
        _contactService = contactService;
        _currentUserService = currentUserService;
    }

    public async Task<LoginSession?> GetByToken(string token)
    {
        if (string.IsNullOrEmpty(token))
            return null;

        return await Get()
            .Where(s => s.Token == token && s.IsActive)
            .FirstOrDefaultAsync();
    }

    public IQueryable<LoginSession> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

            IQueryable<LoginSession> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {
                if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<LoginSession>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var _value = Convert.ToInt32(_item.Value);
                        predicate = predicate.Or(x => x.ContactID == _value);
                    }
                    _query = _query.Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("Username", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<LoginSession>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("Username", StringComparison.OrdinalIgnoreCase)))
                    {
                        var _value = _item.Value;
                        predicate = predicate.Or(x => x.Username == _value);
                    }
                    _query = _query.Where(predicate);
                }

            if (Filters.Where(x => x.Key.Equals("IpAddress", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<LoginSession>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("IpAddress", StringComparison.OrdinalIgnoreCase)))
                {
                    var _value = _item.Value;
                    predicate = predicate.Or(x => x.IpAddress == _value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("IpAddress", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<LoginSession>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("IpAddress", StringComparison.OrdinalIgnoreCase)))
                {
                    var _value = _item.Value;
                    predicate = predicate.Or(x => x.IpAddress == _value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("Created", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("Created", StringComparison.OrdinalIgnoreCase));
                    var result = Convert.ToDateTime(_item.Value);

                    _query = _query.Where(x => x.Created.Date == result.Date);
                }

                if (Filters.Where(x => x.Key.Equals("logoutDate", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("logoutDate", StringComparison.OrdinalIgnoreCase));

                    var result = Convert.ToDateTime(_item.Value);
                    _query = _query.Where(x => x.LogoutDate != null && x.LogoutDate.Value.Date == result.Date);
                }


                if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                    var result = Convert.ToDateTime(_item.Value);
                    _query = _query.Where(x => x.Created >= result || x.LogoutDate >= result);
                }

                if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                    var result = Convert.ToDateTime(_item.Value);
                    var end = result.AddDays(1);
                    _query = _query.Where(x => x.Created < end || x.LogoutDate < end);

                }

                if (Filters.Where(x => x.Key.Equals("IsActive", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("IsActive", StringComparison.OrdinalIgnoreCase));
                    var value = Convert.ToBoolean(_item.Value);

                    _query = _query.Where(x => x.IsActive == value);
                }

                if (Filters.Where(x => x.Key.Equals("IsOTPVerified", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("IsOTPVerified", StringComparison.OrdinalIgnoreCase));
                    var value = Convert.ToBoolean(_item.Value);

                    _query = _query.Where(x => x.IsOTPVerified == value);
                }

                if (Filters.Where(x => x.Key.Equals("IsOTPRequired", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("IsOTPRequired", StringComparison.OrdinalIgnoreCase));
                    var value = Convert.ToBoolean(_item.Value);

                    _query = _query.Where(x => x.IsOTPRequired == value);
                }

            }

            if (Search != null && Search != string.Empty)
            {
                var _keywords = Search.Split(' ');

                foreach (var _key in _keywords)
                {
                    _query = _query
                         .Where(x =>
                         x.Person.ToLower().Contains(_key.ToLower())
                         || x.Username.ToLower().Contains(_key.ToLower())
                         || x._searchTags.ToLower().Contains(_key.ToLower())
                         );
                }
            }

            if (Sort != null && Sort != string.Empty)
            {
                switch (Sort.ToLower())
                {
                    case "createddate":
                        return _query
                                .OrderBy(x => x.Created);

                    case "modifieddate":
                        return _query
                                .OrderBy(x => x.Modified);

                    case "createddate desc":
                        return _query
                                .OrderByDescending(x => x.Created);

                    case "modifieddate desc":
                        return _query
                                .OrderByDescending(x => x.Modified);
                    case "logoutdate":
                        return _query
                                .OrderByDescending(x => x.LogoutDate);

                    case "logoutdate desc":
                        return _query
                                .OrderByDescending(x => x.LogoutDate);

                }
            }

            return _query.OrderByDescending(x => x.Created).Include(x => x.Contact);

    }


    public async Task<int> Create(LoginSession Entity)
    {

            if (Entity.IsOTPRequired)
            {
            var sharedService = new SharedService(db);
            var otpExpiryDuration = Convert.ToDecimal(await sharedService.GetPresetValue(McvConstant.LOGIN_OTP_EXPIRY_MINUTES));

                Entity.OTP = (new Random()).Next(0, 999999).ToString("000000");



                var _contact = await _contactService.Get()
                    .Where(x => x.ID == Entity.ContactID).SingleOrDefaultAsync();

            if (_contact == null || !(_contact.Emails != null))
                throw new EntityServiceException("EmailID for current user not found! Please update Contact List");
             
            var subject = $"MyCockpitView | OTP";
                var toAddresses = new List<(string name, string email)>();
            //if (_contact.Username != null && DataTools.IsEmailValid(_contact.Username))
            //{
            //    toAddresses.Add((_contact.Username, _contact.Name));
            //}
            //else 
            if (_contact.Emails != null && _contact.Emails.Any())
            {
                foreach (var email in _contact.Emails)
                {
                    if (DataTools.IsEmailValid(email.Email))
                    {
                        toAddresses.Add((_contact.Name,email.Email));
                    }
                }
            }


            if (!toAddresses.Any()) throw new EntityServiceException("Please update the contact with a valid email id to send OTP.");

            var _senderEmail = await sharedService.GetPresetValue(McvConstant.AGENDA_FOLLOW_UP_EMAIL_SENDER_ID);
            var _senderName = await sharedService.GetPresetValue(McvConstant.AGENDA_FOLLOW_UP_EMAIL_SENDER_NAME);


            //Create a new StringBuilder object
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html lang=\"en\">");
            sb.AppendLine("  <head>");
            sb.AppendLine("    <meta charset=\"UTF-8\" />");
            sb.AppendLine("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />");
            sb.AppendLine("    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" />");
            sb.AppendLine("    <title>Static Template</title>");
            sb.AppendLine("");
            sb.AppendLine("    <link");
            sb.AppendLine("      href=\"https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&display=swap\"");
            sb.AppendLine("      rel=\"stylesheet\"");
            sb.AppendLine("    />");
            sb.AppendLine("  </head>");
            sb.AppendLine("  <body");
            sb.AppendLine("    style=\"");
            sb.AppendLine("      margin: 0;");
            sb.AppendLine("      font-family: Barlow, sans-serif;");
            sb.AppendLine("      background-color: #ffffff;");
            sb.AppendLine("      font-size: 14px;");
            sb.AppendLine("    \"");
            sb.AppendLine("  >");
            sb.AppendLine("    <div");
            sb.AppendLine("      style=\"");
            sb.AppendLine("        max-width: 680px;");
            sb.AppendLine("        margin: 0 auto;");
            sb.AppendLine("        padding: 45px 30px 60px;");
            sb.AppendLine("        font-size: 14px;");
            sb.AppendLine("        background-color: #e2e2e2;");
            sb.AppendLine("        color: #434343;");
            sb.AppendLine("      \"");
            sb.AppendLine("    >");
            sb.AppendLine("      <header>");
            sb.AppendLine("        <table");
            sb.AppendLine("          style=\"");
            sb.AppendLine("            width: 100%;");
            sb.AppendLine("            padding: 5px 30px;");
            sb.AppendLine("            border-radius: 30px 30px 0 0;");
            sb.AppendLine("            background-color: #9fd596;");
            sb.AppendLine("          \"");
            sb.AppendLine("        >");
            sb.AppendLine("          <tbody>");
            sb.AppendLine("            <tr style=\"height: 0;\">");
            sb.AppendLine("              <td style=\"text-align: center;\">");
            sb.AppendLine("                <img");
            sb.AppendLine("                  style=\"");
            sb.AppendLine("                    width: 100%;");
            sb.AppendLine("                    height: 100%;");
            sb.AppendLine("                    max-height: 100px;");
            sb.AppendLine("                    object-fit: contain;");
            sb.AppendLine("                  \"");
            sb.AppendLine("                  alt=\"\"");
            sb.AppendLine("                  src=\"https://ecomepmcvstorage.blob.core.windows.net/assets/EMCPL_logo.png\"");
            sb.AppendLine("                />");
            sb.AppendLine("              </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("          </tbody>");
            sb.AppendLine("        </table>");
            sb.AppendLine("      </header>");
            sb.AppendLine("");
            sb.AppendLine("      <main>");
            sb.AppendLine("        <div");
            sb.AppendLine("          style=\"");
            sb.AppendLine("            margin: 0;");
            sb.AppendLine("            padding: 92px 30px 115px;");
            sb.AppendLine("            background: #ffffff;");
            sb.AppendLine("            border-radius: 0 0 30px 30px;");
            sb.AppendLine("            text-align: center; \"");
            sb.AppendLine("        >");
            sb.AppendLine("          <div style=\"width: 100%; max-width: 489px; margin: 0 auto;\">");
            sb.AppendLine("            <h1");
            sb.AppendLine("              style=\"");
            sb.AppendLine("                margin: 0;");
            sb.AppendLine("                font-size: 24px;");
            sb.AppendLine("                font-weight: 500;");
            sb.AppendLine("                color: #1f1f1f;");
            sb.AppendLine("              \"");
            sb.AppendLine("            >");
            sb.AppendLine("              Your OTP");
            sb.AppendLine("            </h1>");
            sb.AppendLine("            <p");
            sb.AppendLine("              style=\"");
            sb.AppendLine("                margin: 0;");
            sb.AppendLine("                margin-top: 17px;");
            sb.AppendLine("                font-size: 16px;");
            sb.AppendLine("                font-weight: 500;");
            sb.AppendLine("              \"");
            sb.AppendLine("            >");
            sb.AppendLine("              Dear User,");
            sb.AppendLine("            </p>");
            sb.AppendLine("            <p");
            sb.AppendLine("              style=\"");
            sb.AppendLine("                margin: 0;");
            sb.AppendLine("                margin-top: 17px;");
            sb.AppendLine("                font-weight: 500;");
            sb.AppendLine("                letter-spacing: 0.56px;");
            sb.AppendLine("              \"");
            sb.AppendLine("            >");
            sb.AppendLine("              Use the following OTP to login. OTP is valid for");
            sb.AppendLine($"              <span style=\"font-weight: 600; color: #1f1f1f;\">{otpExpiryDuration} minutes</span>.");
            sb.AppendLine("              Do not share this code with others.");
            sb.AppendLine("            </p>");
            sb.AppendLine("            <p");
            sb.AppendLine("              style=\"");
            sb.AppendLine("                margin: 0;");
            sb.AppendLine("                margin-top: 30px;");
            sb.AppendLine("                font-size: 40px;");
            sb.AppendLine("                font-weight: 600;");
            sb.AppendLine("                letter-spacing: 10px;");
            sb.AppendLine("                color: #ba3d4f;");
            sb.AppendLine("              \"");
            sb.AppendLine("            >");
            sb.AppendLine(Entity.OTP);
            sb.AppendLine("            </p>");
            sb.AppendLine("          </div>");
            sb.AppendLine("        </div>");
            sb.AppendLine("");
            sb.AppendLine("        <p");
            sb.AppendLine("          style=\"");
            sb.AppendLine("            max-width: 400px;");
            sb.AppendLine("            margin: 0 auto;");
            sb.AppendLine("            margin-top: 30px;");
            sb.AppendLine("            text-align: center;");
            sb.AppendLine("          \"");
            sb.AppendLine("        >");
            sb.AppendLine("          This is a <b>MyCockpitView<sup>&copy;</sup></b> generated e-mail.");
            sb.AppendLine("          Please do not reply to this mail.");
            sb.AppendLine("        </p>");
            sb.AppendLine("      </main>");
            sb.AppendLine("");
            sb.AppendLine("      <footer");
            sb.AppendLine("        style=\"");
            sb.AppendLine("          width: 100%;");
            sb.AppendLine("          max-width: 490px;");
            sb.AppendLine("          margin: 20px auto 0;");
            sb.AppendLine("          text-align: center;");
            sb.AppendLine("          border-top: 1px solid #ffffff;");
            sb.AppendLine("        \"");
            sb.AppendLine("      >");
            sb.AppendLine("        <p style=\"max-width: 400px;margin: 0 auto;margin-top: 30px;text-align: center; color: #434343;\">");
            sb.AppendLine($"          Copyright <sup>&copy;</sup> {DateTime.UtcNow.ToString("yyyy")} Company. All rights reserved.");
            sb.AppendLine("        </p>");
            sb.AppendLine("        <p style=\"max-width: 400px;margin: 0 auto;margin-top: 30px;text-align: center;color: #434343;\">");
            sb.AppendLine("          <small");
            sb.AppendLine("            >Powered by <b>Newarch<sup>&reg;</sup> Infotech LLP</b></small");
            sb.AppendLine("          >");
            sb.AppendLine("        </p>");
            sb.AppendLine("      </footer>");
            sb.AppendLine("    </div>");
            sb.AppendLine("  </body>");
            sb.AppendLine("</html>");



            var _sharedService = new SharedService(db);
                    await _sharedService.SendMail(subject,_senderName, _senderEmail, sb.ToString(), toAddresses);

            Entity.Created = DateTime.UtcNow;
            Entity.Modified = DateTime.UtcNow;
            Entity.CreatedBy = _contact.FullName;
            Entity.ModifiedBy = _contact.FullName;
            Entity.CreatedByContactID = _contact.ID;
            Entity.ModifiedByContactID = _contact.ID;
            }

           return await base.Create(Entity);
    }

    public async Task LogoutUser(string username, string? token = null)
    {

            var histories = Get()
                 .Where(e => e.Username == username && e.IsActive);

            if (token != null)
                histories = histories.Where(e => e.Token == token);


                foreach (var history in await histories.ToListAsync())
                {
                    history.LogoutDate = DateTime.UtcNow;
                    history.IsActive = false;

                    db.Entry(history).State = EntityState.Modified;
                }
            await db.SaveChangesAsync();

    }

    public async Task CloseExpiredSessions()
    {

        var _activeSessions = await Get()
             .Where(e => e.IsActive)
             .ToListAsync();

        var sharedService = new SharedService(db);
        var otpExpiry = Convert.ToDouble(await sharedService.GetPresetValue(McvConstant.LOGIN_OTP_EXPIRY_MINUTES));
        var sessionExpiry= Convert.ToDouble(await sharedService.GetPresetValue(McvConstant.LOGIN_SESSION_EXPIRY_MINUTES));

        foreach (var session in _activeSessions)
        {
            if (session.IsOTPRequired && !session.IsOTPVerified && session.Created.AddMinutes(otpExpiry) <= DateTime.UtcNow)
            {
                session.ModifiedBy = "OTP Expired";
            }
            else if (session.Created.AddHours(sessionExpiry) <= DateTime.UtcNow)
            {
                session.ModifiedBy = "Session Expired";
            }
            session.LogoutDate = DateTime.UtcNow;
            session.IsActive = false;
        }
        await db.SaveChangesAsync();
    }

    public async Task UpdateRefreshToken(string refreshTokenId)
    {
        var remoteIpAddress = _currentUserService.GetRemoteIpAddress();

        if (remoteIpAddress != null)
        {
            var logsToUpdate = await Get()
                .Where(x => x.IpAddress == remoteIpAddress && x.Token == null)
                .ToListAsync();

            foreach (var obj in logsToUpdate)
            {
                obj.Token = refreshTokenId;
                await base.Update(obj);
            }
        }
    }

    public async Task VerifyEmailOTP(EmailOTPVerificationDto dto)
    {
            var _session = await Get()
                .Where(e => e.IsActive && e.UID == dto.SessionId).SingleOrDefaultAsync();

            if (_session == null) throw new EntityServiceException("Session expired. Please refresh and login again!");

            if (_session.OTP != dto.OTP) throw new EntityServiceException("Invalid OTP. Please enter again!");

            _session.IsOTPVerified = true;

        await base.Update(_session);

    }

    //public async Task<ReportDefinition> GetReport(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null, string RenderType = "PDF")
    //{
    //    try
    //    {
    //        var results = await Get(Filters, Search, Sort).ToListAsync();
    //        foreach (var obj in results)
    //        {
    //            if (obj.Created != null)
    //                obj.Created = ClockTools.GetIST(obj.Created);
    //            if (obj.LogoutDateTime != null)
    //                obj.LogoutDateTime = ClockTools.GetIST(obj.LogoutDateTime.Value);
    //        }
    //        var _dataSet = DataTools.ToDataTable<UserLoginHistory>(results);

    //        var _reportProperties = new HashSet<ReportProperties>();
    //        _reportProperties.Add(new ReportProperties() { PropertyName = "Heading1", PropertyValue = "User Sessions" });
    //        _reportProperties.Add(new ReportProperties() { PropertyName = "Heading2", PropertyValue = ClockTools.GetISTNow().ToString("dd MMM yyyy") });

    //        var _reportDef = new ReportDefinition()
    //        {
    //            ReportName = "UserSessions",
    //            ReportPath = @"https://kpa.blob.core.windows.net/rdlc/UserSessions.rdlc",
    //            ReportDataSet = _dataSet,
    //            ReportProperties = _reportProperties,
    //            Filename = "User Sessions",
    //            RenderType = RenderType
    //        };
    //        var _sharedService = new SharedService(db);
    //        return await _ReportClient.GenerateReport(_reportDef);
    //    }
    //    catch (Exception e)
    //    {
    //        throw e;
    //    }
    //}



}