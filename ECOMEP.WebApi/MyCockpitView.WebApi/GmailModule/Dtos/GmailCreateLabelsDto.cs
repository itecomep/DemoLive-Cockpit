namespace MyCockpitView.WebApi.GmailModule.Dtos
{
    public class GmailCreateLabelsDto
    {
        public string UserId { get; set; } = string.Empty;
        public List<GmailProjectLabelDto> Labels { get; set; } = new();
    }
}
