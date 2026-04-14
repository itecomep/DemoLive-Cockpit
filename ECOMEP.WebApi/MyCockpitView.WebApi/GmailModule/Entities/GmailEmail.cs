using System;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.GmailModule.Entities
{
    public class GmailEmail
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
        public string ThreadId { get; set; } = string.Empty;
        public string LabelId { get; set; } = string.Empty;
        public string LabelName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;
        public string Cc { get; set; } = string.Empty;
        public string? Bcc { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Snippet { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<GmailAttachment> Attachments { get; set; } = new List<GmailAttachment>();
    }
}
