public class GmailSendDto
{
    public string userId { get; set; } = "";
    public string to { get; set; } = "";
    public string? cc { get; set; }
    public string? bcc { get; set; }
    public string subject { get; set; } = "";
    public string body { get; set; } = "";
    public string? threadId { get; set; }
    public string? replyMessageId { get; set; } 
    public string? references { get; set; }
    public List<AttachmentDto>? Attachments { get; set; }
    public string? draftId { get; set; }
    public string? LabelId { get; set; }
    public string? LabelName { get; set; }
    public List<GmailAttachmentDataDto> attachmentsMeta { get; set; }
}

public class AttachmentDto
{
    public string Name { get; set; } = "";
    public string Content { get; set; } = "";
}

public class GmailAttachmentDataDto
{
    public string Name { get; set; }
    public string Url { get; set; }
}