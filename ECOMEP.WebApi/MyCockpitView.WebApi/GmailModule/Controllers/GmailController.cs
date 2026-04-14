using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
// using MyCockpitView.WebApi.Infrastructure;
using MyCockpitView.WebApi.GmailModule.Entities;
using System.Text.Json;
using MyCockpitView.WebApi.GmailModule.Services;
using MyCockpitView.WebApi.GmailModule.Configuration;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using MyCockpitView.WebApi.GmailModule.Dtos;
using System.Text.RegularExpressions;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.GmailModule.Data;
using MyCockpitView.WebApi.AzureBlobsModule;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using System.Text.RegularExpressions;

namespace MyCockpitView.WebApi.GmailModule.Controllers
{
    [ApiController]
    [Route("api/gmail")]
    public class GmailController : ControllerBase
    {
        private readonly EntitiesContext _dbContext;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IGmailService _gmailService;
        private readonly GmailOAuthSettings _settings;
        private readonly ILogger<GmailController> _logger;
        private readonly GmailEmailContext _gmailDbContext;
        private readonly IAzureBlobService _blobService;

    public GmailController(EntitiesContext dbContext, IHttpClientFactory httpClientFactory, IGmailService gmailService, IOptions<GmailOAuthSettings> options, ILogger<GmailController> logger, GmailEmailContext gmailDbContext, IAzureBlobService blobService)
        {
            _dbContext = dbContext;
            _httpClientFactory = httpClientFactory;
            _gmailService = gmailService;
            _settings = options.Value;
            _logger = logger;
            _gmailDbContext = gmailDbContext;
            _blobService = blobService;
       }   

        [HttpGet("auth")]
        public IActionResult Auth([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            return BadRequest("UserId missing");
            var url =
                "https://accounts.google.com/o/oauth2/v2/auth" +
                "?response_type=code" +
                $"&client_id={_settings.ClientId}" +
                $"&redirect_uri={Uri.EscapeDataString(_settings.RedirectUri)}" +
                $"&scope={Uri.EscapeDataString(_settings.Scope)}" +
                "&access_type=offline" +
                "&prompt=consent" +
                $"&state={userId}";

            return Redirect(url);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {
            if (string.IsNullOrEmpty(code))
                return BadRequest("Authorization code missing");

            if (string.IsNullOrEmpty(state))
                return BadRequest("UserId missing in state");
            var userId = state;
            var client = _httpClientFactory.CreateClient();

            var tokenResponse = await client.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "client_id", _settings.ClientId },
                    { "client_secret", _settings.ClientSecret },
                    { "code", code },
                    { "redirect_uri", _settings.RedirectUri },
                    { "grant_type", "authorization_code" }
                })
            );

            tokenResponse.EnsureSuccessStatusCode();

            var json = JsonDocument.Parse(await tokenResponse.Content.ReadAsStringAsync());

            var accessToken = json.RootElement.GetProperty("access_token").GetString()!;
            string? refreshToken = json.RootElement.TryGetProperty("refresh_token", out var rt)
                ? rt.GetString()
                : null;

            var expiresIn = json.RootElement.GetProperty("expires_in").GetInt32();
            var expiry = DateTime.UtcNow.AddSeconds(expiresIn);

            var gmailEmail = await _gmailService.GetLoggedInEmailAsync(accessToken);

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
            {
                token = new GmailToken
                {
                    UserId = userId,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken ?? "",
                    ExpiryTime = expiry,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    GmailAddress = gmailEmail
                };
                _dbContext.GmailTokens.Add(token);
            }
            else
            {
                token.AccessToken = accessToken;
                if (!string.IsNullOrEmpty(refreshToken))
                    token.RefreshToken = refreshToken;

                token.ExpiryTime = expiry;
                token.UpdatedAt = DateTime.UtcNow;
                token.GmailAddress = gmailEmail;
            }

            await _dbContext.SaveChangesAsync();

