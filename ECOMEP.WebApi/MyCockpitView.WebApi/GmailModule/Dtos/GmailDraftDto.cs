public class GmailDraftDto
{
    public string UserId { get; set; } = "";
    public string? DraftId { get; set; }
    public string? MessageId { get; set; }
    public string To { get; set; } = "";
    public string? Cc { get; set; }
    public string? Bcc { get; set; }
    public string Subject { get; set; } = "";
    public string Body { get; set; } = "";
    public string? ThreadId { get; set; }
}
