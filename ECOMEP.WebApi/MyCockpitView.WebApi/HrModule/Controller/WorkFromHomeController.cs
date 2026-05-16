using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.AppSettingMasterModule;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.HrModule.Dtos;
using MyCockpitView.WebApi.HrModule.Entities;
using MyCockpitView.WebApi.NotificationModule;
using MyCockpitView.WebApi.NotificationModule.Entities;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace MyCockpitView.WebApi.HrModule.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkFromHomeController : ControllerBase
    {
        private readonly EntitiesContext _db;
        private readonly IAzureBlobService _blobService;
        private readonly IAppSettingMasterService _appSetting;
        private readonly IHubContext<NotificationHub> _hub;

        public WorkFromHomeController(
            EntitiesContext db,
            IAzureBlobService blobService,
            IAppSettingMasterService appSetting,
            IHubContext<NotificationHub> hub)
        {
            _db = db;
            _blobService = blobService;
            _appSetting = appSetting;
            _hub = hub;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create()
        {
            try
            {
                var form = Request.Form;

                if (!DateTime.TryParse(form["startDate"], out var startDate))
                    return BadRequest("Invalid startDate");

                if (!DateTime.TryParse(form["endDate"], out var endDate))
                    return BadRequest("Invalid endDate");

                if (!int.TryParse(form["userId"], out var userId))
                    return BadRequest("Invalid userId");

                var userName = form["userName"].ToString();
                var reason = form["reason"].ToString();

                var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

                List<string> uploadedFiles = new();

                foreach (var file in Request.Form.Files)
                {
                    if (file == null || file.Length == 0)
                        continue;

                    var originalFileName = Path.GetFileName(file.FileName);

                    var safeFileName = Regex.Replace(
                        originalFileName,
                        @"[^a-zA-Z0-9\._-]",
                        "_"
                    );

                    if (string.IsNullOrWhiteSpace(safeFileName))
                    {
                        safeFileName = "file";
                    }

                    var uniqueFileName =
                        $"{DateTime.Now:yyyyMMddHHmmssfff}_{safeFileName}";

                    var blobPath = $"wfh/{userId}/{uniqueFileName}";

                    await using var stream = file.OpenReadStream();

                    await _blobService.UploadAsync(
                        azureKey,
                        "wfhrecords",
                        blobPath,
                        stream
                    );

                    uploadedFiles.Add(uniqueFileName);
                }

                int? teamLeaderId = null;

                var teamMember = await _db.ContactTeamMembers
                    .FirstOrDefaultAsync(x =>
                        x.ContactID == userId &&
                        !x.IsDeleted);

                if (teamMember != null)
                {
                    var team = await _db.ContactTeams
                        .FirstOrDefaultAsync(x =>
                            x.ID == teamMember.ContactTeamID &&
                            !x.IsDeleted);

                    if (team != null)
                    {
                        teamLeaderId = team.LeaderID;
                    }
                }

                var entity = new WorkFromHomeRequest
                {
                    UserID = userId,
                    UserName = userName,
                    TeamLeaderId = teamLeaderId,
                    StartDate = startDate,
                    EndDate = endDate,
                    Reason = reason,
                    AttachmentName = string.Join(",", uploadedFiles),
                    Created = DateTime.UtcNow.AddHours(5).AddMinutes(30)
                };

                _db.WorkFromHomeRequests.Add(entity);

                await _db.SaveChangesAsync();

                var message =
                    $"🏠 {userName} has applied for Work From Home ({startDate:dd MMM} - {endDate:dd MMM})";

                var usersToNotify = new List<Contact>();


                if (teamLeaderId != null && teamLeaderId != userId)
                {
                    var leader = await _db.Contacts
                        .FirstOrDefaultAsync(x =>
                            x.ID == teamLeaderId &&
                            !x.IsDeleted);

                    if (leader != null)
                    {
                        usersToNotify.Add(leader);
                    }
                }

                var fixedIds = new List<int> { 20, 1843, 2616 };

                var fixedUsers = await _db.Contacts
                    .Where(x =>
                        fixedIds.Contains(x.ID) &&
                        !x.IsDeleted)
                    .ToListAsync();

                foreach (var user in fixedUsers)
                {
                    if (user.ID == userId)
                        continue;

                    if (usersToNotify.Any(x => x.ID == user.ID))
                        continue;

                    usersToNotify.Add(user);
                }

                var notifications = new List<Notification>();

                foreach (var user in usersToNotify)
                {
                    if (string.IsNullOrWhiteSpace(user.Username))
                        continue;

                    notifications.Add(new Notification
                    {
                        Username = user.Username,
                        Message = message,
                        Source = "wfh-create",
                        CreatedAt = DateTime.UtcNow
                    });
                }

                _db.Notifications.AddRange(notifications);

                await _db.SaveChangesAsync();

                foreach (var notification in notifications)
                {
                    if (NotificationHub.UserConnections.TryGetValue(
                        notification.Username,
                        out var connectionId))
                    {
                        await _hub.Clients.Client(connectionId)
                            .SendAsync("ReceiveNotification", notification);
                    }
                }

                return Ok(new
                {
                    message = "WFH Request Created ✅",
                    data = entity
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Something went wrong",
                    error = ex.Message
                });
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var data = await _db.WorkFromHomeRequests
                .AsNoTracking()
                .Where(x => !x.IsDeleted)
                .OrderByDescending(x => x.Created)
                .ToListAsync();

                var storageAccount = await _appSetting.GetPresetValue("AZURE_STORAGE_ACCOUNT");

                var result = data.Select(x => new
                {
                    id = x.ID,
                    userId = x.UserID,
                    userName = x.UserName,
                    teamLeaderId = x.TeamLeaderId,
                    startDate = x.StartDate,
                    endDate = x.EndDate,
                    reason = x.Reason,
                    status = x.Status,
                    created = x.Created,
                    modified = x.Modified,

                    attachments = string.IsNullOrEmpty(x.AttachmentName)
                        ? new List<object>()
                        : x.AttachmentName.Split(',')
                            .Select(file => (object)new
                            {
                                fileName = file,
                                url = $"https://{storageAccount}.blob.core.windows.net/wfhrecords/wfh/{x.UserID}/{file}"
                            }).ToList()
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error fetching WFH data",
                    error = ex.Message
                });
            }
        }

        [HttpPut("update-status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            var request = await _db.WorkFromHomeRequests.FindAsync(id);

            if (request == null)
                return NotFound("Request not found");

            request.Status = dto.Status.ToUpper();
            request.Modified = DateTime.UtcNow.AddHours(5).AddMinutes(30);

            await _db.SaveChangesAsync();

            var contact = await _db.Contacts
                .FirstOrDefaultAsync(x => x.ID == request.UserID);

            var username = contact?.Username;

            if (!string.IsNullOrEmpty(username))
            {
                var startDate = request.StartDate.ToString("dd MMM yyyy");
                var endDate = request.EndDate.ToString("dd MMM yyyy");

                var message = request.Status == "APPROVED"
                    ? $"🏠✅ Your WFH request from {startDate} to {endDate} has been approved"
                    : $"🏠❌ Your WFH request from {startDate} to {endDate} has been rejected";

                var notification = new Notification
                {
                    Username = username,
                    Message = message,
                    Source = "wfh-status",
                    CreatedAt = DateTime.UtcNow
                };

                _db.Notifications.Add(notification);

                if (NotificationHub.UserConnections.TryGetValue(username, out var connectionId))
                {
                    await _hub.Clients.Client(connectionId)
                        .SendAsync("ReceiveNotification", notification);
                }

                await _db.SaveChangesAsync();
            }

            return Ok(new { message = "Status updated ✅" });
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id)
        {
            var request = await _db.WorkFromHomeRequests.FindAsync(id);
            if (request == null)
                return NotFound();

            var form = Request.Form;

            request.StartDate = DateTime.Parse(form["startDate"]);
            request.EndDate = DateTime.Parse(form["endDate"]);

            request.Reason = form["reason"];

            List<string> existingFiles = new List<string>();

            var existingFilesJson = form["existingFiles"].ToString();

            if (!string.IsNullOrWhiteSpace(existingFilesJson) &&
                existingFilesJson != "null" &&
                existingFilesJson != "[]")
            {
                try
                {
                    var parsed = JsonSerializer.Deserialize<List<MyCockpitView.WebApi.HrModule.Dtos.AttachmentDto>>(
                         existingFilesJson,
                         new JsonSerializerOptions
                         {
                             PropertyNameCaseInsensitive = true
                         }
                     );

                    if (parsed != null && parsed.Count > 0)
                    {
                        existingFiles = parsed
                            .Where(x => !string.IsNullOrEmpty(x.FileName))
                            .Select(x => x.FileName)
                            .ToList();
                    }
                }
                catch
                {
                    existingFiles = request.AttachmentName?
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .ToList() ?? new List<string>();
                }
            }
            else
            {
                existingFiles = request.AttachmentName?
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .ToList() ?? new List<string>();
            }

            var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

            foreach (var file in Request.Form.Files)
            {
                if (file == null || file.Length == 0)
                    continue;

                var originalFileName = Path.GetFileName(file.FileName);

                var safeFileName = System.Text.RegularExpressions.Regex.Replace(
                    originalFileName,
                    @"[^a-zA-Z0-9\._-]",
                    "_"
                );

                var uniqueFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{safeFileName}";

                var blobPath = $"wfh/{request.UserID}/{uniqueFileName}";

                await using var stream = file.OpenReadStream();

                await _blobService.UploadAsync(
                    azureKey,
                    "wfhrecords",
                    blobPath,
                    stream
                );

                existingFiles.Add(uniqueFileName);
            }
            request.AttachmentName = string.Join(",", existingFiles);
            request.Modified = DateTime.UtcNow.AddHours(5).AddMinutes(30);

            await _db.SaveChangesAsync();

            return Ok(new { message = "Updated successfully ✅" });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await _db.WorkFromHomeRequests.FindAsync(id);

            if (request == null)
                return NotFound("Request not found");

            request.IsDeleted = true;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Deleted successfully ✅" });
        }

        [HttpGet("team-members/{leaderId}")]
        public async Task<IActionResult> GetTeamMembers(int leaderId)
        {
            try
            {
                var team = await _db.ContactTeams
                    .FirstOrDefaultAsync(x => x.LeaderID == leaderId && !x.IsDeleted);

                if (team == null)
                    return NotFound("No team found for this leader");

                var members = await (
                    from tm in _db.ContactTeamMembers
                    join c in _db.Contacts on tm.ContactID equals c.ID
                    where tm.ContactTeamID == team.ID
                          && !tm.IsDeleted
                          && !c.IsDeleted
                    select new
                    {
                        id = c.ID,
                        fullName = c.FullName,
                        username = c.Username,
                        email = c.EmailsJson,
                        phone = c.PhonesJson,
                        isLeader = tm.IsLeader
                    }
                ).ToListAsync();

                return Ok(members);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error fetching team members",
                    error = ex.Message
                });
            }
        }

        [HttpGet("by-teamleader/{teamLeaderId}")]
        public async Task<IActionResult> GetByTeamLeader(int teamLeaderId)
        {
            var data = await _db.WorkFromHomeRequests
                .Where(x =>
                    x.TeamLeaderId == teamLeaderId &&
                    x.UserID != teamLeaderId &&   
                    !x.IsDeleted
                )
                .OrderByDescending(x => x.Created)
                .ToListAsync();

            return Ok(data);
        }

    }
}
