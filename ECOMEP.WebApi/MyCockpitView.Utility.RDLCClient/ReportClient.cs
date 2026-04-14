using Newtonsoft.Json;
using System.Text;

namespace MyCockpitView.Utility.RDLCClient;

public static class ReportClient
{
    public static async Task<ReportDefinition> GenerateReport(ReportDefinition ReportDefinition, string reportServiceApi)
    {

        using (var client = new HttpClient())
        {
            client.Timeout = TimeSpan.FromMinutes(60);

            UriBuilder builder = new UriBuilder(reportServiceApi);

            string jsonReportDefinition = JsonConvert.SerializeObject(ReportDefinition,
    Newtonsoft.Json.Formatting.Indented,
    new JsonSerializerSettings
    {
        ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
        // Additional settings if needed
    });

            byte[] byteArray = Encoding.UTF8.GetBytes(jsonReportDefinition);
            ByteArrayContent content = new ByteArrayContent(byteArray);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(builder.Uri, content);



            if (response.IsSuccessStatusCode)
            {

                ReportDefinition.FileContent = await response.Content.ReadAsByteArrayAsync();
            }
            else
            {
                throw new Exception("Report Not generated!\n " + response.StatusCode + await response.Content.ReadAsStringAsync());
            }
            return ReportDefinition;
        }

    }
}