namespace MyCockpitView.WebApi.GmailModule.Dtos;
using System.Text.Json;
public class GmailEmailDto
{
    public string Id { get; set; } = "";
    public string From { get; set; } = "";
    public string To { get; set; } = "";
    public string Cc { get; set; } = "";
    public string Bcc { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Body { get; set; } = "";
    public string Snippet { get; set; } = "";
    public string ThreadId { get; set; } = "";
    public string RfcMessageId { get; set; }
    public string MessageId { get; set; } = "";
    public List<string> ToList { get; set; } = new();
    public List<string> CcList { get; set; } = new();
    public DateTime Date { get; set; }
    public List<GmailAttachmentDto> Attachments { get; set; } = new();
    public string References { get; set; } = "";
    public JsonElement? Payload { get; set; } 
    public DateTime InternalDate { get; set; }
    public string InReplyTo { get; set; } = "";
    public bool Read { get; set; } = true;
    public string? DraftId { get; set; }
    public List<string> Labels { get; set; } = new();
}