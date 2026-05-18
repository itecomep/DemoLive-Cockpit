using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using MyCockpitView.WebApi.GmailModule.Dtos;


namespace MyCockpitView.WebApi.GmailModule.Services;

public class GmailService : IGmailService
{
    private readonly HttpClient _http;

    public GmailService(HttpClient http)
    {
        _http = http;
    }
    public async Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> GetEmailsAsync(
        string accessToken, string? pageToken = null, int pageSize = 20)
    {
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var labelResponse = await _http.GetAsync("https://gmail.googleapis.com/gmail/v1/users/me/labels");
        labelResponse.EnsureSuccessStatusCode();
        var labelJson = await labelResponse.Content.ReadAsStringAsync();
        using var labelDoc = JsonDocument.Parse(labelJson);

        var labelMap = labelDoc.RootElement
            .GetProperty("labels")
            .EnumerateArray()
            .ToDictionary(
                l => l.GetProperty("id").GetString()!,
                l => l.GetProperty("name").GetString()!
            );

        // int fetchSize = pageSize * 5;
        int fetchSize = pageSize;
        string url = $"https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults={fetchSize}";
        if (!string.IsNullOrEmpty(pageToken))
            url += $"&pageToken={pageToken}";

        var listResponse = await _http.GetAsync(url);
        listResponse.EnsureSuccessStatusCode();

        var listJson = await listResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(listJson);

        var emails = new List<GmailEmailDto>();

        if (!doc.RootElement.TryGetProperty("messages", out var messages))
        {
            int totalEmpty = doc.RootElement.GetProperty("resultSizeEstimate").GetInt32();
            return (emails, totalEmpty, null);
        }

        int maxParallel = 5;
        using var semaphore = new SemaphoreSlim(maxParallel);

        var fetchTasks = messages.EnumerateArray()
            .Select(async msg =>
            {
                await semaphore.WaitAsync();
                try
                {
                    var id = msg.GetProperty("id").GetString()!;
                    // var msgResponse = await _http.GetAsync($"https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}?format=full");
                    var msgResponse = await _http.GetAsync(
                     $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc&metadataHeaders=Subject&metadataHeaders=Date");
                    msgResponse.EnsureSuccessStatusCode();

                    var msgJson = await msgResponse.Content.ReadAsStringAsync();
                    using var msgDoc = JsonDocument.Parse(msgJson);

                    var payload = msgDoc.RootElement.GetProperty("payload");
                    var headers = payload.GetProperty("headers");
                    // var body = ExtractBody(payload);
                    // var attachments = ExtractAttachments(payload);
                    string body = null;
                    var attachments = new List<GmailAttachmentDto>();

                    foreach (var att in attachments)
                    {
                        att.Url = $"/api/gmail/attachment/{id}/{att.AttachmentId}";
                    }

                    // body = await ReplaceInlineImagesAsync(accessToken, body, attachments, id);
                    if (attachments.Any(a => a.IsInline))
                    {
                        body = await ReplaceInlineImagesAsync(accessToken, body, attachments, id);
                    }

                    string from = "", to = "", cc = "", bcc = "", subject = "", messageId = "", dateStr = "";

                    foreach (var h in headers.EnumerateArray())
                    {
                        var name = h.GetProperty("name").GetString();
                        var value = h.GetProperty("value").GetString();

                        switch (name)
                        {
                            case "From": from = value!; break;
                            case "To": to = value!; break;
                            case "Cc": cc = value!; break;
                            case "Bcc": bcc = value!; break;
                            case "Subject": subject = value!; break;
                            case "Message-ID": messageId = value!; break;
                            case "Date": dateStr = value!; break;
                        }
                    }

                    long internalDateMs = 0;
                    var internalDateStr = msgDoc.RootElement.GetProperty("internalDate").GetString();
                    if (!string.IsNullOrEmpty(internalDateStr))
                        long.TryParse(internalDateStr, out internalDateMs);

                    DateTime emailDate = DateTimeOffset.FromUnixTimeMilliseconds(internalDateMs).LocalDateTime;

                    bool isUnread = false;
                    var emailLabels = new List<string>();

                    if (msgDoc.RootElement.TryGetProperty("labelIds", out var labelIds))
                    {
                        foreach (var l in labelIds.EnumerateArray())
                        {
                            var labelId = l.GetString();
                            if (labelId == "UNREAD") isUnread = true;

                            if (labelId != null && labelMap.ContainsKey(labelId))
                            {
                                var labelName = labelMap[labelId];
                                var systemLabels = new[]
                                { "INBOX","IMPORTANT","CATEGORY_PERSONAL","CATEGORY_SOCIAL","CATEGORY_PROMOTIONS",
                                "CATEGORY_UPDATES","CATEGORY_FORUMS","SENT","DRAFT","UNREAD","STARRED","TRASH","SPAM"};

                                if (!systemLabels.Contains(labelName))
                                    emailLabels.Add(labelName);
                            }
                        }
                    }

                    // return new GmailEmailDto
                    // {
                    //     Id = id,
                    //     ThreadId = msgDoc.RootElement.GetProperty("threadId").GetString()!,
                    //     From = from,
                    //     To = to,
                    //     Cc = cc,
                    //     Bcc = bcc,
                    //     Subject = subject,
                    //     Body = body,
                    //     Snippet = msgDoc.RootElement.GetProperty("snippet").GetString()!,
                    //     Date = emailDate,
                    //     MessageId = messageId,
                    //     RfcMessageId = messageId,
                    //     Attachments = attachments.Where(a => !a.IsInline).ToList(),
                    //     Read = !isUnread,
                    //     Labels = emailLabels
                    // };
                    return new GmailEmailDto
                    {
                        Id = id,
                        ThreadId = msgDoc.RootElement.GetProperty("threadId").GetString()!,
                        From = from,
                        To = to,
                        Cc = cc,
                        Bcc = bcc,
                        Subject = subject,
                        Snippet = msgDoc.RootElement.GetProperty("snippet").GetString()!,
                        Date = emailDate,
                        Read = !isUnread,
                        Attachments = new List<GmailAttachmentDto>(),
                        Labels = emailLabels
                    };
                }
                finally
                {
                    semaphore.Release();
                }
            });

        var allEmails = (await Task.WhenAll(fetchTasks)).ToList();
        var uniqueThreads = allEmails
            .GroupBy(e => e.ThreadId)
            .Select(g => g.OrderByDescending(x => x.Date).First())
            .Take(pageSize)
            .ToList();

        int totalEmails = doc.RootElement.GetProperty("resultSizeEstimate").GetInt32();
        string? nextPageToken = doc.RootElement.TryGetProperty("nextPageToken", out var tokenEl)
            ? tokenEl.GetString()
            : null;

        return (uniqueThreads, totalEmails, nextPageToken);
    }
    public async Task<int> GetTotalEmailCount(string accessToken)
    {
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var listResponse = await _http.GetAsync("https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=1");
        listResponse.EnsureSuccessStatusCode();
        var listJson = await listResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(listJson);
        if (doc.RootElement.TryGetProperty("resultSizeEstimate", out var countProp))
            return countProp.GetInt32();
        return 0;
    }
    public async Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> GetDraftEmailsAsync(
        string accessToken, string? pageToken = null, int pageSize = 20)
    {
        var emails = new List<GmailEmailDto>();

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var listUrl = $"https://gmail.googleapis.com/gmail/v1/users/me/drafts?pageToken={pageToken}&maxResults={pageSize}";
        var listResponse = await client.GetAsync(listUrl);
        listResponse.EnsureSuccessStatusCode();
        var listJson = await listResponse.Content.ReadAsStringAsync();
        using var listDoc = JsonDocument.Parse(listJson);

        var root = listDoc.RootElement;
        string? nextPageToken = root.TryGetProperty("nextPageToken", out var tokenProp) ? tokenProp.GetString() : null;

        if (!root.TryGetProperty("drafts", out var drafts))
            return (emails, 0, nextPageToken);

        foreach (var draftItem in drafts.EnumerateArray())
        {
            if (!draftItem.TryGetProperty("id", out var draftIdProp))
                continue;

            string draftId = draftIdProp.GetString() ?? "";
            var messageUrl = $"https://gmail.googleapis.com/gmail/v1/users/me/drafts/{draftId}";
            var msgResponse = await client.GetAsync(messageUrl);
            msgResponse.EnsureSuccessStatusCode();
            var msgJson = await msgResponse.Content.ReadAsStringAsync();
            using var msgDoc = JsonDocument.Parse(msgJson);

            if (!msgDoc.RootElement.TryGetProperty("message", out var message))
                continue;

            string id = message.TryGetProperty("id", out var idProp) ? idProp.GetString() ?? "" : "";
            string threadId = message.TryGetProperty("threadId", out var threadProp) ? threadProp.GetString() ?? "" : "";
            string snippet = message.TryGetProperty("snippet", out var snippetProp) ? snippetProp.GetString() ?? "" : "";

            string from = "", to = "", cc = "", bcc = "", subject = "", body = "";

            if (message.TryGetProperty("payload", out var payload))
            {
                if (payload.TryGetProperty("headers", out var headers))
                {
                    foreach (var h in headers.EnumerateArray())
                    {
                        var name = h.TryGetProperty("name", out var n) ? n.GetString() : null;
                        var value = h.TryGetProperty("value", out var v) ? v.GetString() ?? "" : "";
                        if (string.IsNullOrEmpty(name)) continue;

                        switch (name)
                        {
                            case "From": from = value; break;
                            case "To": to = value; break;
                            case "Cc": cc = value; break;
                            case "Bcc": bcc = value; break;
                            case "Subject": subject = value; break;
                        }
                    }
                }

                body = ExtractBody(payload);
                var attachments = ExtractAttachments(payload, body);

                long internalDateMs = 0;
                if (message.TryGetProperty("internalDate", out var internalDateProp))
                {
                    long.TryParse(internalDateProp.GetString(), out internalDateMs);
                }

                DateTime emailDate = internalDateMs > 0
                    ? DateTimeOffset.FromUnixTimeMilliseconds(internalDateMs).LocalDateTime
                    : DateTime.UtcNow;

                emails.Add(new GmailEmailDto
                {
                    Id = id,
                    DraftId = draftId,
                    ThreadId = threadId,
                    From = from,
                    To = to,
                    Cc = cc,
                    Bcc = bcc,
                    Subject = subject,
                    Snippet = snippet,
                    Body = body,
                    Attachments = attachments.Where(a => !a.IsInline).ToList(),
                    Read = true,
                    Date = emailDate
                });
            }
        }

        return (emails, emails.Count, nextPageToken);
    }

    public async Task<object> CreateDraftAsync(string accessToken, GmailDraftDto dto)
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);

