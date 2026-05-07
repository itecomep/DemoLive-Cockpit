// using Microsoft.AspNetCore.Mvc;
// using MyCockpitView.WebApi.ProjectModule.Entities;

// namespace MyCockpitView.WebApi.ProjectModule.Controllers
// {
//     [Route("[controller]")]
//     [ApiController]
//     public class ProjectInwardNewController : ControllerBase
//     {
//         private readonly EntitiesContext _context;

//         public ProjectInwardNewController(EntitiesContext context)
//         {
//             _context = context;
//         }

//         [HttpPost]
//         public async Task<IActionResult> Create(
//             [FromBody] ProjectInwardNew model
//         )
//         {
//             try
//             {
//                 _context.ProjectInwardNews.Add(model);

//                 await _context.SaveChangesAsync();

//                 return Ok(model);
//             }
//             catch (Exception ex)
//             {
//                 return BadRequest(ex.Message);
//             }
//         }
//     }
// }


















// using Microsoft.AspNetCore.Mvc;
// using MyCockpitView.WebApi.ProjectModule.Entities;

// namespace MyCockpitView.WebApi.ProjectModule.Controllers
// {
//     [Route("[controller]")]
//     [ApiController]
//     public class ProjectInwardNewController : ControllerBase
//     {
//         private readonly EntitiesContext _context;
//         private readonly IWebHostEnvironment _env;

//         public ProjectInwardNewController(
//             EntitiesContext context,
//             IWebHostEnvironment env
//         )
//         {
//             _context = context;
//             _env = env;
//         }

//         [HttpPost]
//         public async Task<IActionResult> Create(
//             [FromForm] ProjectInwardNew model,
//             List<IFormFile> files
//         )
//         {
//             try
//             {
//                 // ✅ ROOT PATH
//                 var rootPath = Path.Combine(
//                     _env.WebRootPath,
//                     "SiteVisit"
//                 );

//                 // ✅ DATE FOLDER
//                 var dateFolder = DateTime.Now.ToString("yyyy-MM-dd");

//                 var finalFolder = Path.Combine(rootPath, dateFolder);

//                 // ✅ CREATE FOLDER IF NOT EXISTS
//                 if (!Directory.Exists(finalFolder))
//                 {
//                     Directory.CreateDirectory(finalFolder);
//                 }

//                 List<string> uploadedFiles = new();

//                 // ✅ SAVE FILES
//                 foreach (var file in files)
//                 {
//                     if (file.Length > 0)
//                     {
//                         var filePath = Path.Combine(
//                             finalFolder,
//                             file.FileName
//                         );

//                         using (var stream = new FileStream(filePath, FileMode.Create))
//                         {
//                             await file.CopyToAsync(stream);
//                         }

//                         uploadedFiles.Add(filePath);
//                     }
//                 }

//                 // ✅ SAVE DB
//                 model.AttachmentPath = finalFolder;

//                 _context.ProjectInwardNews.Add(model);

//                 await _context.SaveChangesAsync();

//                 return Ok(new
//                 {
//                     message = "Saved Successfully",
//                     folder = finalFolder,
//                     files = uploadedFiles
//                 });
//             }
//             catch (Exception ex)
//             {
//                 return BadRequest(ex.Message);
//             }
//         }
//     }
// }









using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ProjectModule.Entities;

namespace MyCockpitView.WebApi.ProjectModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectInwardNewController : ControllerBase
    {
        private readonly EntitiesContext _context;
        private readonly IWebHostEnvironment _env;

        public ProjectInwardNewController(
            EntitiesContext context,
            IWebHostEnvironment env
        )
        {
            _context = context;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm] ProjectInwardNew model,
            List<IFormFile> files
        )
        {
            try
            {
                // ✅ ROOT PATH
                var rootPath = Path.Combine(
                    _env.WebRootPath,
                    "SiteVisit"
                );

                // ✅ DATE FOLDER
                var dateFolder = DateTime.Now.ToString("yyyy-MM-dd");

                var finalFolder = Path.Combine(
                    rootPath,
                    dateFolder
                );

                // ✅ CREATE PHYSICAL FOLDER
                if (!Directory.Exists(finalFolder))
                {
                    Directory.CreateDirectory(finalFolder);
                }

                // ✅ CREATE / GET SITEVISIT ROOT FOLDER
                var siteVisitFolder = await _context.ProjectFolders
                    .FirstOrDefaultAsync(x =>
                        x.ProjectId == (model.ProjectID ?? 0) &&
                        x.FolderName == "SiteVisit" &&
                        x.ParentFolderId == null
                    );

                if (siteVisitFolder == null)
                {
                    siteVisitFolder = new ProjectFolder
                    {
                        ProjectId = model.ProjectID ?? 0,
                        FolderName = "SiteVisit",
                        Classification = "SiteVisit",
                        Created = DateTime.UtcNow,
                        CreatedBy = "System"
                    };

                    _context.ProjectFolders.Add(siteVisitFolder);

                    await _context.SaveChangesAsync();
                }

                // ✅ CREATE DATE SUBFOLDER
                var dateSubFolder = await _context.ProjectFolders
                    .FirstOrDefaultAsync(x =>
                        x.ProjectId == (model.ProjectID ?? 0) &&
                        x.FolderName == dateFolder &&
                        x.ParentFolderId == siteVisitFolder.Id
                    );

                if (dateSubFolder == null)
                {
                    dateSubFolder = new ProjectFolder
                    {
                        ProjectId = model.ProjectID ?? 0,
                        FolderName = dateFolder,
                        Classification = "SiteVisit",
                        ParentFolderId = siteVisitFolder.Id,
                        Created = DateTime.UtcNow,
                        CreatedBy = "System"
                    };

                    _context.ProjectFolders.Add(dateSubFolder);

                    await _context.SaveChangesAsync();
                }

                List<string> uploadedFiles = new();

                // ✅ SAVE FILES
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        var filePath = Path.Combine(
                            finalFolder,
                            file.FileName
                        );

                        using (var stream = new FileStream(
                            filePath,
                            FileMode.Create
                        ))
                        {
                            await file.CopyToAsync(stream);
                        }

                        uploadedFiles.Add(filePath);

                        // ✅ SAVE IN DMS TABLE
                        var projectFile = new ProjectFiles
                        {
                            ProjectID = model.ProjectID ?? 0,

                            FolderId = dateSubFolder.Id,

                            FileName = file.FileName,

                            BlobPath =
                                $"projects/{model.ProjectID}/SiteVisit/{dateFolder}/{file.FileName}",

                            BlobUrl =
                                $"/SiteVisit/{dateFolder}/{file.FileName}",

                            Classification = "SiteVisit",

                            Created = DateTime.UtcNow,

                            CreatedBy = "System",

                            FileSize = file.Length
                        };

                        _context.ProjectFiles.Add(projectFile);
                    }
                }

                // ✅ SAVE PROJECT INWARD
                model.AttachmentPath = finalFolder;

                _context.ProjectInwardNews.Add(model);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Saved Successfully",
                    folder = finalFolder,
                    files = uploadedFiles
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}