using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.StaticFiles;

namespace MyCockpitView.WebApi.AzureBlobsModule;

public interface IAzureBlobService
{
    Task<string> GetSAS(string key, string container);
    Task CleanContainerAsync(string connectionString, string containerName, int oldByDays = 0);
    Task DeleteBlobAsync(string connectionString, string containerName, string blobName);
    Task DeleteBlobByUrlAsync(string connectionString, string containerName, string blobUrl);
    Task DownloadByUrlAsync(string url,Stream stream);
    Task<bool> ExistAsync(string key, string container, string filename);
    Task<string> GetUrlAsync(string key, string container, string filename);
    Task<string> UploadAsync(string key, string container, string filename, Stream stream);
    string GetBlobName(string url);
}

public class AzureBlobService : IAzureBlobService
{

    //     private readonly BlobServiceClient _blobServiceClient;
    //     private readonly ILogger<AzureBlobService> _logger;
    //     private readonly IConfiguration _configuration;
    //     public AzureBlobService(
    //   BlobServiceClient blobServiceClient,
    //   ILogger<AzureBlobService> logger,
    //   IConfiguration configuration)
    //     {
    //         _blobServiceClient = blobServiceClient;
    //         _logger = logger;
    //         _configuration = configuration;
    //     }

    public async Task<string> GetSAS(string key, string container)
    {
        
            BlobServiceClient blobServiceClient = new BlobServiceClient(key);

            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(container);

            if (!await containerClient.ExistsAsync()) throw new Exception("container not found!");

            //var policy = new BlobSignedIdentifier
            //{
            //    Id = "policy-1",
            //    AccessPolicy = new BlobAccessPolicy
            //    {
            //        StartsOn = DateTime.UtcNow.AddMinutes(-1),
            //        ExpiresOn = DateTime.UtcNow.AddMinutes(60),
            //        Permissions = "wac" // Write, Add, Create permissions
            //    }
            //};

            //This line block public access 
            //await containerClient.SetAccessPolicyAsync(PublicAccessType.None, new BlobSignedIdentifier[] { policy });

            BlobSasBuilder sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = containerClient.Name,
                StartsOn = DateTime.UtcNow.AddMinutes(-1),
                ExpiresOn = DateTime.UtcNow.AddMinutes(60),
            };

            sasBuilder.SetPermissions(BlobContainerSasPermissions.Read |
                BlobContainerSasPermissions.Add |
                BlobContainerSasPermissions.Create |
                BlobContainerSasPermissions.Write);

            Uri sasUri = containerClient.GenerateSasUri(sasBuilder);

            string sasToken = sasUri.Query;

