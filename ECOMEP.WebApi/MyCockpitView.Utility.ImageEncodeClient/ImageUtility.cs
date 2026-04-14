namespace MyCockpitView.Utility.ImageEncodeClient;

public class ImageUtility
{
    public static string ImageResize(string apiUrl, string url, int width = 600, int height = 600)
    {
        // Create an HttpClient instance
        using (var httpClient = new HttpClient())
        {
            // Set the base URL of the Azure Function endpoint

            httpClient.BaseAddress = new Uri(apiUrl);

            // Prepare the request content with the required query parameters
            var content = new MultipartFormDataContent
                {
                    { new StringContent(url), "url" },
                    { new StringContent(width.ToString()), "width" },
                    { new StringContent(height.ToString()), "height" }
                };

            // Send the HTTP POST request to the Azure Function endpoint
            var response = httpClient.PostAsync("", content).Result;

            // Check if the response is successful
            if (response.IsSuccessStatusCode)
            {
                // Read the response body
                var responseBody = response.Content.ReadAsStringAsync().Result;

                // Display the resized image URL from the response
                Console.WriteLine($"Resized Image URL: {responseBody}");

                return responseBody;
            }

            // Display an error message if the request fails
            throw new Exception($"HTTP POST request failed with status code {response.StatusCode}");

        }

    }
}