        var mimeParts = new List<string>
        {
            $"From: {dto.UserId}",
            $"To: {dto.To}"
        };

        if (!string.IsNullOrEmpty(dto.Cc))
            mimeParts.Add($"Cc: {dto.Cc}");
        if (!string.IsNullOrEmpty(dto.Bcc))
            mimeParts.Add($"Bcc: {dto.Bcc}");

        // mimeParts.Add($"Subject: {dto.Subject}");
        mimeParts.Add($"Subject: =?UTF-8?B?{Convert.ToBase64String(Encoding.UTF8.GetBytes(dto.Subject))}?=");
        mimeParts.Add("MIME-Version: 1.0");
        mimeParts.Add("Content-Type: text/html; charset=UTF-8");
        mimeParts.Add("");
        mimeParts.Add(dto.Body);

        var raw = Convert.ToBase64String(
                    Encoding.UTF8.GetBytes(string.Join("\r\n", mimeParts)))
                    .Replace("+", "-")
                    .Replace("/", "_")
                    .TrimEnd('=');

        var payload = new
        {
            id = dto.DraftId,
            message = new
            {
                raw,
                threadId = dto.ThreadId
            }
        };

        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json");

        HttpResponseMessage response;

        if (!string.IsNullOrEmpty(dto.DraftId))
        {
            response = await client.PutAsync(
                $"https://gmail.googleapis.com/gmail/v1/users/me/drafts/{dto.DraftId}",
                content);
        }
        else
        {
            response = await client.PostAsync(
                "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
                content);
        }

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<object>(json)!;
    }

    public async Task DeleteDraftAsync(string accessToken, string draftId)
    {
        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _http.DeleteAsync(
            $"https://gmail.googleapis.com/gmail/v1/users/me/drafts/{draftId}");

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception("Draft delete failed: " + error);
        }
    }

    public async Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> GetSentEmailsAsync(
    string accessToken, string? pageToken = null, int pageSize = 20)
    {
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        // int fetchSize = pageSize * 5;
        int fetchSize = pageSize;

        string url = $"https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=SENT&maxResults={fetchSize}";
        if (!string.IsNullOrEmpty(pageToken))
            url += $"&pageToken={pageToken}";

        var listResponse = await _http.GetAsync(url);
        listResponse.EnsureSuccessStatusCode();

        var listJson = await listResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(listJson);

        var emails = new List<GmailEmailDto>();

        if (!doc.RootElement.TryGetProperty("messages", out var messages))
        {
            int totalEmpty = doc.RootElement.GetProperty("resultSizeEstimate").GetInt32();
            return (emails, totalEmpty, null);
        }

        int maxParallel = 5;
        using var semaphore = new SemaphoreSlim(maxParallel);

        var fetchTasks = messages.EnumerateArray()
            .Select(async msg =>
            {
                await semaphore.WaitAsync();
                try
                {
                    var id = msg.GetProperty("id").GetString()!;
                    // var msgResponse = await _http.GetAsync($"https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}?format=full");
                    // msgResponse.EnsureSuccessStatusCode();

                    // var msgJson = await msgResponse.Content.ReadAsStringAsync();
                    // using var msgDoc = JsonDocument.Parse(msgJson);

                    // var payload = msgDoc.RootElement.GetProperty("payload");
                    // var headers = payload.GetProperty("headers");
                    // var body = ExtractBody(payload);
                    // var attachments = ExtractAttachments(payload);

                    var msgResponse = await _http.GetAsync(
                    $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc&metadataHeaders=Subject&metadataHeaders=Date");

                    msgResponse.EnsureSuccessStatusCode();
                    var msgJson = await msgResponse.Content.ReadAsStringAsync();
                    using var msgDoc = JsonDocument.Parse(msgJson);
                    var payload = msgDoc.RootElement.GetProperty("payload");
                    var headers = payload.GetProperty("headers");
                    string body = null;
                    var attachments = new List<GmailAttachmentDto>();

                    foreach (var att in attachments)
                    {
                        att.Url = $"/api/gmail/attachment/{id}/{att.AttachmentId}";
                    }

                    // body = await ReplaceInlineImagesAsync(accessToken, body, attachments, id);
                    if (attachments.Any(a => a.IsInline))
                    {
                        body = await ReplaceInlineImagesAsync(accessToken, body, attachments, id);
                    }

                    string from = "", to = "", cc = "", bcc = "", subject = "", messageId = "";

                    foreach (var h in headers.EnumerateArray())
                    {
                        var name = h.GetProperty("name").GetString();
                        var value = h.GetProperty("value").GetString();

                        switch (name)
                        {
                            case "From": from = value!; break;
                            case "To": to = value!; break;
                            case "Cc": cc = value!; break;
                            case "Bcc": bcc = value!; break;
                            case "Subject": subject = value!; break;
                            case "Message-ID": messageId = value!; break;
                        }
                    }

                    long internalDateMs = 0;
                    var internalDateStr = msgDoc.RootElement.GetProperty("internalDate").GetString();
                    if (!string.IsNullOrEmpty(internalDateStr))
                        long.TryParse(internalDateStr, out internalDateMs);

                    DateTime emailDate = DateTimeOffset.FromUnixTimeMilliseconds(internalDateMs).LocalDateTime;

                    // return new GmailEmailDto
                    // {
                    //     Id = id,
                    //     ThreadId = msgDoc.RootElement.GetProperty("threadId").GetString()!,
                    //     From = from,
                    //     To = to,
                    //     Cc = cc,
                    //     Bcc = bcc,
                    //     Subject = subject,
                    //     Body = body,
                    //     Snippet = msgDoc.RootElement.GetProperty("snippet").GetString()!,
                    //     Date = emailDate,
                    //     MessageId = messageId,
                    //     RfcMessageId = messageId,
                    //     Attachments = attachments.Where(a => !a.IsInline).ToList(),
                    //     Read = true
                    // };

                    return new GmailEmailDto
                    {
                        Id = id,
                        ThreadId = msgDoc.RootElement.GetProperty("threadId").GetString()!,
                        From = from,
                        To = to,
                        Cc = cc,
                        Bcc = bcc,
                        Subject = subject,
                        Snippet = msgDoc.RootElement.GetProperty("snippet").GetString()!,
                        Date = emailDate,
                        Read = true,
                        Attachments = new List<GmailAttachmentDto>() // empty
                    };
                }
                finally
                {
                    semaphore.Release();
                }
            });

        var allEmails = (await Task.WhenAll(fetchTasks)).ToList();

        var uniqueThreads = allEmails
            .GroupBy(e => e.ThreadId)
            .Select(g => g.OrderByDescending(x => x.Date).First())
            .Take(pageSize)
            .ToList();

        int totalEmails = doc.RootElement.GetProperty("resultSizeEstimate").GetInt32();
        string? nextPageToken = doc.RootElement.TryGetProperty("nextPageToken", out var tokenEl)
            ? tokenEl.GetString()
            : null;

        return (uniqueThreads, totalEmails, nextPageToken);
    }
    private static string ExtractBody(JsonElement payload)
    {
        string? html = null;
        string? plain = null;

        void Walk(JsonElement part)
        {
            var mimeType = part.GetProperty("mimeType").GetString();

            if (mimeType == "text/html")
            {
                if (part.TryGetProperty("body", out var body) &&
                    body.TryGetProperty("data", out var data))
                {
                    html ??= DecodeBase64Safe(data.GetString());
                }
            }
            else if (mimeType == "text/plain")
            {
                if (part.TryGetProperty("body", out var body) &&
                    body.TryGetProperty("data", out var data))
                {
                    plain ??= DecodeBase64Safe(data.GetString());
                }
            }

            if (part.TryGetProperty("parts", out var parts))
            {
                foreach (var p in parts.EnumerateArray())
                    Walk(p);
            }
        }

        Walk(payload);

        return html ?? plain ?? "";
    }
    private static string DecodeBase64Safe(string? input)
    {
        if (string.IsNullOrEmpty(input)) return "";

        input = input
            .Replace("-", "+")
            .Replace("_", "/");
        switch (input.Length % 4)
        {
            case 2: input += "=="; break;
            case 3: input += "="; break;
        }

        var bytes = Convert.FromBase64String(input);
        return Encoding.UTF8.GetString(bytes);
    }

    public async Task<GmailMessageResponse> SendEmailAsync(
        string accessToken,
        string to,
        string subject,
        string body,
        string? threadId = null,
        string? replyMessageId = null,
        string? references = null,
        List<string>? cc = null,
        List<string>? bcc = null,
        List<string>? attachmentsBase64 = null,
        List<string>? attachmentsFileNames = null)
    {
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var labelResponse = await _http.GetAsync("https://gmail.googleapis.com/gmail/v1/users/me/labels");
        labelResponse.EnsureSuccessStatusCode();

        var labelJson = await labelResponse.Content.ReadAsStringAsync();
        using var labelDoc = JsonDocument.Parse(labelJson);

        var labelMap = labelDoc.RootElement
            .GetProperty("labels")
            .EnumerateArray()
            .Where(l => l.GetProperty("type").GetString() == "user")
            .ToDictionary(
                l => l.GetProperty("id").GetString()!,
                l => l.GetProperty("name").GetString()!
            );

        var emailBuilder = new StringBuilder();

        if (!string.IsNullOrWhiteSpace(replyMessageId))
        {
            string Normalize(string id)
            {
                id = id.Trim();
                if (!id.StartsWith("<")) id = "<" + id;
                if (!id.EndsWith(">")) id += ">";
                return id;
            }

            var inReplyTo = Normalize(replyMessageId);
            emailBuilder.AppendLine($"In-Reply-To: {inReplyTo}");

            if (!string.IsNullOrWhiteSpace(references))
            {
                var refs = references
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .Select(Normalize);

                emailBuilder.AppendLine($"References: {string.Join(" ", refs)} {inReplyTo}");
            }
            else
            {
                emailBuilder.AppendLine($"References: {inReplyTo}");
            }
        }

        emailBuilder.AppendLine($"To: {to}");
        if (cc != null && cc.Count > 0)
            emailBuilder.AppendLine($"Cc: {string.Join(",", cc)}");
        if (bcc != null && bcc.Count > 0)
            emailBuilder.AppendLine($"Bcc: {string.Join(",", bcc)}");

        // emailBuilder.AppendLine($"Subject: {subject}");
        emailBuilder.AppendLine($"Subject: {DecodeHeader(subject)}");
        emailBuilder.AppendLine("MIME-Version: 1.0");

        var boundary = "boundary_" + Guid.NewGuid().ToString();
        emailBuilder.AppendLine($"Content-Type: multipart/mixed; boundary=\"{boundary}\"");
        emailBuilder.AppendLine();

        emailBuilder.AppendLine($"--{boundary}");
        emailBuilder.AppendLine("Content-Type: text/html; charset=UTF-8");
        emailBuilder.AppendLine("Content-Transfer-Encoding: base64");
        emailBuilder.AppendLine();
        // emailBuilder.AppendLine(body);
        emailBuilder.AppendLine(Convert.ToBase64String(Encoding.UTF8.GetBytes(body)));
        emailBuilder.AppendLine();

        if (attachmentsBase64 != null && attachmentsFileNames != null)
        {
            for (int i = 0; i < attachmentsBase64.Count; i++)
            {
                emailBuilder.AppendLine($"--{boundary}");
                emailBuilder.AppendLine($"Content-Type: application/octet-stream; name=\"{attachmentsFileNames[i]}\"");
                emailBuilder.AppendLine("Content-Transfer-Encoding: base64");
                emailBuilder.AppendLine($"Content-Disposition: attachment; filename=\"{attachmentsFileNames[i]}\"");
                emailBuilder.AppendLine();
                emailBuilder.AppendLine(attachmentsBase64[i]);
                emailBuilder.AppendLine();
            }
        }
        emailBuilder.AppendLine($"--{boundary}--");

        var rawMessage = Convert.ToBase64String(Encoding.UTF8.GetBytes(emailBuilder.ToString()))
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');

        var payload = new
        {
            raw = rawMessage,
            threadId = threadId
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await _http.PostAsync("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception(error);
        }

        var responseString = await response.Content.ReadAsStringAsync();
        var sentMessage = JsonSerializer.Deserialize<GmailMessageResponse>(responseString,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        return sentMessage!;
    }

    public async Task<string> GetLoggedInEmailAsync(string accessToken)
    {
        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _http.GetAsync(
            "https://gmail.googleapis.com/gmail/v1/users/me/profile");

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        return doc.RootElement
                .GetProperty("emailAddress")
                .GetString()!;
    }

    // private List<GmailAttachmentDto> ExtractAttachments(JsonElement element)
    // {
    //     var list = new List<GmailAttachmentDto>();
    //     void Walk(JsonElement part)
    //     {
    //         string fileName = part.TryGetProperty("filename", out var filenameProp)
    //             ? filenameProp.GetString()
    //             : null;
    //         string mimeType = part.GetProperty("mimeType").GetString();
    //         string? contentDisposition = null;
    //         string? contentId = null;

    //         if (part.TryGetProperty("headers", out var headers))
    //         {
    //             foreach (var h in headers.EnumerateArray())
    //             {
    //                 var name = h.GetProperty("name").GetString();
    //                 var value = h.GetProperty("value").GetString();
    //                 if (name == "Content-Disposition")
    //                     contentDisposition = value;
    //                 if (name == "Content-ID")
    //                     contentId = value;
    //             }
    //         }

    //         bool isInline = mimeType.StartsWith("image/") && !string.IsNullOrEmpty(contentId);
    //         if (
    //             part.TryGetProperty("body", out var body) &&
    //             body.TryGetProperty("attachmentId", out var attachmentIdProp)
    //         )
    //         {
    //             list.Add(new GmailAttachmentDto
    //             {
    //                 FileName = string.IsNullOrEmpty(fileName) ? "attachment" : fileName,
    //                 MimeType = mimeType,
    //                 AttachmentId = attachmentIdProp.GetString(),
    //                 Size = body.TryGetProperty("size", out var sizeProp) ? sizeProp.GetInt32() : 0,
    //                 ContentId = contentId?.Trim('<', '>'),
    //                 IsInline = isInline
    //             });
    //         }
    //         if (part.TryGetProperty("parts", out var parts))
    //         {
    //             foreach (var p in parts.EnumerateArray())
    //                 Walk(p);
    //         }
    //     }
    //     Walk(element);
    //     return list;
    // }

    private List<GmailAttachmentDto> ExtractAttachments(JsonElement element, string htmlBody)
    {
        var list = new List<GmailAttachmentDto>();
        void Walk(JsonElement part)
        {
            string fileName = part.TryGetProperty("filename", out var filenameProp)
                ? filenameProp.GetString()
                : null;

            string mimeType = part.TryGetProperty("mimeType", out var mimeTypeProp)
                ? mimeTypeProp.GetString()
                : "application/octet-stream";

            string? contentDisposition = null;
            string? contentId = null;

            if (part.TryGetProperty("headers", out var headers))
            {
                foreach (var h in headers.EnumerateArray())
                {
                    var name = h.GetProperty("name").GetString();
                    var value = h.GetProperty("value").GetString();

                    if (
                        name.Equals(
                            "Content-Disposition",
                            StringComparison.OrdinalIgnoreCase
                        )
                    )
                    {
                        contentDisposition = value;
                    }

                    if (
                        name.Equals(
                            "Content-ID",
                            StringComparison.OrdinalIgnoreCase
                        )
                    )
                    {
                        contentId = value;
                    }
                }
            }

            // bool isInline =
            //     !string.IsNullOrEmpty(contentId) &&
            //     !string.IsNullOrEmpty(contentDisposition) &&
            //     contentDisposition.Contains("inline", StringComparison.OrdinalIgnoreCase) &&
            //     mimeType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);

            string cleanedCid = contentId?.Trim('<', '>');

            bool isInline = false;

           if (
                !string.IsNullOrEmpty(cleanedCid)
                && !string.IsNullOrEmpty(htmlBody)
            )
            {
                isInline =
                    htmlBody.Contains(
                        $"cid:{cleanedCid}",
                        StringComparison.OrdinalIgnoreCase
                    )
                    ||
                    htmlBody.Contains(
                        $"cid:<{cleanedCid}>",
                        StringComparison.OrdinalIgnoreCase
                    );
            }

            if (
                part.TryGetProperty("body", out var body)
                && body.TryGetProperty("attachmentId", out var attachmentIdProp)
            )
            {
                list.Add(new GmailAttachmentDto
                {
                    FileName = string.IsNullOrEmpty(fileName)
                        ? "attachment"
                        : fileName,
                    MimeType = mimeType,
                    AttachmentId = attachmentIdProp.GetString(),
                    Size = body.TryGetProperty("size", out var sizeProp)
                        ? sizeProp.GetInt32()
                        : 0,
                    ContentId = contentId?.Trim('<', '>'),
                    IsInline = isInline
                });
            }

            if (part.TryGetProperty("parts", out var parts))
            {
                foreach (var p in parts.EnumerateArray())
                {
                    Walk(p);
                }
            }
        }

        Walk(element);
        return list;
    }
    
    private void ExtractAttachmentsRecursive(JsonElement element, List<GmailAttachmentDto> attachments)
    {
        if (!element.TryGetProperty("parts", out var parts))
            return;

        foreach (var part in parts.EnumerateArray())
        {
            if (part.TryGetProperty("filename", out var filenameProp))
            {
                var filename = filenameProp.GetString();

                if (!string.IsNullOrWhiteSpace(filename) &&
                    part.TryGetProperty("body", out var body) &&
                    body.TryGetProperty("attachmentId", out var attId))
                {
                    string? contentId = null;
                    if (part.TryGetProperty("headers", out var headers))
                    {
                        foreach (var h in headers.EnumerateArray())
                        {
                            if (h.GetProperty("name").GetString() == "Content-ID")
                            {
                                contentId = h.GetProperty("value").GetString()?.Trim('<', '>');
                            }
                        }
                    }

                    attachments.Add(new GmailAttachmentDto
                    {
                        FileName = filename!,
                        MimeType = part.GetProperty("mimeType").GetString() ?? "",
                        AttachmentId = attId.GetString()!,
                        Size = body.TryGetProperty("size", out var size) ? size.GetInt64() : 0,
                        ContentId = contentId
                    });
                }
            }
            ExtractAttachmentsRecursive(part, attachments);
        }
    }

     private async Task<string> ReplaceInlineImagesAsync(string accessToken, string html, List<GmailAttachmentDto> attachments, string messageId)
    {
        var inlineAttachments = attachments.Where(a => a.IsInline).ToList();

        var tasks = inlineAttachments.Select(async att =>
        {
            var cid = att.ContentId?.Trim('<', '>');
            if (string.IsNullOrEmpty(cid)) return (cid, (string?)null);

            var response = await _http.GetAsync(
                $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/{att.AttachmentId}");

            if (!response.IsSuccessStatusCode) return (cid, null);

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var data = doc.RootElement.GetProperty("data").GetString();
            if (string.IsNullOrEmpty(data)) return (cid, null);

            var bytes = Convert.FromBase64String(data.Replace('-', '+').Replace('_', '/'));
            var base64 = Convert.ToBase64String(bytes);

            return (cid, $"data:{att.MimeType};base64,{base64}");
        });

        var results = await Task.WhenAll(tasks);

        foreach (var (cid, dataUri) in results)
        {
            if (cid == null || dataUri == null) continue;

            html = html.Replace($"cid:{cid}", dataUri, StringComparison.OrdinalIgnoreCase);
            html = html.Replace($"cid:<{cid}>", dataUri, StringComparison.OrdinalIgnoreCase);
        }

        return html;
    }


    public async Task<List<GmailEmailDto>> GetThreadMessagesAsync(string accessToken, string threadId, string originalEmailId)
    {
        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _http.GetAsync(
            $"https://gmail.googleapis.com/gmail/v1/users/me/threads/{threadId}"
        );
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        var messages = new List<GmailEmailDto>();

        foreach (var msg in doc.RootElement.GetProperty("messages").EnumerateArray())
        {
            var id = msg.GetProperty("id").GetString()!;
            if (id == originalEmailId) continue;

            var payload = msg.GetProperty("payload");
            var body = ExtractBody(payload);
            var headers = payload.GetProperty("headers");

            // string from = "", to = "", subject = "", messageId = "";

            // foreach (var h in headers.EnumerateArray())
            // {
            //     var name = h.GetProperty("name").GetString();
            //     var value = h.GetProperty("value").GetString();

            //     switch (name)
            //     {
            //         case "From": from = value!; break;
            //         case "To": to = value!; break;
            //         case "Subject": subject = value!; break;
            //         case "Message-ID": messageId = value!; break;
            //     }
            // }

            string from = "", to = "", cc = "", bcc = "", subject = "", messageId = "";

            foreach (var h in headers.EnumerateArray())
            {
                var name = h.GetProperty("name").GetString();
                var value = h.GetProperty("value").GetString();

                switch (name)
                {
                    case "From":
                        from = value!;
                        break;

                    case "To":
                        to = value!;
                        break;

                    case "Cc":
                        cc = value!;
                        break;

                    case "Bcc":
                        bcc = value!;
                        break;

                    case "Subject":
                        subject = value!;
                        break;

                    case "Message-ID":
                        messageId = value!;
                        break;
                }
            }

            long internalDateMs = 0;
            var internalDateElement = msg.GetProperty("internalDate");

            if (internalDateElement.ValueKind == JsonValueKind.String)
                long.TryParse(internalDateElement.GetString(), out internalDateMs);
            else if (internalDateElement.ValueKind == JsonValueKind.Number)
                internalDateMs = internalDateElement.GetInt64();

            var date = internalDateMs > 0
                ? DateTimeOffset.FromUnixTimeMilliseconds(internalDateMs).UtcDateTime
                : DateTime.UtcNow;
            var attachments = ExtractAttachments(payload, body);
            messages.Add(new GmailEmailDto
            {
                Id = id,
                ThreadId = threadId,
                From = from,
                To = to,
                Cc = cc,
                Bcc = bcc,
                Subject = subject,
                Body = body,
                MessageId = messageId,
                Date = date,
                Attachments = attachments.Where(a => !a.IsInline).ToList()
            });
        }

        return messages.OrderBy(m => m.Date).ToList();
    }

    public async Task<JsonElement> GetMessageAsync(string accessToken, string messageId)
    {
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _http.GetAsync($"https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}");
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Failed to get Gmail message: {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.Clone();
    }

    public async Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> SearchEmailsAsync(
        string accessToken,
        string query,
        string? pageToken = null,
        int pageSize = 20)
    {
        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);
        string url = $"https://gmail.googleapis.com/gmail/v1/users/me/messages?q={Uri.EscapeDataString(query)}&maxResults={pageSize}";
        if (!string.IsNullOrEmpty(pageToken))
            url += $"&pageToken={pageToken}";

        var listResponse = await _http.GetAsync(url);
        listResponse.EnsureSuccessStatusCode();
        var listJson = await listResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(listJson);
        var emails = new List<GmailEmailDto>();
        if (!doc.RootElement.TryGetProperty("messages", out var messages))
        {
            int totalEmpty = doc.RootElement.GetProperty("resultSizeEstimate").GetInt32();
            return (emails, totalEmpty, null);
        }
        int maxParallel = 3;
        using var semaphore = new SemaphoreSlim(maxParallel);
        var tasks = messages.EnumerateArray().Select(async msg =>
        {
            await semaphore.WaitAsync();
            try
            {
                var id = msg.GetProperty("id").GetString()!;
                var msgResponse = await _http.GetAsync($"https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}?format=full");
                msgResponse.EnsureSuccessStatusCode();
                var msgJson = await msgResponse.Content.ReadAsStringAsync();
                using var msgDoc = JsonDocument.Parse(msgJson);
                var payload = msgDoc.RootElement.GetProperty("payload");
                var headers = payload.GetProperty("headers");
                var body = ExtractBody(payload);
                var attachments = ExtractAttachments(payload, body);
                foreach (var att in attachments)
                {
                    att.Url = $"/api/gmail/attachment/{id}/{att.AttachmentId}";
                }
                if (attachments.Any(a => a.IsInline))
                {
                    body = await ReplaceInlineImagesAsync(accessToken, body, attachments, id);
                }
                string from = "", to = "", subject = "", messageId = "";
                foreach (var h in headers.EnumerateArray())
                {
                    var name = h.GetProperty("name").GetString();
                    var value = h.GetProperty("value").GetString();
                    switch (name)
                    {
                        case "From": from = value!; break;
                        case "To": to = value!; break;
                        case "Subject": subject = value!; break;
                        case "Message-ID": messageId = value!; break;
                    }
                }

                long internalDateMs = 0;
                var internalDateStr = msgDoc.RootElement.GetProperty("internalDate").GetString();
                if (!string.IsNullOrEmpty(internalDateStr))
                    long.TryParse(internalDateStr, out internalDateMs);

                DateTime emailDate = DateTimeOffset
                    .FromUnixTimeMilliseconds(internalDateMs)
                    .LocalDateTime;

                return new GmailEmailDto
                {
                    Id = id,
                    ThreadId = msgDoc.RootElement.GetProperty("threadId").GetString()!,
                    From = from,
                    To = to,
                    Subject = subject,
                    Body = body,
                    Snippet = msgDoc.RootElement.GetProperty("snippet").GetString()!,
                    Date = emailDate,
                    MessageId = messageId,
                    Attachments = attachments.Where(a => !a.IsInline).ToList(),
                    Read = true
                };
            }
            finally
            {
                semaphore.Release();
            }
        });

        emails = (await Task.WhenAll(tasks)).ToList();
        int total = doc.RootElement.GetProperty("resultSizeEstimate").GetInt32();
        string? nextPageToken = doc.RootElement.TryGetProperty("nextPageToken", out var tokenEl)
            ? tokenEl.GetString()
            : null;
        return (emails, total, nextPageToken);
    }

    private static string DecodeHeader(string header)
    {
        if (string.IsNullOrEmpty(header))
            return "";

        var regex = new System.Text.RegularExpressions.Regex(
            @"=\?([^?]+)\?B\?([^?]+)\?=",
            System.Text.RegularExpressions.RegexOptions.IgnoreCase
        );

        string decoded = regex.Replace(header, m =>
        {
            try
            {
                var encoded = m.Groups[2].Value;
                var bytes = Convert.FromBase64String(encoded);
                return Encoding.UTF8.GetString(bytes);
            }
            catch
            {
                return m.Value;
            }
        });

        var bytesLatin1 = Encoding.GetEncoding("iso-8859-1").GetBytes(decoded);
        return Encoding.UTF8.GetString(bytesLatin1);
    }

    public async Task<GmailEmailDto> GetFullEmailById(string accessToken, string id)
    {
        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _http.GetAsync(
            $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}?format=full");

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        var payload = doc.RootElement.GetProperty("payload");
        var headers = payload.GetProperty("headers");

        var body = ExtractBody(payload);
        var attachments = ExtractAttachments(payload, body);

        if (attachments.Any(a => a.IsInline))
        {
            body = await ReplaceInlineImagesAsync(accessToken, body, attachments, id);
        }

        string from = "", to = "", subject = "";

        foreach (var h in headers.EnumerateArray())
        {
            var name = h.GetProperty("name").GetString();
            var value = h.GetProperty("value").GetString();

            switch (name)
            {
                case "From": from = value!; break;
                case "To": to = value!; break;
                case "Subject": subject = value!; break;
            }
        }

        return new GmailEmailDto
        {
            Id = id,
            From = from,
            To = to,
            Subject = subject,
            Body = body,
            Attachments = attachments.Where(a => !a.IsInline).ToList()
        };
    }

    public async Task<string> GetValidAccessTokenAsync(GmailToken token)
    {
        if (token.ExpiryTime > DateTime.UtcNow.AddMinutes(-5))
        {
            return token.AccessToken;
        }
        return token.AccessToken;
    }
}
