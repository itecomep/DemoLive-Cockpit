using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace MyCockpitView.Utility.PDFCombineClient
{
    public static class PDFCombineClient
    {
        /// <summary>
        ///  var api = await GetPresetValue(McvConstant.PDF_COMBINE_API);
        /// </summary>
        /// <param name="apiUrl"></param>
        /// <param name="pdfFiles"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public static async Task<byte[]> CombinePDFs(string apiUrl, IEnumerable<byte[]> pdfFiles)
        {
            // Create an HttpClient instance
            using (var httpClient = new HttpClient())
            {
                // Set the base URL of the Azure Function endpoint

                httpClient.BaseAddress = new Uri(apiUrl);

                // Prepare the request content with the required query parameters
                var content = new MultipartFormDataContent();
                //content.Add(new StringContent(url), "url");
                //content.Add(new StringContent(width.ToString()), "width");
                //content.Add(new StringContent(height.ToString()), "height");

                var i = 0;
                foreach (var pdfFile in pdfFiles)
                {
                    var fileContent = new ByteArrayContent(pdfFile);
                    fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
                    content.Add(fileContent, $"pdfFile({i})", $"file({i}).pdf");
                    i++;
                }

                // Send the HTTP POST request to the Azure Function endpoint
                var response = await httpClient.PostAsync("", content);

                // Check if the response is successful
                if (response.IsSuccessStatusCode)
                {
                    // Read the response body
                    var responseBody = await response.Content.ReadAsByteArrayAsync();

                    return responseBody;
                }

                // Display an error message if the request fails
                throw new Exception($"HTTP POST request failed with status code {response.StatusCode}");

            }

        }

        /// <summary>
        ///     var api = await GetPresetValue(McvConstant.PDF_COMBINE_BLOB_API);
        /// </summary>
        /// <param name="apiUrl"></param>
        /// <param name="containerName"></param>
        /// <param name="destinationName"></param>
        /// <param name="urls"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public static async Task<string> CombinePDFBlobs(string apiUrl, string containerName, string destinationName, IEnumerable<string> urls)
        {

            // Create an HttpClient instance
            using (var httpClient = new HttpClient())
            {
                // Set the base URL of the Azure Function endpoint

                httpClient.BaseAddress = new Uri(apiUrl);
                httpClient.Timeout= TimeSpan.FromMinutes(20);

                // Convert notification payload to JSON
                var requestPayload = new
                {
                    ContainerName = containerName,
                    BlobName = destinationName,
                    Urls = urls.Where(x => !string.IsNullOrEmpty(x) && x.EndsWith(".pdf"))
                };
                string jsonPayload = JsonConvert.SerializeObject(requestPayload);

                // Convert JSON string to HttpContent
                HttpContent content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // Send the HTTP POST request to the Azure Function endpoint
                var response = await httpClient.PostAsync("", content);

                // Check if the response is successful
                if (response.IsSuccessStatusCode)
                {
                    // Read the response body
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jObject = JObject.Parse(jsonResponse);
                    var responseUrl = jObject["url"]?.ToString();

                    return responseUrl ?? string.Empty;
                }

                // Display an error message if the request fails
                throw new Exception($"HTTP POST request failed with status code {response.StatusCode}");

            }
        }
    }
}
