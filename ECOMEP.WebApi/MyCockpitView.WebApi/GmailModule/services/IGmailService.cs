using MyCockpitView.WebApi.GmailModule.Dtos;
using System.Text.Json;
namespace MyCockpitView.WebApi.GmailModule.Services;

public interface IGmailService
{
    Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> GetEmailsAsync(string accessToken, string? pageToken = null, int pageSize = 20);
    Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> GetSentEmailsAsync(string accessToken, string? pageToken = null, int pageSize = 20);
    Task <GmailMessageResponse> SendEmailAsync(
        string accessToken,
        string to,
        string subject,
        string body,
        string? threadId = null,
        string? replyMessageId = null,
        string? references = null,
        List<string>? cc = null,
        List<string>? bcc = null,
        List<string>? attachmentsBase64 = null,
        List<string>? attachmentsFileNames = null
    );
    Task<string> GetLoggedInEmailAsync(string accessToken);
    Task<List<GmailEmailDto>> GetThreadMessagesAsync(string accessToken, string threadId, string? originalEmailId = null);
    Task<JsonElement> GetMessageAsync(string accessToken, string messageId);
    Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> SearchEmailsAsync(string accessToken, string query, string? pageToken = null, int pageSize = 20);
    Task<int> GetTotalEmailCount(string accessToken);
    Task<(List<GmailEmailDto> Emails, int Total, string? NextPageToken)> GetDraftEmailsAsync(string accessToken, string? pageToken = null, int pageSize = 20);
    Task<object> CreateDraftAsync(string accessToken, GmailDraftDto dto);
    Task DeleteDraftAsync(string accessToken, string draftId);
}