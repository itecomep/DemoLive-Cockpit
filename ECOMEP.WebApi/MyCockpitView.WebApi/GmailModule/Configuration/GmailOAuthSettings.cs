namespace MyCockpitView.WebApi.GmailModule.Configuration;

public class GmailOAuthSettings
{
    public string ClientId { get; set; } = "";
    public string ClientSecret { get; set; } = "";
    public string RedirectUri { get; set; } = "";
    public string Scope { get; set; } = "";
}
