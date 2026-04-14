using MyCockpitView.WebApi.GmailModule.Dtos;  
namespace MyCockpitView.WebApi.GmailModule.Dtos
{
    public class GmailPagedResult
    {
        public List<GmailEmailDto> Emails { get; set; } = new();
        public string? NextPageToken { get; set; }
    }
}