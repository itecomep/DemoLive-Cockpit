namespace MyCockpitView.WebApi.Models
{
    public class EmailRequest
    {
        public string? ApiKey { get; set; }
        public string? SenderEmail { get; set; }
        public string? SenderName { get; set; }
        public ICollection<string> ToAddresses { get; set; }
        public ICollection<string> CCAddresses { get; set; }
        public ICollection<string> BCCAddresses { get; set; }
        public string? ReplyAddress { get; set; }
        public string? Subject { get; set; }
        public string? MailBody { get; set; }
        public IEnumerable<EmailAttachment> Attachments { get; set; }
        public int Host_SecureSocketOptions { get; set; } = 0;
        public string? SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public EmailRequest()
        {
            ToAddresses = new HashSet<string>();
            CCAddresses = new HashSet<string>();
            BCCAddresses = new HashSet<string>();
        }

    }

}