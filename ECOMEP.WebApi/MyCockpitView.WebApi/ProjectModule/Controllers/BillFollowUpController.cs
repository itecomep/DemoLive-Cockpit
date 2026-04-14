using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using MyCockpitView.WebApi;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.AppSettingMasterModule;

namespace MyCockpitView.WebApi.ProjectModule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillFollowUpController : ControllerBase
    {
        private readonly EntitiesContext _db;
        private readonly IAzureBlobService _blobService;
        private readonly IAppSettingMasterService _appSetting;

        public BillFollowUpController(
            EntitiesContext db,
            IAzureBlobService blobService,
            IAppSettingMasterService appSetting)
        {
            _db = db;
            _blobService = blobService;
            _appSetting = appSetting;
        }

        // ================= SAVE =================
        [HttpPost("save")]
        public async Task<IActionResult> Save([FromForm] string data)
        {
            var dto = JsonSerializer.Deserialize<BillFollowUp>(data,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (dto == null)
                return BadRequest("Invalid data");

            var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

            var uploadedFiles = new List<string>();

            foreach (var file in Request.Form.Files)
            {              
                var originalFileName = Path.GetFileName(file.FileName);
             
                var nameWithoutExt = Path.GetFileNameWithoutExtension(originalFileName);
                var extension = Path.GetExtension(originalFileName);
               
                var cleanName = nameWithoutExt
                    .Replace(" ", "_")
                    .Replace("(", "")
                    .Replace(")", "")
                    .Replace("#", "")
                    .Replace("&", "")
                    .Replace("%", "")
                    .Replace("@", "")
                    .Replace("!", "")
                    .Replace("^", "")
                    .Replace("+", "")
                    .Replace("=", "");
                
                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{cleanName}{extension}";

                var blobPath = $"billfollowup/{dto.BillId}/{fileName}";

                await using var stream = file.OpenReadStream();

                await _blobService.UploadAsync(
                    azureKey,
                    "billinganalysis-followup",
                    blobPath,
                    stream
                );
              
                uploadedFiles.Add(fileName);
            }

            var entity = new BillFollowUp
            {
                BillId = dto.BillId,
                CommunicatedByClient = dto.CommunicatedByClient,
                CommunicationDate = dto.CommunicationDate,
                CommunicatedTo = dto.CommunicatedTo,
                Response = dto.Response,
                NextFollowUpDate = dto.NextFollowUpDate,
                AttachmentUrl = string.Join(",", uploadedFiles),
                Created = DateTime.UtcNow.AddHours(5).AddMinutes(30),
                IsDeleted = false
            };

            _db.BillFollowUps.Add(entity);
            await _db.SaveChangesAsync();

            return Ok();
        }

        // ================= GET =================
        [HttpGet("{billId}")]
        public async Task<IActionResult> Get(int billId)
        {
            var storageAccount = await _appSetting.GetPresetValue("AZURE_STORAGE_ACCOUNT");

            var rawData = await _db.BillFollowUps
                .Where(x => x.BillId == billId && !x.IsDeleted)
                .OrderByDescending(x => x.Created)
                .ToListAsync();

            var result = rawData.Select(x => new
            {
                x.ID,
                x.CommunicatedByClient,
                x.CommunicationDate,
                x.CommunicatedTo,
                x.Response,
                x.NextFollowUpDate,

                files = (x.AttachmentUrl ?? "")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(f =>
                    {
                        var parts = f.Split('|');

                        var stored = parts[0];
                        var original = parts.Length > 1 ? parts[1] : stored;

                        return new
                        {
                            name = original,
                            url = $"https://{storageAccount}.blob.core.windows.net/billinganalysis-followup/billfollowup/{x.BillId}/{stored}"
                        };
                    })
                    .ToList()
            });

            return Ok(result);
        }


        // ================= UPDATE =================
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string data)
        {
            var dto = JsonSerializer.Deserialize<BillFollowUp>(data,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            var entity = await _db.BillFollowUps.FindAsync(id);

            if (entity == null)
                return NotFound();

            var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

            var uploadedFiles = new List<string>();
            
            foreach (var file in Request.Form.Files)
            {
                var originalFileName = Path.GetFileName(file.FileName);
                var nameWithoutExt = Path.GetFileNameWithoutExtension(originalFileName);
                var extension = Path.GetExtension(originalFileName);

                var cleanName = nameWithoutExt
                    .Replace(" ", "_")
                    .Replace("(", "")
                    .Replace(")", "")
                    .Replace("#", "")
                    .Replace("&", "")
                    .Replace("%", "")
                    .Replace("@", "")
                    .Replace("!", "")
                    .Replace("^", "")
                    .Replace("+", "")
                    .Replace("=", "");

                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{cleanName}{extension}";
                var blobPath = $"billfollowup/{dto.BillId}/{fileName}";

                await using var stream = file.OpenReadStream();

                await _blobService.UploadAsync(
                    azureKey,
                    "billinganalysis-followup",
                    blobPath,
                    stream
                );

                uploadedFiles.Add(fileName);
            }

            // UPDATE FIELDS
            entity.CommunicatedByClient = dto.CommunicatedByClient;
            entity.CommunicationDate = dto.CommunicationDate;
            entity.CommunicatedTo = dto.CommunicatedTo;
            entity.Response = dto.Response;
            entity.NextFollowUpDate = dto.NextFollowUpDate;
            entity.Modified = DateTime.UtcNow.AddHours(5).AddMinutes(30);

            // UPDATE ATTACHMENTS (IMPORTANT)
           
            var existingFiles = (entity.AttachmentUrl ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .ToList();
           
            var dtoExistingFiles = dto.AttachmentUrl?
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .ToList() ?? new List<string>();
         
            var finalFiles = dtoExistingFiles
                .Concat(uploadedFiles)
                .ToList();
            
            entity.AttachmentUrl = string.Join(",", finalFiles);

            await _db.SaveChangesAsync();

            return Ok();
        }


        // ================= DELETE =================
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.BillFollowUps.FindAsync(id);

            if (entity == null)
                return NotFound();

            entity.IsDeleted = true;

            await _db.SaveChangesAsync();

            return Ok();
        }


    }
}