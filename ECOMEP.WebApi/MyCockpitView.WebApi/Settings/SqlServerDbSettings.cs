namespace MyCockpitView.WebApi.Settings;

public class SqlServerDbSettings
{
    public string? Server { get; init; }
    public string? Username { get; init; }
    public string? Password { get; init; }
    public string? Database { get; init; }
    public string? TrustServerCertificate { get; set; }
    public string? Encrypt { get; set; }
}
