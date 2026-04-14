using Microsoft.AspNetCore.Mvc;
using MyCockpitView.WebApi;
using MyCockpitView.WebApi.TodoModule.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.AppSettingMasterModule;

namespace MyCockpitView.WebApi.TodoModule.Dtos;

[Route("api/[controller]")]
[ApiController]
public class TodoStageController : ControllerBase
{
    private readonly EntitiesContext _db;
    private readonly IAzureBlobService _blobService;
    private readonly IAppSettingMasterService _appSetting;

    public TodoStageController(
        EntitiesContext db,
        IAzureBlobService blobService,
        IAppSettingMasterService appSetting)
    {
        _db = db;
        _blobService = blobService;
        _appSetting = appSetting;
    }

    // ================= GET STAGES =================
    [HttpGet("stages")]
    public async Task<IActionResult> GetStages()
    {
        var stages = await _db.TodoStages
            .Where(x => !x.IsDeleted)
            .Select(x => new { id = x.ID, title = x.Title })
            .ToListAsync();

        return Ok(stages);
    }

    // ================= GET CATEGORIES =================
    [HttpGet("categories/{stageId}")]
    public async Task<IActionResult> GetCategories(int stageId)
    {
        var categories = await _db.TodoStageCategories
            .Where(x => x.StageID == stageId && !x.IsDeleted)
            .Select(x => new { id = x.ID, title = x.Title })
            .ToListAsync();

        return Ok(categories);
    }

    // ================= SAVE =================
    [HttpPost("save")]
    public async Task<IActionResult> Save([FromForm] string data)
    {
        try
        {
            var dto = JsonSerializer.Deserialize<ChecklistSaveDto>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (dto == null)
                return BadRequest("Invalid data");

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest("No checklist items");

            var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

            int stageId;

            if (dto.StageId.HasValue && dto.StageId.Value > 0)
            {
                stageId = dto.StageId.Value;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(dto.NewStage))
                    return BadRequest("Stage is required");

                var stage = new TodoStage { Title = dto.NewStage };
                _db.TodoStages.Add(stage);
                await _db.SaveChangesAsync();
                stageId = stage.ID;
            }

            int categoryId;

            if (dto.CategoryId.HasValue && dto.CategoryId.Value > 0)
            {
                categoryId = dto.CategoryId.Value;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(dto.NewCategory))
                    return BadRequest("Category is required");

                var category = new TodoStageCategory
                {
                    Title = dto.NewCategory,
                    StageID = stageId
                };

                _db.TodoStageCategories.Add(category);
                await _db.SaveChangesAsync();
                categoryId = category.ID;
            }

            foreach (var item in dto.Items)
            {
                if (string.IsNullOrWhiteSpace(item.Title))
                    return BadRequest("Checklist title required");

                var uploadedFileNames = new List<string>();

                var relatedFiles = Request.Form.Files
                    .Where(f => f.Name == item.FileKey)
                    .ToList();

                foreach (var file in relatedFiles)
                {
                    var originalFileName = Path.GetFileName(file.FileName);
                    var uniqueFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{originalFileName}";
                    var blobPath = $"todo/{categoryId}/{uniqueFileName}";

                    await using var stream = file.OpenReadStream();

                    await _blobService.UploadAsync(
                        azureKey,
                        "checklist",
                        blobPath,
                        stream
                    );

                    uploadedFileNames.Add(uniqueFileName);
                }

                _db.TodoStageChecklists.Add(new TodoStageChecklist
                {
                    Title = item.Title,
                    Description = item.Description,
                    CategoryID = categoryId,
                    AttachmentUrl = string.Join(",", uploadedFileNames),
                    Created = DateTime.UtcNow.AddHours(5).AddMinutes(30)
                });
            }

            await _db.SaveChangesAsync();

