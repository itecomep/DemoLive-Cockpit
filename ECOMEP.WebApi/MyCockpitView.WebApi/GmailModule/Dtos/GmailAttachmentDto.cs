public class GmailAttachmentDto
{
    public string FileName { get; set; } = "";
    public string MimeType { get; set; } = "";
    public string AttachmentId { get; set; } = "";
    public long Size { get; set; }
    public string? ContentId { get; set; }
    public bool IsInline => !string.IsNullOrEmpty(ContentId);
    public string Url { get; set; } 
    public string MessageId { get; set; } = "";

}
