namespace MyCockpitView.WebApi.Settings
{
    public class ssoSettings
    {
        public string TASK_SSO_SECRET { get; set; } = string.Empty;
        //  public string TaskSsoIssuer { get; set; } = "cockpit.com";
        // public string TaskSsoAudience { get; set; } = "task.pointcloudengg.com";
        public string TaskSsoIssuer { get; set; } = string.Empty;
        public string TaskSsoAudience { get; set; } = string.Empty;
    }
}