            return Ok("Saved Successfully ✅");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
        }
    }

    // ================= UPDATE =================
    [HttpPut("checklist/{id}")]
    public async Task<IActionResult> UpdateChecklist(
        int id,
        [FromForm] string title,
        [FromForm] string? description)
    {
        var item = await _db.TodoStageChecklists.FindAsync(id);
        if (item == null) return NotFound();

        item.Title = title;
        item.Description = description ?? item.Description;
        item.Modified = DateTime.UtcNow.AddHours(5).AddMinutes(30);

        var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

        var existingFiles = string.IsNullOrEmpty(item.AttachmentUrl)
            ? new List<string>()
            : item.AttachmentUrl.Split(',').ToList();

        foreach (var file in Request.Form.Files)
        {
            var originalFileName = Path.GetFileName(file.FileName);
            var uniqueFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{originalFileName}";
            var blobPath = $"todo/{item.CategoryID}/{uniqueFileName}";

            await using var stream = file.OpenReadStream();

            await _blobService.UploadAsync(
                azureKey,
                "checklist", 
                blobPath,
                stream
            );

            existingFiles.Add(uniqueFileName);
        }

        item.AttachmentUrl = string.Join(",", existingFiles);

        await _db.SaveChangesAsync();

        return Ok();
    }

    // ================= DELETE =================
    [HttpDelete("stage/{id}")]
    public async Task<IActionResult> DeleteStage(int id)
    {
        var stage = await _db.TodoStages.FindAsync(id);
        if (stage == null) return NotFound();

        stage.IsDeleted = true;
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("category/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var cat = await _db.TodoStageCategories.FindAsync(id);
        if (cat == null) return NotFound();

        cat.IsDeleted = true;
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("checklist/{id}")]
    public async Task<IActionResult> DeleteChecklist(int id)
    {
        var item = await _db.TodoStageChecklists.FindAsync(id);
        if (item == null) return NotFound();

        item.IsDeleted = true;
        await _db.SaveChangesAsync();

        return Ok();
    }

    // ================= TREE UI =================
    [HttpGet("tree-ui")]
    public async Task<IActionResult> GetTreeForUI()
    {
        var data = await _db.TodoStages
            .Where(s => !s.IsDeleted)
            .Select(stage => new
            {
                stageId = stage.ID,
                stageName = stage.Title,

                categories = _db.TodoStageCategories
                    .Where(c => c.StageID == stage.ID && !c.IsDeleted)
                    .Select(category => new
                    {
                        categoryId = category.ID,
                        categoryName = category.Title,

                        checklists = _db.TodoStageChecklists
                            .Where(ch => ch.CategoryID == category.ID && !ch.IsDeleted)
                            .Select(ch => new
                            {
                                id = ch.ID,
                                title = ch.Title,
                                description = ch.Description,
                                created = ch.Created,
                                modified = ch.Modified,
                                attachmentUrl = ch.AttachmentUrl
                            }).ToList()
                    }).ToList()
            }).ToListAsync();

        var storageAccount = await _appSetting.GetPresetValue("AZURE_STORAGE_ACCOUNT");

        var result = data.Select(stage => new
        {
            stage.stageId,
            stage.stageName,

            categories = stage.categories.Select(category => new
            {
                category.categoryId,
                category.categoryName,

                checklists = category.checklists.Select(ch => new
                {
                    ch.id,
                    ch.title,
                    ch.description,
                    ch.created,
                    ch.modified,

                    files = string.IsNullOrEmpty(ch.attachmentUrl)
                        ? new List<object>()
                        : ch.attachmentUrl.Split(',')
                            .Select(file => (object)new
                            {
                                name = file,
                                url = $"https://{storageAccount}.blob.core.windows.net/checklist/todo/{category.categoryId}/{file}"
                            }).ToList()
                }).ToList()
            }).ToList()
        });

        return Ok(result);
    }


    //// delete azure attachments ////


    [HttpDelete("checklist/{id}/file")]
    public async Task<IActionResult> DeleteFile(int id, [FromQuery] string fileName)
    {
        var item = await _db.TodoStageChecklists.FindAsync(id);
        if (item == null) return NotFound();

        if (string.IsNullOrEmpty(item.AttachmentUrl))
            return BadRequest("No files found");

        var files = item.AttachmentUrl.Split(',').ToList();

        if (!files.Contains(fileName))
            return BadRequest("File not found");

        var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

        // DELETE FROM AZURE
        var blobPath = $"todo/{item.CategoryID}/{fileName}";

        await _blobService.DeleteBlobAsync(
            azureKey,
            "checklist",   // your container
            blobPath
        );

        // REMOVE FROM DB
        files.Remove(fileName);
        item.AttachmentUrl = string.Join(",", files);

        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("stage/{id}")]
    public async Task<IActionResult> UpdateStage(int id, [FromBody] string title)
    {
        var stage = await _db.TodoStages.FindAsync(id);
        if (stage == null) return NotFound();

        stage.Title = title;
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("category/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] string title)
    {
        var category = await _db.TodoStageCategories.FindAsync(id);
        if (category == null) return NotFound();

        category.Title = title;
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("checklist/{id}/files")]
    public async Task<IActionResult> DeleteMultipleFiles(int id, [FromBody] List<string> fileNames)
    {
        var item = await _db.TodoStageChecklists.FindAsync(id);
        if (item == null) return NotFound();

        if (string.IsNullOrEmpty(item.AttachmentUrl))
            return BadRequest("No files found");

        var files = item.AttachmentUrl.Split(',').ToList();

        var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

        foreach (var fileName in fileNames)
        {
            if (!files.Contains(fileName)) continue;

            var blobPath = $"todo/{item.CategoryID}/{fileName}";

            // delete from blob
            await _blobService.DeleteBlobAsync(azureKey, "checklist", blobPath);

            // remove from list
            files.Remove(fileName);
        }

        // ✅ update DB ONCE
        item.AttachmentUrl = string.Join(",", files);

        await _db.SaveChangesAsync();

        return Ok();
    }

}