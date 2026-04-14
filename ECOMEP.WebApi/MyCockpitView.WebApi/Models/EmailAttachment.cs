namespace MyCockpitView.WebApi.Models;

public class EmailAttachment
{
    public EmailAttachment(string filename, byte[] content, string contentType = null)
    {
        Filename = filename;
        Content = Convert.ToBase64String(content);
        ContentType = ContentType;
    }

    public string? Filename { get; set; }
    public string? Content { get; set; }

    public string? ContentType { get; set; }
}