            // return Redirect("http://localhost:4200/#/cockpit");
            return Redirect("https://myecomep.com/ng/#/cockpit");
            // return Redirect("https://myecomep.com/staging/#/cockpit");
        }

        [HttpPost("disconnect")]
        public async Task<IActionResult> DisconnectGmail([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
                return Ok(new { message = "Gmail already disconnected" });

            try
            {
                using var client = _httpClientFactory.CreateClient();
                await client.PostAsync(
                    $"https://oauth2.googleapis.com/revoke?token={token.RefreshToken}",
                    null
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking Gmail token");
            }

            _dbContext.GmailTokens.Remove(token);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Gmail disconnected successfully" });
        }

        private async Task<GmailToken> RefreshAccessTokenAsync(GmailToken token)
        {
            var client = _httpClientFactory.CreateClient();

            var response = await client.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "client_id", _settings.ClientId },
                    { "client_secret", _settings.ClientSecret },
                    { "refresh_token", token.RefreshToken },
                    { "grant_type", "refresh_token" }
                })
            );

            response.EnsureSuccessStatusCode();

            var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

            token.AccessToken = json.RootElement.GetProperty("access_token").GetString()!;
            token.ExpiryTime = DateTime.UtcNow.AddSeconds(
                json.RootElement.GetProperty("expires_in").GetInt32()
            );
            token.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return token;
        }

        [HttpGet("emails")]
        public async Task<IActionResult> GetAllEmails([FromQuery] string userId, [FromQuery] string? pageToken = null, [FromQuery] int pageSize = 20)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
                return Ok(new { message = "Gmail not connected|First Connect The Gmail" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            var (emails, total, nextPage) = await _gmailService.GetEmailsAsync(token.AccessToken, pageToken, pageSize);

            return Ok(new
            {
                emails,
                total,
                nextPageToken = nextPage
            });
        }

        [HttpGet("sent")]
        public async Task<IActionResult> GetSentEmails([FromQuery] string userId, [FromQuery] string? pageToken = null, [FromQuery] int pageSize = 20)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (token == null)
                return Ok(new { message = "Gmail not connected|First Connect The Gmail" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            var (emails, total, nextPage) = await _gmailService.GetSentEmailsAsync(token.AccessToken, pageToken, pageSize);

            return Ok(new
            {
                emails,
                total,
                nextPageToken = nextPage
            });
        }

        [HttpGet("drafts")]
        public async Task<IActionResult> GetDraftEmails([FromQuery] string userId, [FromQuery] string? pageToken = null, [FromQuery] int pageSize = 20)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
                return Ok(new { message = "Gmail not connected|First Connect The Gmail" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            var (emails, total, nextPage) = await _gmailService.GetDraftEmailsAsync(token.AccessToken, pageToken, pageSize);

            return Ok(new
            {
                emails,
                total,
                nextPageToken = nextPage
            });
        }

        [HttpPost("draft")]
        public async Task<IActionResult> SaveDraft([FromBody] GmailDraftDto dto)
        {
            if (string.IsNullOrEmpty(dto.UserId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == dto.UserId);

            if (token == null)
                return BadRequest("Gmail not connected|First Connect The Gmail");

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            try
            {
                var draft = await _gmailService.CreateDraftAsync(token.AccessToken, dto);
                return Ok(draft);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving draft");
                return StatusCode(500, "Failed to save draft");
            }
        }

        [HttpDelete("draft/{draftId}")]
        public async Task<IActionResult> DeleteDraft(string draftId, [FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
                return BadRequest("Gmail not connected");

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            try
            {
                await _gmailService.DeleteDraftAsync(token.AccessToken, draftId);
                return Ok(new { message = "Draft deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Delete draft failed");
                return StatusCode(500, "Failed to delete draft");
            }
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] GmailSendDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.userId))
                return BadRequest(new { message = "UserId missing" });

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(u => u.UserId == dto.userId);
            if (token == null) return BadRequest(new { message = "Gmail not connected" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            var attachmentsBase64 = dto.Attachments?.Select(a => a.Content).ToList();
            var attachmentsFileNames = dto.Attachments?.Select(a => a.Name).ToList();
            var ccList = string.IsNullOrWhiteSpace(dto.cc) ? null : dto.cc.Split(',').Select(x => x.Trim()).ToList();
            var bccList = string.IsNullOrWhiteSpace(dto.bcc) ? null : dto.bcc.Split(',').Select(x => x.Trim()).ToList();

            try
            {
               var sentMessage = await _gmailService.SendEmailAsync(
                    accessToken: token.AccessToken,
                    to: dto.to,
                    subject: dto.subject,
                    body: dto.body,
                    threadId: dto.threadId,
                    replyMessageId: dto.replyMessageId,
                    references: dto.references,
                    cc: ccList,
                    bcc: bccList,
                    attachmentsBase64: attachmentsBase64,
                    attachmentsFileNames: attachmentsFileNames
                );

                if (dto.attachmentsMeta != null && dto.attachmentsMeta.Any())
                {
                    foreach (var file in dto.attachmentsMeta)
                    {
                        _gmailDbContext.MailAttachmentData.Add(new GmailAttachmentData
                        {
                            MessageId = sentMessage.Id,
                            ThreadId = sentMessage.ThreadId,
                            UserId = dto.userId,
                            Email = dto.to,
                            FromMail = token.GmailAddress,
                            FileName = file.Name,
                            BlobUrl = file.Url,
                            CreatedOn = DateTime.UtcNow
                        });
                    }

                    await _gmailDbContext.SaveChangesAsync();
                }

                if (!string.IsNullOrWhiteSpace(dto.draftId))
                {
                    await _gmailService.DeleteDraftAsync(token.AccessToken, dto.draftId);
                }

                return Ok(new { message = "Email sent successfully", threadId = sentMessage.ThreadId,messageId = sentMessage.Id  });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetLoggedInEmail([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
                return Ok(new { email = (string?)null });

            return Ok(new { email = token.GmailAddress });
        }

        // [HttpGet("attachment/{messageId}/{attachmentId}")]
        // public async Task<IActionResult> GetAttachment(string messageId, string attachmentId, [FromQuery] string userId, [FromQuery] string fileName, [FromQuery] string mimeType, [FromQuery] bool download = false)
        // {
        //     if (string.IsNullOrEmpty(userId))
        //         return BadRequest("UserId is required");

        //     var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);
        //     if (token == null)
        //         return BadRequest("Gmail not connected");

        //     if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
        //     {
        //         token = await RefreshAccessTokenAsync(token);
        //     }

        //     using var client = new HttpClient();
        //     client.DefaultRequestHeaders.Authorization =
        //         new AuthenticationHeaderValue("Bearer", token.AccessToken);

        //     var response = await client.GetAsync(
        //         $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/{attachmentId}");

        //     if (!response.IsSuccessStatusCode)
        //         return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

        //     var json = await response.Content.ReadAsStringAsync();
        //     var doc = JsonDocument.Parse(json);

        //     var data = doc.RootElement.GetProperty("data").GetString();
        //     if (string.IsNullOrEmpty(data))
        //         return NotFound();

        //     string base64 = data.Replace('-', '+').Replace('_', '/');

        //     switch (base64.Length % 4)
        //     {
        //         case 2: base64 += "=="; break;
        //         case 3: base64 += "="; break;
        //     }

        //     var bytes = Convert.FromBase64String(base64);

        //     var decodedFileName = string.IsNullOrEmpty(fileName)
        //         ? "download"
        //         : Uri.UnescapeDataString(fileName);

        //     var contentType = string.IsNullOrEmpty(mimeType)
        //         ? "application/octet-stream"
        //         : mimeType;

        //     Response.Headers["Content-Disposition"] =
        //         $"{(download ? "attachment" : "inline")}; filename=\"{decodedFileName}\"";

        //     Response.Headers["Content-Length"] = bytes.Length.ToString();

        //     return File(bytes, contentType);
        // }

        [HttpGet("attachment")]
        public async Task<IActionResult> GetAttachment([FromQuery] string messageId, [FromQuery] string attachmentId, [FromQuery] int userId, [FromQuery] string? fileName, [FromQuery] string? mimeType, [FromQuery] bool download = false)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest("ERROR: Invalid UserId");

                var token = await _dbContext.GmailTokens
                    .Where(x => x.UserId == userId.ToString())
                    .OrderByDescending(x => x.UpdatedAt)
                    .FirstOrDefaultAsync();

                if (token == null)
                    return BadRequest($"ERROR: Gmail token not found for userId={userId}");

                if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
                {
                    token = await RefreshAccessTokenAsync(token);
                    if (token == null)
                        return BadRequest("ERROR: Token refresh failed");
                }

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", token.AccessToken);

                var gmailUrl =
                    $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/{attachmentId}";

                var response = await client.GetAsync(gmailUrl);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("GMAIL ERROR: {Error}", error);
                    return BadRequest($"GMAIL ERROR: {error}");
                }

                var json = await response.Content.ReadAsStringAsync();
                var doc = JsonDocument.Parse(json);

                if (!doc.RootElement.TryGetProperty("data", out var dataElement))
                    return BadRequest("ERROR: 'data' field missing");

                var data = dataElement.GetString();

                if (string.IsNullOrEmpty(data))
                    return BadRequest("ERROR: Attachment data empty");

                string base64 = data.Replace('-', '+').Replace('_', '/');

                switch (base64.Length % 4)
                {
                    case 2: base64 += "=="; break;
                    case 3: base64 += "="; break;
                }

                var bytes = Convert.FromBase64String(base64);

                var decodedFileName = string.IsNullOrEmpty(fileName)
                    ? "download"
                    : fileName;

                var contentType = string.IsNullOrEmpty(mimeType)
                    ? "application/octet-stream"
                    : mimeType;

                return download
                    ? File(bytes, contentType, decodedFileName)
                    : File(bytes, contentType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Attachment error");
                return StatusCode(500, $"SERVER ERROR: {ex.Message}");
            }
        }

        [HttpGet("threads/{threadId}")]
        public async Task<IActionResult> GetThread(string threadId, [FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (token == null)
                return BadRequest("Gmail not connected");

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            var threadMessages = await _gmailService.GetThreadMessagesAsync(token.AccessToken, threadId);
            return Ok(threadMessages);
        }

        [HttpGet("contacts/emails")]
        public async Task<IActionResult> GetAllContactEmails()
        {
            var contacts = await _dbContext.Set<Contact>()
                .AsNoTracking()
                .Where(c => !string.IsNullOrEmpty(c.EmailsJson))
                .ToListAsync();

            var result = new List<ContactEmailDto>();

            foreach (var contact in contacts)
            {
                try
                {
                    var emails = JsonSerializer.Deserialize<List<ContactEmailJson>>(
                        contact.EmailsJson,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );

                    if (emails == null) continue;

                    foreach (var e in emails)
                    {
                        if (!string.IsNullOrWhiteSpace(e.Email))
                        {
                            var fullName = $"{contact.FirstName ?? ""} {contact.LastName ?? ""}".Trim();
                            result.Add(new ContactEmailDto
                            {
                                Email = e.Email,
                                Title = e.Title,
                                IsPrimary = e.IsPrimary,
                                FullName = fullName
                            });
                        }
                    }
                }
                catch
                {
                    
                }
            }
            result = result
                .GroupBy(x => x.Email.ToLower())
                .Select(g => g.First())
                .OrderByDescending(x => x.IsPrimary)
                .ThenBy(x => x.Email)
                .ToList();

            return Ok(result);
        }

        [HttpGet("labels")]
        public async Task<IActionResult> GetGmailLabels([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
                return Ok(new { message = "Gmail not connected, no labels processed" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.AccessToken);

            var response = await client.GetAsync(
                "https://gmail.googleapis.com/gmail/v1/users/me/labels"
            );

            if (!response.IsSuccessStatusCode)
                return BadRequest(await response.Content.ReadAsStringAsync());

            var json = await response.Content.ReadAsStringAsync();
            var obj = JsonSerializer.Deserialize<object>(json);
            return Ok(json);
        }

        [HttpPost("labels")]
        public async Task<IActionResult> CreateGmailLabels([FromQuery] string userId, [FromBody] List<LabelDto> labels)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (token == null)
                // return BadRequest("Gmail not connected");
                return Ok(new { message = "Gmail not connected, no labels processed" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.AccessToken);

            foreach (var label in labels)
            {
                var labelBody = new
                {
                    name = $"{label.Code} - {label.Title}",
                    labelListVisibility = "labelShow",
                    messageListVisibility = "show"
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(labelBody),
                    Encoding.UTF8,
                    "application/json"
                );

                try
                {
                    var response = await client.PostAsync(
                        "https://gmail.googleapis.com/gmail/v1/users/me/labels",
                        content
                    );

                    if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
                        continue;

                    response.EnsureSuccessStatusCode();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to create label {LabelName}", label.Code + " - " + label.Title);
                }
            }

            return Ok(new { message = "Labels created/processed successfully" });
        }

        [HttpPost("apply-label")]
        public async Task<IActionResult> ApplyLabelToEmails([FromBody] GmailAssignLabelDto dto)
        {
            if (string.IsNullOrEmpty(dto.UserId))
                return BadRequest("UserId missing");

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == dto.UserId);
            if (token == null)
                return Ok(new { message = "Gmail not connected, no labels created" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);

            var setting = await _dbContext.AppSettingMasters.FirstOrDefaultAsync(x => x.PresetKey == "AZURE_STORAGE_KEY");
            if (setting == null || string.IsNullOrEmpty(setting.PresetValue))
                throw new Exception("Azure Blob connection string not found in AppSettingMaster");

            string azureKey = setting.PresetValue;
            string userEmail = await GetUserEmail(dto.UserId);

            foreach (var messageId in dto.MessageIds)
            {
                try
                {
                    // Get full message
                    var msgJson = await client.GetStringAsync($"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}");
                    var root = JsonDocument.Parse(msgJson).RootElement;

                    if (!root.TryGetProperty("payload", out var payload))
                        continue;

                    if (!payload.TryGetProperty("headers", out var headers))
                        continue;

                    string GetHeaderValue(string name)
                    {
                        foreach (var h in headers.EnumerateArray())
                        {
                            if (h.TryGetProperty("name", out var nameProp) &&
                                nameProp.GetString() == name &&
                                h.TryGetProperty("value", out var valueProp))
                            {
                                return valueProp.GetString() ?? "";
                            }
                        }
                        return "";
                    }

                    var fromHeader = GetHeaderValue("From") ?? "";
                    bool isSentOrForwarded = fromHeader.Contains(userEmail, StringComparison.OrdinalIgnoreCase);

                    // Apply label
                    var addLabels = new List<string> { dto.LabelId };
                    if (isSentOrForwarded)
                        addLabels.Add("INBOX");

                    var modifyBody = new { addLabelIds = addLabels.ToArray(), removeLabelIds = Array.Empty<string>() };
                    var modifyContent = new StringContent(JsonSerializer.Serialize(modifyBody), Encoding.UTF8, "application/json");
                    await client.PostAsync($"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/modify", modifyContent);

                    // Save email if not already
                    if (!await _gmailDbContext.GmailEmails.AnyAsync(e => e.MessageId == messageId && e.UserId == dto.UserId))
                    {
                        var email = new GmailEmail
                        {
                            UserId = dto.UserId,
                            MessageId = messageId,
                            ThreadId = root.TryGetProperty("threadId", out var threadProp) ? threadProp.GetString() ?? "" : "",
                            LabelId = dto.LabelId,
                            LabelName = dto.LabelName,
                            Subject = GetHeaderValue("Subject"),
                            From = fromHeader,
                            To = GetHeaderValue("To"),
                            Cc = GetHeaderValue("Cc"),
                            Date = DateTime.TryParse(GetHeaderValue("Date"), out var dt) ? dt : DateTime.UtcNow,
                            Snippet = root.TryGetProperty("snippet", out var snippetProp) ? snippetProp.GetString() ?? "" : "",
                            Body = await BuildEmailHtml(payload, client, messageId),
                            CreatedAt = DateTime.UtcNow
                        };

                        _gmailDbContext.GmailEmails.Add(email);
                        await _gmailDbContext.SaveChangesAsync();

                        // Save attachments safely
                        if (payload.TryGetProperty("parts", out var parts))
                        {
                            foreach (var part in parts.EnumerateArray())
                            {
                                if (part.TryGetProperty("filename", out var fnProp) && !string.IsNullOrEmpty(fnProp.GetString()))
                                {
                                    string filename = fnProp.GetString()!;
                                    string mimeType = part.TryGetProperty("mimeType", out var mimeProp) ? mimeProp.GetString() ?? "application/octet-stream" : "application/octet-stream";
                                    string blobUrl = "";

                                    if (part.TryGetProperty("body", out var bodyProp) &&
                                        bodyProp.TryGetProperty("attachmentId", out var attachmentIdProp))
                                    {
                                        var attachmentId = attachmentIdProp.GetString();
                                        if (!string.IsNullOrEmpty(attachmentId))
                                        {
                                            var attachContent = await client.GetStringAsync(
                                                $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/{attachmentId}");
                                            var attachJson = JsonDocument.Parse(attachContent).RootElement;

                                            if (attachJson.TryGetProperty("data", out var dataProp))
                                            {
                                                var data = dataProp.GetString();
                                                if (!string.IsNullOrEmpty(data))
                                                {
                                                    var bytes = Convert.FromBase64String(data.Replace('-', '+').Replace('_', '/'));
                                                    using var ms = new MemoryStream(bytes);

                                                    string safeLabel = SanitizeForAzure(dto.LabelName);
                                                    string safeFile = SanitizeForAzure(Path.GetFileName(fnProp.GetString()!));
                                                    string dateFolder = DateTime.UtcNow.ToString("yyyy-MM-dd");
                                                    string folder = isSentOrForwarded ? "to-send" : "inbox";
                                                    string blobPath = $"{safeLabel}/{folder}/gmail/{dateFolder}/{safeFile}";

                                                    blobUrl = await _blobService.UploadAsync(
                                                        key: azureKey,
                                                        container: "project",
                                                        filename: blobPath,
                                                        stream: ms
                                                    );
                                                }
                                            }
                                        }

                                        var attachment = new GmailAttachment
                                        {
                                            GmailEmailId = email.Id,
                                            FileName = filename,
                                            MimeType = mimeType,
                                            BlobUrl = blobUrl,
                                            CreatedAt = DateTime.UtcNow
                                        };
                                        _gmailDbContext.GmailAttachments.Add(attachment);
                                    }
                                }
                            }
                            await _gmailDbContext.SaveChangesAsync();
                        }
                    }
                }
                catch (Exception ex)
                {
                    // log the error, continue processing other emails
                    Console.WriteLine($"Error processing email {messageId}: {ex.Message}");
                }
            }

            return Ok(new { message = "Label applied, emails and attachments saved successfully" });
        }
        private static string SanitizeForAzure(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "file";

            input = input.Trim().ToLowerInvariant();
            var invalidChars = Path.GetInvalidFileNameChars();
            var sb = new StringBuilder(input.Length);
            foreach (var ch in input)
            {
                if (invalidChars.Contains(ch) || ch == '/' || ch == '\\')
                    sb.Append('_');
                else
                    sb.Append(ch);
            }
            return string.IsNullOrWhiteSpace(sb.ToString()) ? "file" : sb.ToString();
        }

        [HttpPost("sync-label-emails")]
        public async Task<IActionResult> SyncLabelEmails([FromBody] LabelSyncDto dto)
        {
            if (string.IsNullOrEmpty(dto.UserId) || string.IsNullOrEmpty(dto.LabelName))
                return BadRequest("UserId or LabelName missing");

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == dto.UserId);

            if (token == null)
                return Ok(new { message = "Gmail not connected" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.AccessToken);

            var setting = await _dbContext.AppSettingMasters
                .FirstOrDefaultAsync(x => x.PresetKey == "AZURE_STORAGE_KEY");

            if (setting == null || string.IsNullOrEmpty(setting.PresetValue))
                throw new Exception("Azure Blob connection string not found");

            string azureKey = setting.PresetValue;

            string ExtractPrefix(string s)
            {
                if (string.IsNullOrWhiteSpace(s)) return "";
                var match = Regex.Match(s.Trim(), @"^\d+\s*(\([A-Za-z]+\))?");
                return match.Success
                    ? match.Value.Replace(" ", "").ToUpper()
                    : "";
            }

            var labelsJson = await client.GetStringAsync(
                "https://gmail.googleapis.com/gmail/v1/users/me/labels");

            using var labelsDoc = JsonDocument.Parse(labelsJson);

            string? labelId = null;
            string? actualLabelName = null;

            var searchPrefix = ExtractPrefix(dto.LabelName);

            if (labelsDoc.RootElement.TryGetProperty("labels", out var labels))
            {
                foreach (var l in labels.EnumerateArray())
                {
                    var name = l.GetProperty("name").GetString() ?? "";
                    var labelPrefix = ExtractPrefix(name);

                    if (labelPrefix == searchPrefix)
                    {
                        labelId = l.GetProperty("id").GetString()?.Trim();
                        actualLabelName = name;
                        break;
                    }
                }
            }

            if (string.IsNullOrEmpty(labelId))
                return Ok(new { message = $"No Gmail label found for prefix '{searchPrefix}'" });

            var lastSync = await _gmailDbContext.GmailEmails
                .Where(e => e.UserId == dto.UserId && e.LabelName == actualLabelName)
                .OrderByDescending(e => e.Date)
                .Select(e => (DateTime?)e.Date)
                .FirstOrDefaultAsync();

            string? nextPageToken = null;
            string userEmail = await GetUserEmail(dto.UserId);

            do
            {
                var url = $"https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds={labelId}&maxResults=100";

                if (lastSync.HasValue)
                    url += $"&q=after:{lastSync.Value:yyyy/MM/dd}";

                if (!string.IsNullOrEmpty(nextPageToken))
                    url += $"&pageToken={nextPageToken}";

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);

                var listJson = await client.GetStringAsync(url);
                using var listDoc = JsonDocument.Parse(listJson);

                if (!listDoc.RootElement.TryGetProperty("messages", out var messages))
                    break;

                foreach (var msg in messages.EnumerateArray())
                {
                    if (!msg.TryGetProperty("threadId", out var threadProp))
                        continue;

                    var threadId = threadProp.GetString()?.Trim();
                    if (string.IsNullOrEmpty(threadId)) continue;

                    var threadJson = await client.GetStringAsync(
                        $"https://gmail.googleapis.com/gmail/v1/users/me/threads/{threadId}");

                    using var threadDoc = JsonDocument.Parse(threadJson);

                    if (!threadDoc.RootElement.TryGetProperty("messages", out var threadMessages))
                        continue;

                    foreach (var tmsg in threadMessages.EnumerateArray())
                    {
                        if (!tmsg.TryGetProperty("id", out var idProp))
                            continue;

                        var messageId = idProp.GetString()?.Trim();
                        if (string.IsNullOrEmpty(messageId)) continue;

                        var existingEmail = await _gmailDbContext.GmailEmails
                            .FirstOrDefaultAsync(e =>
                                e.MessageId == messageId &&
                                e.UserId == dto.UserId);

                        if (existingEmail != null)
                        {
                            existingEmail.LabelId = labelId;
                            existingEmail.LabelName = actualLabelName!;
                            await _gmailDbContext.SaveChangesAsync();
                            continue;
                        }

                        if (!tmsg.TryGetProperty("payload", out var payload) ||
                            !payload.TryGetProperty("headers", out var headers))
                            continue;

                        string GetHeader(string name)
                        {
                            foreach (var h in headers.EnumerateArray())
                            {
                                if (h.GetProperty("name").GetString() == name)
                                    return h.GetProperty("value").GetString() ?? "";
                            }
                            return "";
                        }

                        string from = GetHeader("From").Trim();
                        string to = GetHeader("To").Trim();
                        string cc = GetHeader("Cc").Trim();

                        var email = new GmailEmail
                        {
                            UserId = dto.UserId,
                            MessageId = messageId,
                            ThreadId = threadId,
                            LabelId = labelId,
                            LabelName = actualLabelName!,
                            Subject = GetHeader("Subject").Trim(),
                            From = from,
                            To = to,
                            Cc = cc,
                            Date = DateTime.TryParse(GetHeader("Date"), out var d)
                                ? d
                                : DateTime.UtcNow,
                            Snippet = tmsg.TryGetProperty("snippet", out var snip)
                                ? snip.GetString() ?? ""
                                : "",
                            Body = await BuildEmailHtml(payload, client, messageId),
                            CreatedAt = DateTime.UtcNow
                        };

                        _gmailDbContext.GmailEmails.Add(email);
                        await _gmailDbContext.SaveChangesAsync();

                        if (payload.TryGetProperty("parts", out var parts))
                        {
                            foreach (var part in parts.EnumerateArray())
                            {
                                if (!part.TryGetProperty("filename", out var fnProp))
                                    continue;

                                var filename = fnProp.GetString();
                                if (string.IsNullOrWhiteSpace(filename)) continue;

                                if (!part.TryGetProperty("body", out var body) ||
                                    !body.TryGetProperty("attachmentId", out var attProp))
                                    continue;

                                var attachmentId = attProp.GetString();
                                if (string.IsNullOrEmpty(attachmentId)) continue;

                                var attachJson = await client.GetStringAsync(
                                    $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/{attachmentId}");

                                using var attachDoc = JsonDocument.Parse(attachJson);

                                if (!attachDoc.RootElement.TryGetProperty("data", out var dataProp))
                                    continue;

                                var bytes = Convert.FromBase64String(
                                    dataProp.GetString()!
                                        .Replace('-', '+')
                                        .Replace('_', '/'));

                                using var ms = new MemoryStream(bytes);

                                string folder = from.ToLower().Contains(userEmail.ToLower())
                                    ? "to-send"
                                    : "inbox";

                                string blobPath =
                                    $"{SanitizeForAzure(actualLabelName!)}/{folder}/gmail/{DateTime.UtcNow:yyyy-MM-dd}/{SanitizeForAzure(filename)}";

                                var blobUrl = await _blobService.UploadAsync(
                                    azureKey, "project", blobPath, ms);

                                _gmailDbContext.GmailAttachments.Add(new GmailAttachment
                                {
                                    GmailEmailId = email.Id,
                                    FileName = filename,
                                    MimeType = part.TryGetProperty("mimeType", out var mt)
                                        ? mt.GetString()!
                                        : "application/octet-stream",
                                    BlobUrl = blobUrl,
                                    CreatedAt = DateTime.UtcNow
                                });
                            }
                        }
                    }
                }

                nextPageToken = listDoc.RootElement
                    .TryGetProperty("nextPageToken", out var next)
                        ? next.GetString()
                        : null;

            } while (!string.IsNullOrEmpty(nextPageToken));

            await _gmailDbContext.SaveChangesAsync();

            return Ok(new { message = "Bulk label sync completed successfully" });
        }
        private async Task<string> GetUserEmail(string userId)
        {
            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (token == null) return "";

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.AccessToken);

            var profileJson = await client.GetStringAsync("https://gmail.googleapis.com/gmail/v1/users/me/profile");
            var profileDoc = JsonDocument.Parse(profileJson);

            var emailAddress = profileDoc.RootElement.GetProperty("emailAddress").GetString();
            return emailAddress ?? "";
        }

        [HttpGet("emails/label")]
        public async Task<IActionResult> GetEmailsByExactLabel(
            [FromQuery] string userId,
            [FromQuery] string labelName,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? pageToken = null)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("User is not authenticated.");

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (token == null)
                return Ok(new { emails = new List<GmailEmailDto>(), total = 0, nextPageToken = (string?)null, label = (string?)null });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.AccessToken);

            var labelsJson = await client.GetStringAsync("https://gmail.googleapis.com/gmail/v1/users/me/labels");
            using var labelsDoc = JsonDocument.Parse(labelsJson);

            string ExtractPrefix(string s)
            {
                if (string.IsNullOrWhiteSpace(s)) return "";
                var match = Regex.Match(s.Trim(), @"^\d+(\([A-Z]\))?");
                return match.Success ? match.Value : "";
            }

            var searchPrefix = ExtractPrefix(labelName);
            Console.WriteLine($"Searching for label prefix: '{searchPrefix}'");

            foreach (var l in labelsDoc.RootElement.GetProperty("labels").EnumerateArray())
            {
                Console.WriteLine($"Label: '{l.GetProperty("name").GetString()}' -> Prefix: '{ExtractPrefix(l.GetProperty("name").GetString() ?? "")}'");
            }

            var matchingLabels = labelsDoc.RootElement.GetProperty("labels")
                .EnumerateArray()
                .Where(l => ExtractPrefix(l.GetProperty("name").GetString() ?? "") == searchPrefix)
                .ToList();

            if (!matchingLabels.Any())
            {
                Console.WriteLine($"No matching Gmail label found for prefix '{searchPrefix}'");
                return Ok(new { emails = new List<GmailEmailDto>(), total = 0, nextPageToken = (string?)null, label = (string?)null });
            }

            var label = matchingLabels.First();
            var labelId = label.GetProperty("id").GetString();
            var actualLabelName = label.GetProperty("name").GetString();

            Console.WriteLine($"Selected Gmail label: {actualLabelName}");

            var labelDetailsJson = await client.GetStringAsync($"https://gmail.googleapis.com/gmail/v1/users/me/labels/{labelId}");
            using var labelDetailsDoc = JsonDocument.Parse(labelDetailsJson);
            int totalEmails = labelDetailsDoc.RootElement.GetProperty("messagesTotal").GetInt32();

            var url = $"https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds={labelId}&maxResults={pageSize}";
            if (!string.IsNullOrEmpty(pageToken))
                url += $"&pageToken={pageToken}";

            var msgListJson = await client.GetStringAsync(url);
            using var msgListDoc = JsonDocument.Parse(msgListJson);

            var emails = new List<GmailEmailDto>();

            if (msgListDoc.RootElement.TryGetProperty("messages", out var messages))
            {
                foreach (var msg in messages.EnumerateArray())
                {
                    var messageId = msg.GetProperty("id").GetString();
                    var msgJson = await client.GetStringAsync(
                        $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}?format=full");
                    using var msgDoc = JsonDocument.Parse(msgJson);

                    var root = msgDoc.RootElement;
                    var payload = root.GetProperty("payload");

                    string subject = "", from = "", to = "", cc = "", bcc = "", dateRaw = "", rfcMessageId = "";

                    foreach (var h in payload.GetProperty("headers").EnumerateArray())
                    {
                        var name = h.GetProperty("name").GetString();
                        var value = h.GetProperty("value").GetString();

                        switch (name)
                        {
                            case "Subject": subject = value ?? ""; break;
                            case "From": from = value ?? ""; break;
                            case "To": to = value ?? ""; break;
                            case "Cc": cc = value ?? ""; break;
                            case "Bcc": bcc = value ?? ""; break;
                            case "Message-ID": rfcMessageId = value ?? ""; break;
                            case "Date": dateRaw = value ?? ""; break;
                        }
                    }

                    DateTime.TryParse(dateRaw, out var date);
                    var body = await BuildEmailHtml(payload, client, messageId);
                    var attachments = ExtractAttachmentsRecursive(payload);
                    bool isUnread = root.TryGetProperty("labelIds", out var lids) &&
                                    lids.EnumerateArray().Any(x => x.GetString() == "UNREAD");

                    emails.Add(new GmailEmailDto
                    {
                        MessageId = messageId,
                        RfcMessageId = rfcMessageId ?? messageId,
                        ThreadId = root.GetProperty("threadId").GetString() ?? "",
                        Subject = subject,
                        From = from,
                        To = to,
                        Cc = cc,
                        Bcc = bcc,
                        Body = body,
                        Snippet = root.GetProperty("snippet").GetString() ?? "",
                        Date = date,
                        Attachments = attachments,
                        Read = !isUnread
                    });
                }
            }

            string? nextPageTokenValue =
                msgListDoc.RootElement.TryGetProperty("nextPageToken", out var tokenProp)
                    ? tokenProp.GetString()
                    : null;

            return Ok(new
            {
                emails,
                total = totalEmails,
                nextPageToken = nextPageTokenValue,
                label = new { id = labelId, name = actualLabelName }
            });
        }
        private List<GmailAttachmentDto> ExtractAttachmentsRecursive(JsonElement element)
        {
            var list = new List<GmailAttachmentDto>();

            if (element.TryGetProperty("parts", out var parts))
            {
                foreach (var part in parts.EnumerateArray())
                {
                    if (part.TryGetProperty("filename", out var filenameProp) &&
                        !string.IsNullOrEmpty(filenameProp.GetString()))
                    {
                        var att = new GmailAttachmentDto
                        {
                            FileName = filenameProp.GetString(),
                            MimeType = part.GetProperty("mimeType").GetString(),
                            AttachmentId = part.GetProperty("body").GetProperty("attachmentId").GetString(),
                            Size = part.GetProperty("body").GetProperty("size").GetInt32()
                        };
                        list.Add(att);
                    }
                    list.AddRange(ExtractAttachmentsRecursive(part));
                }
            }

            return list;
        }

        private async Task<string> BuildEmailHtml(
            JsonElement payload,
            HttpClient client,
            string messageId)
        {
            var html = GetHtmlBody(payload);
            if (string.IsNullOrEmpty(html)) return "";

            var images = await ExtractInlineImages(payload, client, messageId);

            foreach (var img in images)
            {
                html = Regex.Replace(
                    html,
                    $"cid:{Regex.Escape(img.Key)}[^\"'>]*",
                    img.Value,
                    RegexOptions.IgnoreCase);
            }

            return html;
        }

        private string GetHtmlBody(JsonElement payload)
        {
            if (payload.TryGetProperty("mimeType", out var mime) &&
                mime.GetString() == "text/html" &&
                payload.TryGetProperty("body", out var body) &&
                body.TryGetProperty("data", out var data))
            {
                return DecodeBase64Url(data.GetString());
            }

            if (payload.TryGetProperty("parts", out var parts))
            {
                foreach (var part in parts.EnumerateArray())
                {
                    var html = GetHtmlBody(part);
                    if (!string.IsNullOrEmpty(html)) return html;
                }
            }

            return "";
        }

        private async Task<Dictionary<string, string>> ExtractInlineImages(
            JsonElement payload,
            HttpClient client,
            string messageId)
        {
            var images = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            await WalkParts(payload, client, messageId, images);
            return images;
        }

        private async Task WalkParts(
            JsonElement part,
            HttpClient client,
            string messageId,
            Dictionary<string, string> images)
        {
            if (part.TryGetProperty("mimeType", out var mimeProp))
            {
                var mime = mimeProp.GetString();

                if (mime != null && mime.StartsWith("image/"))
                {
                    string contentId = null;

                    if (part.TryGetProperty("headers", out var headers))
                    {
                        foreach (var h in headers.EnumerateArray())
                        {
                            if (h.GetProperty("name").GetString()
                                .Equals("Content-Id", StringComparison.OrdinalIgnoreCase))
                            {
                                contentId = h.GetProperty("value")
                                    .GetString()
                                    ?.Trim('<', '>')
                                    ?.Split('@')[0];
                                break;
                            }
                        }
                    }

                    if (!string.IsNullOrEmpty(contentId) &&
                        part.TryGetProperty("body", out var body) &&
                        body.TryGetProperty("attachmentId", out var attachId))
                    {
                        var res = await client.GetAsync(
                            $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/{attachId.GetString()}");

                        var json = await res.Content.ReadAsStringAsync();
                        var doc = JsonDocument.Parse(json);

                        var raw = doc.RootElement.GetProperty("data").GetString();
                        var bytes = Convert.FromBase64String(
                            raw.Replace('-', '+').Replace('_', '/'));

                        images[contentId] =
                            $"data:{mime};base64,{Convert.ToBase64String(bytes)}";
                    }
                }
            }

            if (part.TryGetProperty("parts", out var parts))
            {
                foreach (var child in parts.EnumerateArray())
                {
                    await WalkParts(child, client, messageId, images);
                }
            }
        }

        private string DecodeBase64Url(string input)
        {
            input = input.Replace('-', '+').Replace('_', '/')
                        .Replace("\r", "").Replace("\n", "");

            switch (input.Length % 4)
            {
                case 2: input += "=="; break;
                case 3: input += "="; break;
            }

            return Encoding.UTF8.GetString(Convert.FromBase64String(input));
        }

        [HttpGet("signature")]
        public async Task<IActionResult> GetGmailSignature(
            [FromQuery] string userId,
            [FromQuery] string fromEmail
        )
        {
            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (token == null) return Ok("Gmail not connected");

            if (token.ExpiryTime <= DateTime.UtcNow)
                token = await RefreshAccessTokenAsync(token);

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.AccessToken);

            var response = await client.GetAsync(
                "https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs"
            );

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);

            var sendAs = doc.RootElement
                .GetProperty("sendAs")
                .EnumerateArray()
                .FirstOrDefault(x =>
                    x.GetProperty("sendAsEmail").GetString()
                        ?.Equals(fromEmail, StringComparison.OrdinalIgnoreCase) == true
                );

            var signature =
                sendAs.ValueKind != JsonValueKind.Undefined &&
                sendAs.TryGetProperty("signature", out var sig)
                    ? sig.GetString()
                    : null;

            return Ok(new { signature });
        }

        [HttpPost("by-label")]
        public async Task<IActionResult> GetEmailsByLabel([FromBody] LabelEmailsRequestDto dto)
        {
            if (string.IsNullOrEmpty(dto.LabelName))
                return BadRequest("LabelName is required");

            string ExtractPrefix(string s)
            {
                if (string.IsNullOrWhiteSpace(s)) return "";

                var match = Regex.Match(s.Trim(), @"^\d+\s*(\([A-Za-z]+\))?");
                return match.Success
                    ? match.Value.Replace(" ", "").ToUpper()
                    : "";
            }

            var searchPrefix = ExtractPrefix(dto.LabelName);

            if (string.IsNullOrEmpty(searchPrefix))
                return Ok(new { threads = new List<object>(), totalEmails = 0 });

            var filteredQuery = _gmailDbContext.GmailEmails
                .Where(e =>
                    e.LabelName
                        .Replace(" ", "")
                        .ToUpper()
                        .StartsWith(searchPrefix)
                );

            var totalEmails = await filteredQuery.CountAsync();

            var emails = await filteredQuery
                .OrderByDescending(e => e.Date)
                .Skip((dto.PageNumber - 1) * dto.PageSize)
                .Take(dto.PageSize)
                .Select(e => new
                {
                    e.Id,
                    e.ThreadId,
                    e.Subject,
                    e.From,
                    e.To,
                    e.Cc,
                    e.Date,
                    e.Snippet,
                    e.Body,
                    Attachments = _gmailDbContext.GmailAttachments
                        .Where(a => a.GmailEmailId == e.Id)
                        .Select(a => new
                        {
                            a.FileName,
                            a.MimeType,
                            a.BlobUrl
                        })
                        .ToList()
                })
                .ToListAsync();

            var threads = emails
                .GroupBy(e => e.ThreadId)
                .Select(g =>
                {
                    var ordered = g.OrderBy(x => x.Date).ToList();
                    var latest = ordered.Last();

                    return new
                    {
                        ThreadId = g.Key,
                        Subject = latest.Subject,
                        From = latest.From,
                        Date = latest.Date,
                        Snippet = latest.Snippet,
                        Messages = ordered
                    };
                })
                .ToList();

            return Ok(new
            {
                threads,
                totalEmails
            });
        }

        [HttpPost("mark-read")]
        public async Task<IActionResult> MarkRead([FromBody] MarkReadDto dto)
        {
            if (string.IsNullOrEmpty(dto.UserId) || string.IsNullOrEmpty(dto.MessageId))
                return BadRequest();

            var token = await _dbContext.GmailTokens
                .FirstOrDefaultAsync(x => x.UserId == dto.UserId);

            if (token == null)
                return BadRequest("Gmail not connected");

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            var payload = new
            {
                removeLabelIds = new[] { "UNREAD" }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.AccessToken);

           await client.PostAsync(
                $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{dto.MessageId}/modify",
                content
            );

            return Ok();
        }
        
        [HttpGet("search")]
        public async Task<IActionResult> SearchEmails(
            [FromQuery] string userId, 
            [FromQuery] string query,
            [FromQuery] string? pageToken = null,
            [FromQuery] int pageSize = 20)
        {
            if (string.IsNullOrEmpty(userId)) return BadRequest("UserId missing");
            if (string.IsNullOrEmpty(query)) return Ok(new { emails = new List<object>(), total = 0, nextPageToken = (string?)null });

            var token = await _dbContext.GmailTokens.FirstOrDefaultAsync(x => x.UserId == userId);
            if (token == null) return Ok(new { message = "Gmail not connected" });

            // if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(-1))
            //     token = await RefreshAccessTokenAsync(token);

            if (token.ExpiryTime <= DateTime.UtcNow.AddMinutes(1))
            {
                token = await RefreshAccessTokenAsync(token);
            }

            var (emails, total, nextPageToken) = await _gmailService.SearchEmailsAsync(token.AccessToken, query, pageToken, pageSize);

            return Ok(new
            {
                emails,
                total,
                nextPageToken
            });
        }

        [HttpPost("azure/upload")]
        public async Task<IActionResult> UploadToAzure(IFormFile file)
        {
            if (file == null)
                return BadRequest("No file uploaded");

            var blockedExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                ".exe",".msi",".msp",".mst",".com",".scr",".pif",".application",".gadget",
                ".jar",".bat",".cmd",".vbs",".vbe",".js",".jse",".ws",".wsf",".wsc",".wsh",
                ".ps1",".ps1xml",".ps2",".ps2xml",".psc1",".psc2",".sh",".bash",".ksh",".csh",
                ".php",".php3",".php4",".php5",".phtml",".asp",".aspx",".ascx",".ashx",".asmx",
                ".jsp",".jspa",".cgi",".pl",".py",".rb",".lua",".groovy",".swift",".go",".ts"
            };

            var extension = Path.GetExtension(file.FileName);

            if (string.IsNullOrWhiteSpace(extension) || blockedExtensions.Contains(extension))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "This file type is not allowed."
                });
            }

            var setting = await _dbContext.AppSettingMasters
                .FirstOrDefaultAsync(x => x.PresetKey == "AZURE_STORAGE_KEY");

            if (setting == null || string.IsNullOrWhiteSpace(setting.PresetValue))
                return BadRequest("Azure Blob connection string not configured");

            string azureKey = setting.PresetValue;

            var containerName = "gmailattachment";
            var blobServiceClient = new BlobServiceClient(azureKey);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            await containerClient.CreateIfNotExistsAsync();

            var safeFileName = Path.GetFileName(file.FileName)
                .Replace(" ", "_")
                .Replace("#", "")
                .Replace("?", "");

            var blobName = $"email-attachments/{Guid.NewGuid()}_{safeFileName}";
            var blobClient = containerClient.GetBlobClient(blobName);

            await using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);

            var blobUrl = blobClient.Uri.ToString();

            return Ok(new
            {
                fileName = safeFileName,
                url = blobUrl
            });
        }

        [HttpGet("image-proxy")]
        public async Task<IActionResult> ProxyImage(string url)
        {
            // using var client = new HttpClient();
            var client = _httpClientFactory.CreateClient();

            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return BadRequest();

            var bytes = await response.Content.ReadAsByteArrayAsync();
            var contentType = response.Content.Headers.ContentType?.MediaType ?? "image/jpeg";

            return File(bytes, contentType);
        }
    }
}