            return sasToken;

    }

    public async Task<string> UploadAsync(
        string key,
        string container,
        string filename,
        Stream stream)
    {
        
            BlobServiceClient blobServiceClient = new BlobServiceClient(key);

            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(container);

            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            BlobClient blobClient = containerClient.GetBlobClient(filename);

            var contentTypeProvider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!contentTypeProvider.TryGetContentType(filename, out contentType))
            {
                contentType = "application/octet-stream";
            }

            //blobClient.SetHttpHeaders(new BlobHttpHeaders
            //{
            //    ContentType = contentType
            //});

            BlobUploadOptions options = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = contentType // Set the desired content type here
                }
            };
            // Reset the position of the stream to the beginning before uploading
            stream.Seek(0, SeekOrigin.Begin);
            await blobClient.UploadAsync(stream,options);

            if (!await blobClient.ExistsAsync()) return null;

            return blobClient.Uri.AbsoluteUri;
        
    }


    public async Task<bool> ExistAsync(
        string key,
        string container,
        string filename)
    {
       
            //create a BlobContainerClient 
            BlobContainerClient blobContainer = new BlobContainerClient(key, container);
            // Create the container if it doesn't already exist.
            blobContainer.CreateIfNotExists();
            blobContainer.SetAccessPolicy(PublicAccessType.Blob);

            // Get a reference to a blob
            BlobClient blobClient = blobContainer.GetBlobClient(filename);

            return await blobClient.ExistsAsync();
       
    }

    public async Task<string> GetUrlAsync(
        string key,
        string container,
        string filename)
    {
       
            //create a BlobContainerClient 
            BlobContainerClient blobContainer = new BlobContainerClient(key, container);
            // Create the container if it doesn't already exist.
            blobContainer.CreateIfNotExists();
            blobContainer.SetAccessPolicy(PublicAccessType.Blob);

            // Get a reference to a blob
            BlobClient blobClient = blobContainer.GetBlobClient(filename);

            if (!await blobClient.ExistsAsync())
                throw new Exception($"{filename} does not exist!");

            return blobClient.Uri.AbsoluteUri;
       
    }

    //usage : 
    // using (var memoryStream = new MemoryStream())
    // {
    //     await DownloadBlobToStream(connectionString, containerName, blobName, memoryStream);
    //     // Do something with the memoryStream
    // }
    public async Task DownloadByUrlAsync(string url,Stream stream)
    {

        var blobClient = new BlobClient(new Uri(url));
        // Ensure that the blob exists.
        if (!await blobClient.ExistsAsync())
            throw new Exception($"Blob does not exist at '{url}'.");

            await blobClient.DownloadToAsync(stream);

    }

    public async Task DeleteBlobAsync(string connectionString, string containerName, string blobName)
    {
        try
        {
            // Create a BlobServiceClient object
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Get a reference to the container
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Get a reference to the blob
            BlobClient blobClient = containerClient.GetBlobClient(blobName);

            // Check if the blob exists before deleting
            if (await blobClient.ExistsAsync())
            {
                await blobClient.DeleteAsync();
            }
            else
            {
                throw new ArgumentException($"Blob '{blobName}' does not exist in container '{containerName}'.");
            }
        }
        catch (RequestFailedException ex)
        {
            Console.WriteLine($"Error deleting blob: {ex.Message}");
            throw;
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unknown error: {ex.Message}");
            throw;
        }
    }

    public async Task DeleteBlobByUrlAsync(string connectionString, string containerName, string blobUrl)
    {
        try
        {
            try
            {
                if (connectionString == null || containerName == null || blobUrl == null) return;

                BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

                // Retrieve a reference to a container.
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

                // Ensure that the container exists.
                if (!await containerClient.ExistsAsync())
                    return;

                BlobUriBuilder blobUriBuilder = new BlobUriBuilder(new Uri(blobUrl));

                // Retrieve a reference to the blob.
                BlobClient blobClient = containerClient.GetBlobClient(blobUriBuilder.BlobName);

                if (!await blobClient.ExistsAsync())
                    return;

                // Delete the blob.
                await blobClient.DeleteAsync(DeleteSnapshotsOption.IncludeSnapshots);
            }
            catch (RequestFailedException e)
            {
                throw new Exception($"DeleteBlob failed: {e.Message}", e);
            }
        }
        catch (RequestFailedException ex)
        {
            Console.WriteLine($"Error deleting blob: {ex.Message}");
            throw;
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unknown error: {ex.Message}");
            throw;
        }
    }

    public async Task CleanContainerAsync(
        string connectionString,
        string containerName,
        int oldByDays = 0)
    {
        try
        {
            // Create a BlobContainerClient object
            BlobContainerClient containerClient = new BlobContainerClient(connectionString, containerName);

            // Ensure that the container exists
            if (!await containerClient.ExistsAsync())
            {
                Console.WriteLine($"Container '{containerName}' does not exist");
                return;
            }

            // Set access policy
            containerClient.SetAccessPolicy(PublicAccessType.Blob);

            // Calculate the cutoff date for deleting blobs
            var cutoffDate = DateTime.UtcNow.Date.AddDays(0 - oldByDays);

            // Use Parallel.ForEach to iterate over blobs and delete the old ones in parallel
            Parallel.ForEach(containerClient.GetBlobs(), blob =>
            {
                BlobClient blobClient = containerClient.GetBlobClient(blob.Name);

                // Get the blob's properties and check if it's older than the cutoff date
                BlobProperties properties = blobClient.GetProperties();
                if (properties.CreatedOn < cutoffDate)
                {
                    blobClient.DeleteIfExists();
                }
            });
        }
        catch (RequestFailedException ex)
        {
            Console.WriteLine($"Error deleting blobs: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unknown error: {ex.Message}");
            throw;
        }
    }

    public string? GetBlobName(string url)
    {
        try
        {
            BlobUriBuilder blobUriBuilder = new BlobUriBuilder(new Uri(url));

            BlobClient blobClient = new BlobClient(blobUriBuilder.ToUri());

            return blobUriBuilder.BlobName;
        }
        catch (RequestFailedException e)
        {
            throw new Exception($"_azureBlobService.GetBlobName failed: {e.Message}", e);
        }
    }

}
