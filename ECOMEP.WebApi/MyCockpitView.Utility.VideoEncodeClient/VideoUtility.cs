using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Net.Http.Formatting;
namespace MyCockpitView.Utility.VideoEncodeClient;

public class VideoUtility
{
    public static async Task<VideoEncodeResponse> EncodeVideo(string apiUrl, string connectionString, string sourceUrl, string thumbUrl, string? destUrl = null)
    {
        if (destUrl == null) destUrl = sourceUrl;
        if (string.IsNullOrEmpty(apiUrl))
        {
            throw new Exception("Video Encode Api url is not set in app settings");
        }

        using (var client = new HttpClient())
        {
            client.Timeout = TimeSpan.FromMinutes(60);

            UriBuilder builder = new UriBuilder(apiUrl);

            var formatter = new JsonMediaTypeFormatter();
            formatter.SerializerSettings = new JsonSerializerSettings
            {
                Formatting = Newtonsoft.Json.Formatting.Indented,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            var response = await client.PostAsync(builder.Uri, new
            {
                connectionString = connectionString,
                sourceUrl = sourceUrl,
                thumbUrl = thumbUrl,
                destUrl = destUrl
            }, formatter);
            if (response.IsSuccessStatusCode)
            {
                string returnValue = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<VideoEncodeResponse>(returnValue, formatter.SerializerSettings);
                return result ?? new VideoEncodeResponse();
            }
            else
            {
                string returnValue = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to POST data: ({response.StatusCode}): {returnValue}");
            }


        }

    }

}

public class VideoEncodeResponse
{
    public string? VideoUrl { get; set; }
    public string? ThumbUrl { get; set; }
    public string? Error {  get; set; }
    public bool IsSuccess {  get; set; }
}
