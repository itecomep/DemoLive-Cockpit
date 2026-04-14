using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.Services;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;

namespace MyCockpitView.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DmsAttachmentController : ControllerBase
    {
        private readonly IAzureBlobService _blobService;
        private readonly EntitiesContext _db;
        private readonly ICurrentUserService _currentUser;
        private readonly IConfiguration _configuration;

        public DmsAttachmentController(
            IAzureBlobService blobService,
            EntitiesContext db,
            ICurrentUserService currentUser,
            IConfiguration configuration)
        {
            _blobService = blobService;
            _db = db;
            _currentUser = currentUser;
            _configuration = configuration;
        }

        [HttpPost("generate-upload-url")]
        public async Task<IActionResult> GenerateUploadUrl([FromBody] GenerateUploadDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FileName))
                return BadRequest("FileName required");

            var setting = await _db.AppSettingMasters
                .FirstOrDefaultAsync(x => x.PresetKey == "AZURE_STORAGE_KEY");

            if (setting == null || string.IsNullOrWhiteSpace(setting.PresetValue))
                return BadRequest("Azure key missing");

            var blobServiceClient = new BlobServiceClient(setting.PresetValue);
            var containerClient = blobServiceClient.GetBlobContainerClient("dms");

            await containerClient.CreateIfNotExistsAsync();

            var blobClient = containerClient.GetBlobClient(dto.FileName);

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = "dms",
                BlobName = dto.FileName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(2)
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Write | BlobSasPermissions.Create);

            var uri = blobClient.GenerateSasUri(sasBuilder);

            return Ok(new { uploadUrl = uri.ToString() });
        }

        [HttpPost("upload-metadata")]
        public async Task<IActionResult> UploadMetadata([FromBody] ProjectUploadMetadataDto dto)
        {
            if (dto.Files == null || dto.Files.Count == 0)
                return BadRequest("No files");

            if (dto.ProjectId < 0)
                return BadRequest("Invalid project");

            var savedFiles = new List<object>();

            ProjectFolder? folder = null;

            if (dto.FolderId.HasValue)
            {
                folder = await _db.ProjectFolders
                    .FirstOrDefaultAsync(f => f.Id == dto.FolderId && f.ProjectId == dto.ProjectId);

                if (folder == null)
                    return BadRequest("Folder not found");
            }

            string classification = dto.Classification?.Trim() ?? "";

            // 🔥 SAME classification logic
            if (!string.IsNullOrWhiteSpace(classification))
            {
                var exists = await _db.DmsClassificationMasters
                    .AnyAsync(x => x.Name.ToLower() == classification.ToLower());

                if (!exists)
                {
                    _db.DmsClassificationMasters.Add(new DmsClassificationMaster
                    {
                        Name = classification,
                        IsActive = true,
                        SortOrder = 999,
                        Created = DateTime.UtcNow,
                        CreatedBy = dto.CreatedBy ?? "System"
                    });

                    await _db.SaveChangesAsync();
                }
            }

            string finalFolderPath = "";

            if (folder != null)
            {
                var fullFolderPath = await BuildFolderPath(folder);

                if (!string.IsNullOrWhiteSpace(classification))
                {
                    if (fullFolderPath.StartsWith(classification + "/", StringComparison.OrdinalIgnoreCase))
                        fullFolderPath = fullFolderPath.Substring(classification.Length + 1);
                    else if (string.Equals(fullFolderPath, classification, StringComparison.OrdinalIgnoreCase))
                        fullFolderPath = "";
                }

                finalFolderPath = string.IsNullOrWhiteSpace(fullFolderPath)
                    ? classification
                    : $"{classification}/{fullFolderPath}";
            }
            else if (!string.IsNullOrWhiteSpace(classification))
            {
                finalFolderPath = classification;
            }

            foreach (var file in dto.Files)
            {
                var safeFileName = Path.GetFileName(file.FileName);
                var fileNameOnly = Path.GetFileNameWithoutExtension(safeFileName);
                var extension = Path.GetExtension(safeFileName);

                string finalFileName = safeFileName;
                int counter = 1;
                string blobPath;

                while (true)
                {
                    blobPath = string.IsNullOrWhiteSpace(finalFolderPath)
                        ? $"projects/{dto.ProjectId}/{finalFileName}"
                        : $"projects/{dto.ProjectId}/{finalFolderPath}/{finalFileName}";

                    bool exists = await _db.ProjectFiles
                        .AnyAsync(x => x.ProjectID == dto.ProjectId && x.BlobPath == blobPath);

                    if (!exists) break;

                    finalFileName = $"{fileNameOnly} ({counter}){extension}";
                    counter++;
                }

                var attachment = new ProjectFiles
                {
                    ProjectID = dto.ProjectId,
                    FolderId = folder?.Id,
                    FileName = finalFileName,
                    BlobPath = blobPath,
                    BlobUrl = file.BlobUrl, // 🔥 already uploaded
                    Classification = classification,
                    FileSize = file.FileSize,
                    CreatedBy = dto.CreatedBy ?? "",
                    Created = DateTime.UtcNow
                };

                if (dto.Tags != null)
                {
                    attachment.Tags = dto.Tags
                        .Where(t => !string.IsNullOrWhiteSpace(t))
                        .Select(t => new ProjectFileTag
                        {
                            TagName = t.Trim(),
                            ProjectFile = attachment
                        })
                        .ToList();
                }

                _db.ProjectFiles.Add(attachment);
                await _db.SaveChangesAsync();
            
                if (dto.DeniedUsers != null && dto.DeniedUsers.Any())
                {
                    var denyList = dto.DeniedUsers.Select(userId => new ProjectFileDeny
                    {
                        FileId = attachment.ID,
                        UserId = userId
                    }).ToList();

                    _db.ProjectFileDenies.AddRange(denyList);
                    await _db.SaveChangesAsync();
                }

                savedFiles.Add(new
                {
                    Id = attachment.ID,
                    attachment.FileName,
                    attachment.BlobUrl,
                    Folder = folder?.FolderName,
                    attachment.Classification,
                    attachment.FileSize,
                    Tags = attachment.Tags?.Select(t => t.TagName).ToList() ?? new List<string>()
                });
            }

            return Ok(savedFiles);
        }

        public class ProjectUploadMetadataDto
        {
            public int ProjectId { get; set; }
            public int? FolderId { get; set; }
            public string? Classification { get; set; }
            public string? CreatedBy { get; set; }
            public List<string>? Tags { get; set; }
            public List<FileMetaDto> Files { get; set; } = new();
            public string Visibility { get; set; } = "Public";
            public List<string>? DeniedUsers { get; set; }
        }

        public class FileMetaDto
        {
            public string FileName { get; set; } = "";
            public string BlobUrl { get; set; } = "";
            public long FileSize { get; set; }
        }

        public class GenerateUploadDto
        {
            public string FileName { get; set; } = "";
        }


        private async Task<string> BuildFolderPath(ProjectFolder folder)
        {
            var segments = new List<string>();
            var current = folder;

            while (current != null)
            {
                segments.Insert(0, current.FolderName);

                if (current.ParentFolderId == null)
                    break;

                current = await _db.ProjectFolders
                    .FirstOrDefaultAsync(f => f.Id == current.ParentFolderId);
            }

            return string.Join("/", segments);
        }

        // [HttpGet("folderTree/{projectId}")]
        // public async Task<IActionResult> GetFolderTree(int projectId, [FromQuery] string userId, [FromQuery] bool isMaster)
        // {
        //     if (projectId < 0)
        //         return BadRequest("Invalid project ID");

        //     var allFolders = await _db.ProjectFolders
        //     .Where(f => f.ProjectId == projectId)
        //     .ToListAsync();

        //     bool IsFolderVisible(ProjectFolder folder)
        //     {
        //         if (!string.IsNullOrEmpty(folder.Visibility) &&
        //             folder.Visibility == "Private" &&
        //             !isMaster)
        //             return false;

        //         var parentId = folder.ParentFolderId;

        //         while (parentId.HasValue)
        //         {
        //             var parent = allFolders.FirstOrDefault(f => f.Id == parentId.Value);
        //             if (parent == null) break;

        //             if (!string.IsNullOrEmpty(parent.Visibility) &&
        //                 parent.Visibility == "Private" &&
        //                 !isMaster)
        //                 return false;

        //             parentId = parent.ParentFolderId;
        //         }

        //         return true;
        //     }

        //     var projectFolders = allFolders
        //         .Where(f => IsFolderVisible(f))
        //         .ToList();

        //     var projectFiles = await _db.ProjectFiles
        //         .Where(f =>
        //             f.ProjectID == projectId &&
        //             (projectId == 0 ? f.CreatedBy == userId : true) &&
        //             (
        //                 string.IsNullOrEmpty(f.Visibility) ||
        //                 f.Visibility == "Public" ||
        //                 (f.Visibility == "Private" && isMaster)
        //             )
        //         )
        //         .Include(f => f.Tags)
        //         .ToListAsync();

        //     bool IsFileVisible(ProjectFiles file)
        //     {
        //         if (!string.IsNullOrEmpty(file.Visibility) &&
        //             file.Visibility == "Private" &&
        //             !isMaster)
        //             return false;

        //         if (file.FolderId.HasValue)
        //         {
        //             var folder = allFolders.FirstOrDefault(f => f.Id == file.FolderId.Value);

        //             while (folder != null)
        //             {
        //                 if (!string.IsNullOrEmpty(folder.Visibility) &&
        //                     folder.Visibility == "Private" &&
        //                     !isMaster)
        //                     return false;

        //                 folder = folder.ParentFolderId.HasValue
        //                     ? allFolders.FirstOrDefault(f => f.Id == folder.ParentFolderId.Value)
        //                     : null;
        //             }
        //         }

        //         return true;
        //     }

        //     projectFiles = projectFiles
        //         .Where(f => IsFileVisible(f))
        //         .ToList();

        //     var contacts = await _db.Contacts
        //         .ToDictionaryAsync(c => c.ID, c => c.FirstName + " " + c.LastName);

        //     string Normalize(string c) =>
        //         string.IsNullOrWhiteSpace(c)
        //             ? (projectId == 0 ? "Others" : "Unclassified")
        //             : c.Trim();

        //     var rootDict = projectFolders
        //         .Select(f => Normalize(f.Classification))
        //         .Union(projectFiles.Select(f => Normalize(f.Classification)))
        //         .Distinct(StringComparer.OrdinalIgnoreCase)
        //         .ToDictionary(
        //             c => c,
        //             c => new FolderNodeDto
        //             {
        //                 Name = c,
        //                 Children = new List<FolderNodeDto>(),
        //                 Files = new List<FileDto>()
        //             },
        //             StringComparer.OrdinalIgnoreCase
        //         );

        //     foreach (var root in rootDict)
        //     {
        //         var classification = root.Key;

        //         var realRoot = projectFolders.FirstOrDefault(f =>
        //             f.Classification == classification &&
        //             !f.ParentFolderId.HasValue
        //         );

        //         if (realRoot != null)
        //         {
        //             root.Value.Visibility = realRoot.Visibility;
        //             root.Value.Id = realRoot.Id;
        //             root.Value.Name = realRoot.FolderName;
        //         }
        //     }

        //     var folderDict = projectFolders.ToDictionary(
        //         f => f.Id,
        //         f => new FolderNodeDto
        //         {
        //             Id = f.Id,
        //             Name = f.FolderName,
        //             Visibility = f.Visibility,
        //             Children = new List<FolderNodeDto>(),
        //             Files = new List<FileDto>()
        //         });

        //     foreach (var folder in projectFolders)
        //     {
        //         if (folder.ParentFolderId.HasValue &&
        //             folder.ParentFolderId != folder.Id &&
        //             folderDict.ContainsKey(folder.ParentFolderId.Value))
        //         {
        //             var parent = folderDict[folder.ParentFolderId.Value];
        //             var node = folderDict[folder.Id];
        //             if (!parent.Children.Any(c => c.Id == node.Id))
        //             {
        //                 parent.Children.Add(node);
        //             }
        //         }
        //     }

        //     var rootFolders = projectFolders
        //         .Where(f => !f.ParentFolderId.HasValue || !folderDict.ContainsKey(f.ParentFolderId.Value))
        //         .ToList();

        //     foreach (var folder in rootFolders)
        //     {
        //         var classification = Normalize(folder.Classification);
        //         if (!rootDict.ContainsKey(classification))
        //             continue;

        //         var node = folderDict[folder.Id];
        //         if (!rootDict[classification].Children.Any(c => c.Id == node.Id))
        //         {
        //             rootDict[classification].Children.Add(node);
        //         }
        //     }

        //     foreach (var file in projectFiles)
        //     {
        //         var classification = Normalize(file.Classification);
        //         var fileDto = new FileDto
        //         {
        //             Id = file.ID,
        //             FileName = file.FileName,
        //             BlobUrl = file.BlobUrl,
        //             Classification = classification,
        //             Tags = file.Tags.Select(t => t.TagName).ToList(),
        //             Created = file.Created,
        //             CreatedBy = int.TryParse(file.CreatedBy, out int contactId) && contacts.ContainsKey(contactId)
        //                 ? contacts[contactId] : "Unknown",
        //             FileSize = file.FileSize,
        //             Visibility = file.Visibility
        //         };

        //         if (file.FolderId.HasValue && folderDict.ContainsKey(file.FolderId.Value))
        //         {
        //             folderDict[file.FolderId.Value].Files.Add(fileDto);
        //         }
        //         else if (rootDict.ContainsKey(classification))
        //         {
        //             rootDict[classification].Files.Add(fileDto);
        //         }
        //     }

        //     foreach (var root in rootDict.Values)
        //     {
        //         RemoveSameNameNesting(root);
        //     }

        //     return Ok(rootDict.Values.ToList());
        // }

        [HttpGet("folderTree/{projectId}")]
        public async Task<IActionResult> GetFolderTree(int projectId, [FromQuery] string userId, [FromQuery] bool isMaster)
        {
            if (projectId < 0)
                return BadRequest("Invalid project ID");

            var allFolders = await _db.ProjectFolders
            .Where(f => f.ProjectId == projectId)
            .Include(f => f.DeniedUsers)
            .ToListAsync();

            bool IsFolderVisible(ProjectFolder folder)
            {
                if (isMaster)
                    return true;

                if (folder.DeniedUsers != null &&
                    folder.DeniedUsers.Any(d => d.UserId == userId))
                    return false;

                var parentId = folder.ParentFolderId;

                while (parentId.HasValue)
                {
                    var parent = allFolders.FirstOrDefault(f => f.Id == parentId.Value);
                    if (parent == null) break;

                    if (parent.DeniedUsers != null &&
                        parent.DeniedUsers.Any(d => d.UserId == userId))
                        return false;

                    parentId = parent.ParentFolderId;
                }

                return true;
            }

            var projectFolders = allFolders
                .Where(f => IsFolderVisible(f))
                .ToList();

            var projectFiles = await _db.ProjectFiles
            .Where(f =>
                f.ProjectID == projectId &&
                (projectId == 0 ? f.CreatedBy == userId : true)
            )
            .Include(f => f.Tags)
            .Include(f => f.DeniedUsers)
            .ToListAsync();

            bool IsFileVisible(ProjectFiles file)
            {
                if (isMaster)
                    return true;

                if (file.DeniedUsers != null &&
                    file.DeniedUsers.Any(d => d.UserId == userId))
                    return false;

                if (file.FolderId.HasValue)
                {
                    var folder = allFolders.FirstOrDefault(f => f.Id == file.FolderId.Value);

                    while (folder != null)
                    {
                        if (folder.DeniedUsers != null &&
                            folder.DeniedUsers.Any(d => d.UserId == userId))
                            return false;

                        folder = folder.ParentFolderId.HasValue
                            ? allFolders.FirstOrDefault(f => f.Id == folder.ParentFolderId.Value)
                            : null;
                    }
                }

                return true;
            }

            projectFiles = projectFiles
                .Where(f => IsFileVisible(f))
                .ToList();

            var contacts = await _db.Contacts
                .ToDictionaryAsync(c => c.ID, c => c.FirstName + " " + c.LastName);

            string Normalize(string c) =>
                string.IsNullOrWhiteSpace(c)
                    ? (projectId == 0 ? "Others" : "Unclassified")
                    : c.Trim();

            var rootDict = projectFolders
                .Select(f => Normalize(f.Classification))
                .Union(projectFiles.Select(f => Normalize(f.Classification)))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToDictionary(
                    c => c,
                    c => new FolderNodeDto
                    {
                        Name = c,
                        Children = new List<FolderNodeDto>(),
                        Files = new List<FileDto>(),
                        DeniedUsers = new List<string>() 
                    },
                    StringComparer.OrdinalIgnoreCase
                );

            foreach (var root in rootDict)
            {
                var classification = root.Key;

                var realRoot = projectFolders.FirstOrDefault(f =>
                    f.Classification == classification &&
                    !f.ParentFolderId.HasValue
                );

                if (realRoot != null)
                {
                    root.Value.Id = realRoot.Id;
                    root.Value.Name = realRoot.FolderName;
                     root.Value.DeniedUsers = realRoot.DeniedUsers
                    .Select(d => d.UserId)
                    .ToList();
                }
            }

            var folderDict = projectFolders.ToDictionary(
                f => f.Id,
                f => new FolderNodeDto
                {
                    Id = f.Id,
                    Name = f.FolderName,
                    Children = new List<FolderNodeDto>(),
                    Files = new List<FileDto>(),
                    DeniedUsers = f.DeniedUsers
                    .Select(d => d.UserId)
                    .ToList()
                });

            foreach (var folder in projectFolders)
            {
                if (folder.ParentFolderId.HasValue &&
                    folder.ParentFolderId != folder.Id &&
                    folderDict.ContainsKey(folder.ParentFolderId.Value))
                {
                    var parent = folderDict[folder.ParentFolderId.Value];
                    var node = folderDict[folder.Id];
                    if (!parent.Children.Any(c => c.Id == node.Id))
                    {
                        parent.Children.Add(node);
                    }
                }
            }

            var rootFolders = projectFolders
                .Where(f => !f.ParentFolderId.HasValue || !folderDict.ContainsKey(f.ParentFolderId.Value))
                .ToList();

            foreach (var folder in rootFolders)
            {
                var classification = Normalize(folder.Classification);
                if (!rootDict.ContainsKey(classification))
                    continue;

                var node = folderDict[folder.Id];
                if (!rootDict[classification].Children.Any(c => c.Id == node.Id))
                {
                    rootDict[classification].Children.Add(node);
                }
            }

            foreach (var file in projectFiles)
            {
                var classification = Normalize(file.Classification);
                var fileDto = new FileDto
                {
                    Id = file.ID,
                    FileName = file.FileName,
                    BlobUrl = file.BlobUrl,
                    Classification = classification,
                    Tags = file.Tags.Select(t => t.TagName).ToList(),
                    Created = file.Created,
                    CreatedBy = int.TryParse(file.CreatedBy, out int contactId) && contacts.ContainsKey(contactId)
                        ? contacts[contactId] : "Unknown",
                    FileSize = file.FileSize,
                    DeniedUsers = file.DeniedUsers
                    .Select(d => d.UserId)
                    .ToList()
                };

                if (file.FolderId.HasValue && folderDict.ContainsKey(file.FolderId.Value))
                {
                    folderDict[file.FolderId.Value].Files.Add(fileDto);
                }
                else if (rootDict.ContainsKey(classification))
                {
                    rootDict[classification].Files.Add(fileDto);
                }
            }

            foreach (var root in rootDict.Values)
            {
                RemoveSameNameNesting(root);
            }

            return Ok(rootDict.Values.ToList());
        }

        private void RemoveSameNameNesting(FolderNodeDto node)
        {
            if (node.Children == null || !node.Children.Any())
                return;
            var newChildren = new List<FolderNodeDto>();

            foreach (var child in node.Children)
            {
                if (string.Equals(child.Name, node.Name, StringComparison.OrdinalIgnoreCase))
                {
                    if (child.Children != null)
                        newChildren.AddRange(child.Children);
                    if (child.Files != null)
                    {
                        if (node.Files == null)
                            node.Files = new List<FileDto>();
                        node.Files.AddRange(child.Files);
                    }
                }
                else
                {
                    newChildren.Add(child);
                }
                RemoveSameNameNesting(child);
            }
            node.Children = newChildren
                .GroupBy(x => x.Id)
                .Select(g => g.First())
                .ToList();
        }

        [HttpGet("classifications")]
        public async Task<IActionResult> GetClassifications()
        {
            var data = await _db.DmsClassificationMasters
                .Where(x => x.IsActive)
                .OrderBy(x => x.SortOrder)
                .Select(x => new
                {
                    x.ID,
                    x.Name
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("sub-classifications/{classificationId}")]
        public async Task<IActionResult> GetSubClassifications(int classificationId)
        {
            var data = await _db.DmsSubClassificationMasters
                .Where(x => x.ClassificationId == classificationId && x.IsActive)
                .Select(x => new { x.ID, x.Name })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("sub-sub-classifications/{subClassificationId}")]
        public async Task<IActionResult> GetSubSubClassifications(int subClassificationId)
        {
            var data = await _db.DmsSubSubClassificationMasters
                .Where(x => x.SubClassificationId == subClassificationId && x.IsActive)
                .Select(x => new { x.ID, x.Name })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(int projectId,  string? query,  DateTime? fromDate,  DateTime? toDate, [FromQuery] bool isMaster)
        {
            if (projectId <= 0)
                return BadRequest("Invalid project");

            var filesQuery = _db.ProjectFiles
                .Where(x => x.ProjectID == projectId)
                .Include(x => x.Tags) 
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                query = query.ToLower();
                filesQuery = filesQuery.Where(x =>
                    x.FileName.ToLower().Contains(query) ||
                    x.Classification.ToLower().Contains(query) ||
                    x.BlobPath.ToLower().Contains(query) ||
                    x.Tags.Any(t => t.TagName.ToLower().Contains(query))
                );
            }

            if (fromDate.HasValue)
                filesQuery = filesQuery.Where(x => x.Created >= fromDate.Value);

            if (toDate.HasValue)
            {
                var endOfDay = toDate.Value.Date.AddDays(1).AddTicks(-1);
                filesQuery = filesQuery.Where(x => x.Created <= endOfDay);
            }

            var files = await filesQuery
                .OrderByDescending(x => x.Created)
                .ToListAsync();

            var userIds = files
                .Select(f => f.CreatedBy)
                .Where(id => !string.IsNullOrEmpty(id))
                .Distinct()
                .ToList();

            var contacts = await _db.Contacts
                .Where(c => userIds.Contains(c.ID.ToString()))
                .Select(c => new { c.ID, c.FullName })
                .ToListAsync();

            var result = files.Select(f =>
            {
                var fullName = contacts.FirstOrDefault(c => c.ID.ToString() == f.CreatedBy)?.FullName ?? f.CreatedBy;
                return new
                {
                    f.ID,
                    f.FileName,
                    f.BlobUrl,
                    f.Classification,
                    Tags = f.Tags.Select(t => t.TagName).ToList(),
                    f.Created,
                    CreatedBy = fullName,
                    f.FileSize,
                    Path = f.BlobPath
                };
            }).ToList();

            return Ok(result);
        }

        [HttpPost("add-classification")]
        public async Task<IActionResult> AddClassification([FromBody] AddClassificationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Classification name required");

            var exists = await _db.DmsClassificationMasters
                .AnyAsync(x => x.Name.ToLower() == dto.Name.ToLower());

            if (exists)
                return Ok(new { message = "Already exists" });

            var entity = new DmsClassificationMaster
            {
                Name = dto.Name.Trim(),
                IsActive = true,
                SortOrder = 0,
                Created = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy
            };

            _db.DmsClassificationMasters.Add(entity);
            await _db.SaveChangesAsync();

            return Ok(entity);
        }

        [HttpPost("add-full-classification")]
        public async Task<IActionResult> AddFullClassification([FromBody] AddFullClassificationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Classification))
                return BadRequest("Classification required");

            // 🔹 1. Save Level 1
            var main = await _db.DmsClassificationMasters
                .FirstOrDefaultAsync(x => x.Name.ToLower() == dto.Classification.ToLower());

            if (main == null)
            {
                main = new DmsClassificationMaster
                {
                    Name = dto.Classification.Trim(),
                    IsActive = true,
                    Created = DateTime.UtcNow,
                    CreatedBy = dto.CreatedBy
                };

                _db.DmsClassificationMasters.Add(main);
                await _db.SaveChangesAsync();
            }

            // 🔹 2. Save Level 2
            DmsSubClassificationMaster? sub = null;

            if (!string.IsNullOrWhiteSpace(dto.SubClassification))
            {
                sub = await _db.DmsSubClassificationMasters
                    .FirstOrDefaultAsync(x =>
                        x.Name.ToLower() == dto.SubClassification.ToLower() &&
                        x.ClassificationId == main.ID);

                if (sub == null)
                {
                    sub = new DmsSubClassificationMaster
                    {
                        Name = dto.SubClassification.Trim(),
                        ClassificationId = main.ID,
                        IsActive = true,
                        Created = DateTime.UtcNow,
                        CreatedBy = dto.CreatedBy
                    };

                    _db.DmsSubClassificationMasters.Add(sub);
                    await _db.SaveChangesAsync();
                }
            }

            // 🔹 3. Save Level 3
            if (!string.IsNullOrWhiteSpace(dto.SubSubClassification) && sub != null)
            {
                var subsub = await _db.DmsSubSubClassificationMasters
                    .FirstOrDefaultAsync(x =>
                        x.Name.ToLower() == dto.SubSubClassification.ToLower() &&
                        x.SubClassificationId == sub.ID);

                if (subsub == null)
                {
                    subsub = new DmsSubSubClassificationMaster
                    {
                        Name = dto.SubSubClassification.Trim(),
                        SubClassificationId = sub.ID,
                        IsActive = true,
                        Created = DateTime.UtcNow,
                        CreatedBy = dto.CreatedBy
                    };

                    _db.DmsSubSubClassificationMasters.Add(subsub);
                    await _db.SaveChangesAsync();
                }
            }

            return Ok(new { message = "Saved successfully" });
        }

        [HttpPost("rename-folder")]
        public async Task<IActionResult> RenameFolder([FromBody] RenameFolderDto dto)
        {
            if (dto.FolderId <= 0 || string.IsNullOrWhiteSpace(dto.NewName))
                return BadRequest("Invalid request");

            var folder = await _db.ProjectFolders
                .FirstOrDefaultAsync(f => f.Id == dto.FolderId && f.ProjectId == dto.ProjectId);

            if (folder == null)
                return NotFound("Folder not found");

            string oldFolderName = folder.FolderName;
            string newFolderName = dto.NewName.Trim();

            folder.FolderName = newFolderName;

            var filesToUpdate = await _db.ProjectFiles
                .Where(f => f.FolderId == dto.FolderId && f.ProjectID == folder.ProjectId)
                .ToListAsync();

            foreach (var file in filesToUpdate)
            {
                var segments = file.BlobPath.Split('/').ToList();

                int folderIndex = segments.FindIndex(s => s == oldFolderName);
                if (folderIndex >= 0)
                    segments[folderIndex] = newFolderName;

                file.BlobPath = string.Join('/', segments);
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Folder renamed successfully",
                folderId = folder.Id,
                newName = folder.FolderName
            });
        }

        [HttpPost("create-folder")]
        public async Task<IActionResult> CreateFolder([FromBody] CreateFolderDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FolderName))
                return BadRequest("Invalid folder name");

            if (dto.ProjectId < 0)
                return BadRequest("Invalid project");

            var exists = await _db.ProjectFolders
            .AnyAsync(f =>
                f.ProjectId == dto.ProjectId &&
                f.ParentFolderId == dto.ParentFolderId &&
                EF.Functions.Like(f.FolderName, dto.FolderName.Trim())
            );

            var folder = new ProjectFolder
            {
                ProjectId = dto.ProjectId,
                FolderName = dto.FolderName.Trim(),
                Classification = dto.Classification ?? "",
                ParentFolderId = dto.ParentFolderId,
                CreatedBy = dto.CreatedBy ?? "System",
                Created = DateTime.UtcNow
            };

            _db.ProjectFolders.Add(folder);
            await _db.SaveChangesAsync();

            return Ok(folder);
        }

        [HttpDelete("file/{fileId}")]
        public async Task<IActionResult> DeleteFile(int fileId)
        {
            var file = await _db.ProjectFiles.FirstOrDefaultAsync(f => f.ID == fileId);
            if (file == null) return NotFound("File not found");

            var setting = await _db.AppSettingMasters
                .FirstOrDefaultAsync(x => x.PresetKey == "AZURE_STORAGE_KEY");

            if (setting == null || string.IsNullOrWhiteSpace(setting.PresetValue))
                return BadRequest("Azure Blob connection string not configured");

            try
            {
                var uri = new Uri(file.BlobUrl);
                var blobPath = uri.AbsolutePath.Replace("/dms/", "");

                await _blobService.DeleteBlobAsync(
                    setting.PresetValue,
                    "dms",
                    blobPath
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine("Blob delete failed: " + ex.Message);
            }

            _db.ProjectFiles.Remove(file);
            await _db.SaveChangesAsync();

            return Ok(new { message = "File deleted successfully" });
        }

       [HttpDelete("folder/{folderId}")]
        public async Task<IActionResult> DeleteFolder(int folderId)
        {
            var setting = await _db.AppSettingMasters
                .FirstOrDefaultAsync(x => x.PresetKey == "AZURE_STORAGE_KEY");

            if (setting == null || string.IsNullOrWhiteSpace(setting.PresetValue))
                return BadRequest("Azure Blob connection string not configured");

            await DeleteFolderRecursive(folderId, setting.PresetValue);

            await _db.SaveChangesAsync();

            return Ok(new { message = "Folder deleted successfully" });
        }
        private async Task DeleteFolderRecursive(int folderId, string connectionString)
        {
            var childFolders = await _db.ProjectFolders
                .Where(f => f.ParentFolderId == folderId)
                .ToListAsync();

            foreach (var child in childFolders)
            {
                await DeleteFolderRecursive(child.Id, connectionString);
            }

            var files = await _db.ProjectFiles
                .Where(f => f.FolderId == folderId)
                .ToListAsync();

            foreach (var file in files)
            {
                try
                {
                    var uri = new Uri(file.BlobUrl);
                    var blobPath = uri.AbsolutePath.Replace("/dms/", "");

                    await _blobService.DeleteBlobAsync(
                        connectionString,
                        "dms",
                        blobPath
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Blob delete failed: " + ex.Message);
                }
            }

            _db.ProjectFiles.RemoveRange(files);

            var folder = await _db.ProjectFolders.FindAsync(folderId);
            if (folder != null)
                _db.ProjectFolders.Remove(folder);
        }

        [HttpGet("get-subfolders")]
        public async Task<IActionResult> GetSubFolders()
        {
            var folders = await _db.ProjectSubFolderDMSFile
                .OrderBy(x => x.FolderName)
                .ToListAsync();

            return Ok(folders);
        }

        [HttpPost("add-subfolder")]
        public async Task<IActionResult> AddSubFolder([FromBody] ProjectSubFolderDMSFile folder)
        {
            if (string.IsNullOrWhiteSpace(folder.FolderName))
                return BadRequest("Folder name required");

            _db.ProjectSubFolderDMSFile.Add(folder);
            await _db.SaveChangesAsync();
            return Ok(folder);
        }

        [HttpPut("update-subfolder/{id}")]
        public async Task<IActionResult> UpdateSubFolder(int id, [FromBody] ProjectSubFolderDMSFile folder)
        {
            var existing = await _db.ProjectSubFolderDMSFile.FindAsync(id);
            if (existing == null) return NotFound();

            existing.FolderName = folder.FolderName;
            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("delete-subfolder/{id}")]
        public async Task<IActionResult> DeleteSubFolder(int id)
        {
            var existing = await _db.ProjectSubFolderDMSFile.FindAsync(id);
            if (existing == null) return NotFound();

            _db.ProjectSubFolderDMSFile.Remove(existing);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("update-folder-permission")]
        public async Task<IActionResult> UpdateFolderPermission([FromBody] PermissionDto dto)
        {
            if (!dto.FolderId.HasValue)
                return BadRequest("FolderId required");

            var folderId = dto.FolderId.Value;

            var old = _db.ProjectFolderDenies.Where(x => x.FolderId == folderId);
            _db.ProjectFolderDenies.RemoveRange(old);

            if (dto.DeniedUsers != null && dto.DeniedUsers.Any())
            {
                var denies = dto.DeniedUsers.Select(u => new ProjectFolderDeny
                {
                    FolderId = folderId,
                    UserId = u
                }).ToList();

                _db.ProjectFolderDenies.AddRange(denies);
            }

            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("update-file-permission")]
        public async Task<IActionResult> UpdateFilePermission([FromBody] PermissionDto dto)
        {
            if (!dto.FileId.HasValue)
                return BadRequest("FileId required");

            var fileId = dto.FileId.Value;

            var old = _db.ProjectFileDenies.Where(x => x.FileId == fileId);
            _db.ProjectFileDenies.RemoveRange(old);

            if (dto.DeniedUsers != null && dto.DeniedUsers.Any())
            {
                var denies = dto.DeniedUsers.Select(u => new ProjectFileDeny
                {
                    FileId = fileId,
                    UserId = u
                }).ToList();

                _db.ProjectFileDenies.AddRange(denies);
            }
            await _db.SaveChangesAsync();
            return Ok();
        }

        public class PermissionDto
        {
            public int? FolderId { get; set; }
            public int? FileId { get; set; }
            public List<string>? DeniedUsers { get; set; }
        }

    }
}