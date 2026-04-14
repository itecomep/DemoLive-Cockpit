using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.GmailModule.Entities
{
    public class GmailAttachment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GmailEmailId { get; set; }

        [ForeignKey(nameof(GmailEmailId))]
        public GmailEmail GmailEmail { get; set; } = null!;

        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string MimeType { get; set; } = string.Empty;

        [Required]
        public string BlobUrl { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("MailAttachmentData")]
    public class GmailAttachmentData
    {
        public int Id { get; set; }
        public string MessageId { get; set; }
        public string ThreadId { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string FromMail { get; set; }
        public string FileName { get; set; }
        public string BlobUrl { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
