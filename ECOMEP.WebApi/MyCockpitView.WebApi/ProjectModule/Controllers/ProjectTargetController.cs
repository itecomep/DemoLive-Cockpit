using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.AppSettingMasterModule;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ProjectModule.Dtos;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.Text.RegularExpressions;
using System.Linq;

namespace MyCockpitView.WebApi.ProjectModule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTargetController : ControllerBase
    {
        private readonly EntitiesContext _db;
        private readonly IAzureBlobService _blobService;
        private readonly IAppSettingMasterService _appSetting;

        public ProjectTargetController(
            EntitiesContext db,
            IAzureBlobService blobService,
            IAppSettingMasterService appSetting
        )
        {
            _db = db;
            _blobService = blobService;
            _appSetting = appSetting;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProjectTargetDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var project = await _db.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                return BadRequest("Project not found");

            var existing = await _db.ProjectTargets
                .Where(x => x.ProjectId == dto.ProjectId && !x.IsDeleted)
                .OrderBy(x => x.CreatedDate)
                .FirstOrDefaultAsync();

            if (existing == null && dto.TargetDate == null)
            {
                dto.TargetDate = DateTime.Now;
            }

            var entity = new ProjectTarget
            {
                ProjectId = dto.ProjectId,
                Stage = dto.Stage,

                TargetDate = dto.TargetDate.HasValue
                    ? DateTime.Parse(dto.TargetDate.Value.ToString("yyyy-MM-dd"))
                    : null,

                StageStatus = dto.StageStatus,
                Feedback = dto.Feedback,
                CreatedDate = DateTime.Now,
                IsDeleted = false
            };

            var alreadyCompleted = await _db.ProjectTargets
                .AnyAsync(x =>
                    x.ProjectId == dto.ProjectId &&
                    x.Stage == dto.Stage &&
                    x.StageStatus == "Complete & Generate Invoice" &&
                    !x.IsDeleted
                );

            if (alreadyCompleted)
            {
                return BadRequest("This stage is already completed for this project.");
            }

            // AZURE BLOB ATTACHMENT UPLOAD
            if (dto.Attachments != null && dto.Attachments.Any())
            {
                var azureKey = await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

                List<string> uploadedFiles = new();

                foreach (var file in dto.Attachments)
                {
                    if (file == null || file.Length == 0)
                        continue;

                    var originalFileName = Path.GetFileName(file.FileName);

                    var safeFileName = Regex.Replace(
                        originalFileName,
                        @"[^a-zA-Z0-9\._-]",
                        "_"
                    );

                    if (string.IsNullOrWhiteSpace(safeFileName))
                    {
                        safeFileName = "file";
                    }

                    var uniqueFileName =
                        $"{DateTime.Now:yyyyMMddHHmmssfff}_{safeFileName}";

                    var blobPath =
                        $"project-target/{dto.ProjectId}/{uniqueFileName}";

                    await using var stream = file.OpenReadStream();

                    await _blobService.UploadAsync(
                        azureKey,
                        "projecttargets",
                        blobPath,
                        stream
                    );

                    uploadedFiles.Add(uniqueFileName);
                }

                entity.Attachment = string.Join(",", uploadedFiles);
            }
            _db.ProjectTargets.Add(entity);

            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProjectTargetDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = await _db.ProjectTargets.FindAsync(id);
            if (entity == null) return NotFound();

            var histories = new List<ProjectTargetHistory>();

            if (dto.TargetDate.HasValue &&
                entity.TargetDate?.Date != dto.TargetDate.Value.Date)
            {
                histories.Add(new ProjectTargetHistory
                {
                    ProjectTargetId = entity.Id,
                    FieldName = "TargetDate",
                    OldValue = entity.TargetDate?.ToString("yyyy-MM-dd"),
                    NewValue = dto.TargetDate.Value.ToString("yyyy-MM-dd")
                });

                entity.TargetDate = DateTime.SpecifyKind(
                    dto.TargetDate.Value.Date,
                    DateTimeKind.Unspecified
                );
            }

            if (dto.StageStatus != entity.StageStatus)
            {
                histories.Add(new ProjectTargetHistory
                {
                    ProjectTargetId = entity.Id,
                    FieldName = "StageStatus",
                    OldValue = entity.StageStatus,
                    NewValue = dto.StageStatus
                });

                entity.StageStatus = dto.StageStatus;
            }

            if (dto.Feedback != entity.Feedback)
            {
                histories.Add(new ProjectTargetHistory
                {
                    ProjectTargetId = entity.Id,
                    FieldName = "Feedback",
                    OldValue = entity.Feedback,
                    NewValue = dto.Feedback
                });

                entity.Feedback = dto.Feedback;
            }

            entity.Stage = dto.Stage;
            entity.ProjectId = dto.ProjectId;
            entity.ModifiedDate = DateTime.Now;

            if (histories.Any())
            {
                _db.ProjectTargetHistories.AddRange(histories);
            }

            // AZURE BLOB ATTACHMENT UPDATE
            List<string> existingFiles = new List<string>();

            if (!string.IsNullOrWhiteSpace(entity.Attachment))
            {
                existingFiles = entity.Attachment
                    .Split(",", StringSplitOptions.RemoveEmptyEntries)
                    .ToList();
            }

            if (dto.DeletedAttachments != null && dto.DeletedAttachments.Any())
            {
                existingFiles = existingFiles
                    .Where(x => !dto.DeletedAttachments.Contains(x))
                    .ToList();
            }

            if (dto.Attachments != null && dto.Attachments.Any())
            {
                var azureKey =
                    await _appSetting.GetPresetValue("AZURE_STORAGE_KEY");

                foreach (var file in dto.Attachments)
                {
                    if (file == null || file.Length == 0)
                        continue;

                    var originalFileName =
                        Path.GetFileName(file.FileName);

                    var safeFileName = Regex.Replace(
                        originalFileName,
                        @"[^a-zA-Z0-9\._-]",
                        "_"
                    );

                    if (string.IsNullOrWhiteSpace(safeFileName))
                    {
                        safeFileName = "file";
                    }

                    var uniqueFileName =
                        $"{DateTime.Now:yyyyMMddHHmmssfff}_{safeFileName}";

                    var blobPath =
                        $"project-target/{dto.ProjectId}/{uniqueFileName}";

                    await using var stream = file.OpenReadStream();

                    await _blobService.UploadAsync(
                        azureKey,
                        "projecttargets",
                        blobPath,
                        stream
                    );

                    existingFiles.Add(uniqueFileName);
                }
            }
            entity.Attachment = string.Join(",", existingFiles);

            await _db.SaveChangesAsync();

            return Ok(entity);
        }

        [HttpGet("form-data")]
        public async Task<IActionResult> GetFormData(int? projectId = null)
        {
            var projects = await _db.Projects
                .Select(p => new
                {
                    id = p.ID,
                    title = p.Title,
                    code = p.Code,

                    teamIds = _db.ProjectTeams
                        .Where(pt => pt.ProjectID == p.ID)
                        .Select(pt => pt.ContactTeamID)
                        .ToList()
                })
                .ToListAsync();

            var stages = await _db.ProjectStages
                .Where(x => projectId == null || x.ProjectID == projectId)
                .Select(x => new { x.ID, x.Title })
                .ToListAsync();

            var statuses = new List<string>
            {
                "Yet to Start",
                "In Progress",
                "Awaiting Client Response",
                "On Hold",
                "Complete & Generate Invoice"
            };

            return Ok(new
            {
                projects,
                stages,
                statuses
            });
        }

        [HttpGet("stages/{projectId}")]
        public async Task<IActionResult> GetStagesByProject(int projectId)
        {
            var stages = await _db.ProjectStages
                .Where(x => x.ProjectID == projectId)
                .Select(x => new { x.ID, x.Title })
                .ToListAsync();

            return Ok(stages);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var today = DateTime.Today;

            var data = await _db.ProjectTargets
                .Include(x => x.Project)
                .Where(x => !x.IsDeleted)
                .ToListAsync();

            foreach (var item in data)
            {
                if (item.TargetDate.HasValue &&
                    item.TargetDate.Value.Date < today &&
                    item.StageStatus != "Complete & Generate Invoice")
                {
                    var oldDate = item.TargetDate;
                    var newDate = today.AddDays(15).Date;

                    _db.ProjectTargetHistories.Add(new ProjectTargetHistory
                    {
                        ProjectTargetId = item.Id,
                        FieldName = "TargetDate",
                        OldValue = oldDate?.ToString("yyyy-MM-dd"),
                        NewValue = newDate.ToString("yyyy-MM-dd"),
                        ChangedOn = DateTime.Now
                    });

                    item.TargetDate = DateTime.SpecifyKind(
                        newDate,
                        DateTimeKind.Unspecified
                    );

                    item.ModifiedDate = DateTime.Now;
                }
            }

            await _db.SaveChangesAsync();
            var storageAccount = await _appSetting.GetPresetValue("AZURE_STORAGE_ACCOUNT");

            var result = data
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new
                {
                    x.Id,
                    x.ProjectId,
                    ProjectCode = x.Project.Code,
                    x.Stage,
                    x.TargetDate,
                    x.StageStatus,
                    x.Feedback,

                    attachments = string.IsNullOrEmpty(x.Attachment)
                    ? new List<object>()
                    : x.Attachment.Split(',')
                        .Select(file => (object)new
                        {
                            fileName = file,
                            fileUrl =
                                $"https://{storageAccount}.blob.core.windows.net/projecttargets/project-target/{x.ProjectId}/{file}"
                        }).ToList(),

                    teamIds = _db.ProjectTeams
                        .Where(pt => pt.ProjectID == x.ProjectId)
                        .Select(pt => pt.ContactTeamID)
                        .ToList(),

                    history = _db.ProjectTargetHistories
                        .Where(h => h.ProjectTargetId == x.Id)
                        .OrderByDescending(h => h.ChangedOn)
                        .ToList()
                });
            return Ok(result);
        }
    }
}