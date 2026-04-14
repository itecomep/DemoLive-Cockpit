namespace MyCockpitView.WebApi.Models;
public class EmailAccount
{
    public EmailAccount(string emailAddress, string displayName = null)
    {
        DisplayName = displayName;
        Address = emailAddress;
    }
    public string? DisplayName { get; set; }

    public string? Address { get; set; }
}
public class MailDefinition
{
    public MailDefinition()
    {
        ToAddresses = new HashSet<EmailAccount>();
        CCAddresses = new HashSet<EmailAccount>();
        BCCAddresses = new HashSet<EmailAccount>();
    }

    public ICollection<EmailAccount> ToAddresses { get; set; }
    public ICollection<EmailAccount> CCAddresses { get; set; }
    public ICollection<EmailAccount> BCCAddresses { get; set; }
    public EmailAccount SenderAddress { get; set; }

    public string? Subject { get; set; }
    public string? MailBody { get; set; }

    public string? SmtpServer { get; set; }
    public int SmtpPort { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }

    public int SecureSocketOptions { get; set; } = 3;

}
