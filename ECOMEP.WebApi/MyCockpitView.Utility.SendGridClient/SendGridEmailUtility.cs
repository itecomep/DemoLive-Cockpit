using System.Text.RegularExpressions;
using SendGrid;
using SendGrid.Helpers.Mail;



namespace MyCockpitView.Utility.SendGrid;
public class SendGridEmailUtility
{
    private readonly string accountKey;

    public SendGridEmailUtility(string accountKey)
    {
        this.accountKey = accountKey;
    }

    public async Task SendEmail(
        string subject,
        string senderName,
        string senderAddress,
        string htmlBody,
    List<(string name, string email)> toAddresses,
    List<(string name, string email)>? ccAddresses = null,
    List<(string name, string email)>? bccAddresses = null,
          string? replyAddress = null, string? replyName = null, 
          List<(string filename, string content)>? attachments = null)
    {
       
            var client = new SendGridClient(accountKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(senderAddress, senderName),
                Subject = subject,
                HtmlContent = htmlBody,
            };

            // In .NET 8, Regex.IsMatch is preferred with the compiled option for performance
            Regex myRegex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.Compiled);

            foreach (var address in toAddresses)
            {
                if (myRegex.IsMatch(address.email))
                    msg.AddTo(new EmailAddress(address.email,address.name));
            }

            if (ccAddresses != null)
            {
                foreach (var address in ccAddresses)
                {
                    if (myRegex.IsMatch(address.email))
                        msg.AddCc(new EmailAddress(address.email, address.name));
                }
            }

            if (bccAddresses != null)
            {
                foreach (var address in bccAddresses)
                {
                    if (myRegex.IsMatch(address.email))
                        msg.AddBcc(new EmailAddress(address.email, address.name));
                }
            }

            if (replyAddress != null && myRegex.IsMatch(replyAddress))
                msg.ReplyTo = new EmailAddress(replyAddress);

           
        if (attachments != null)
        {
            var size = 0.0;
            foreach (var obj in attachments)
            {
                if (size < 25)
                {
                    // Decode to byte array
                    byte[] fileBytes = Convert.FromBase64String(obj.content);

                    // Get size in bytes
                    long fileSizeInBytes = fileBytes.Length;

                    double fileSizeInMB = fileBytes.Length / (1024.0 * 1024.0);

                    size += fileSizeInMB;

                    msg.AddAttachment(obj.filename, obj.content);
                }
            }
        }

        // Uncomment tracking settings if needed
        // msg.SetClickTracking(false, false);
        // msg.SetOpenTracking(false);
        // msg.SetGoogleAnalytics(false);
        // msg.SetSubscriptionTracking(false);

        var response = await client.SendEmailAsync(msg);
            if (!response.IsSuccessStatusCode)
                throw new Exception($"Email was not sent!. \n {response.StatusCode}");
       
    }
}


// Assuming McvConstant exists in your project
public static class McvConstant
{
    public const string EMAIL_REGEX = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
}