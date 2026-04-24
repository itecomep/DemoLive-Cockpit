using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ProjectModule.Dtos;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.Entities;

namespace MyCockpitView.WebApi.ProjectModule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTargetController : ControllerBase
    {
        private readonly EntitiesContext _db;

        public ProjectTargetController(EntitiesContext db)
        {
            _db = db;
        }

        //// ✅ GET ALL
        //[HttpGet]
        //public async Task<IActionResult> Get()
        //{
        //    var today = DateTime.Today;

        //    var data = await _db.ProjectTargets
        //        .Where(x => !x.IsDeleted)
        //        .ToListAsync();

        //    foreach (var item in data)
        //    {
        //        if (item.TargetDate.HasValue &&
        //            item.TargetDate.Value.Date < today &&
        //            item.StageStatus != "Complete & Generate Invoice")
        //        {
        //            // 🔥 FIXED: prevent timezone shift
        //            item.TargetDate = DateTime.SpecifyKind(
        //                today.AddDays(15).Date,
        //                DateTimeKind.Unspecified
        //            );

        //            item.ModifiedDate = DateTime.Now;
        //        }
        //    }

        //    await _db.SaveChangesAsync();

        //    return Ok(data.OrderByDescending(x => x.CreatedDate));
        //}



        // ✅ CREATE
        [HttpPost]
        public async Task<IActionResult> Create(ProjectTargetDto dto)
        {
            var project = await _db.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                return BadRequest("Project not found");

            // 🔹 First time entry rule
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

                // 🔥 FIXED: timezone-safe date
                TargetDate = dto.TargetDate.HasValue
                    ? DateTime.SpecifyKind(dto.TargetDate.Value.Date, DateTimeKind.Unspecified)
                    : null,

                StageStatus = dto.StageStatus,
                Feedback = dto.Feedback,
                CreatedDate = DateTime.Now,
                IsDeleted = false
            };

            // 🔥 Prevent duplicate completed stage
            var alreadyCompleted = await _db.ProjectTargets
                .AnyAsync(x =>
                    x.ProjectId == dto.ProjectId &&
                    x.Stage == dto.Stage &&
                    x.StageStatus == "Complete & Generate Invoice" &&
                    !x.IsDeleted);

            if (alreadyCompleted)
            {
                return BadRequest("This stage is already completed for this project.");
            }

            _db.ProjectTargets.Add(entity);
            await _db.SaveChangesAsync();

            return Ok(entity);
        }

        // ✅ UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProjectTargetDto dto)
        {
            var entity = await _db.ProjectTargets.FindAsync(id);
            if (entity == null) return NotFound();

            var histories = new List<ProjectTargetHistory>();

            // ================= TARGET DATE =================
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

            // ================= STATUS =================
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

            // ================= FEEDBACK =================
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

            // ❌ DO NOT TOUCH STAGE OR PROJECT unless needed
            entity.Stage = dto.Stage;
            entity.ProjectId = dto.ProjectId;

            entity.ModifiedDate = DateTime.Now;

            if (histories.Any())
            {
                _db.ProjectTargetHistories.AddRange(histories);
            }

            await _db.SaveChangesAsync();

            return Ok(entity);
        }

        // ✅ DELETE (Soft Delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.ProjectTargets.FindAsync(id);
            if (item == null) return NotFound();

            item.IsDeleted = true;
            item.ModifiedDate = DateTime.Now;

            await _db.SaveChangesAsync();

            return Ok();
        }

        // ✅ FORM DATA
        [HttpGet("form-data")]
        public async Task<IActionResult> GetFormData(int? projectId = null)
        {
            var projects = await _db.Projects
                .Select(x => new { x.ID, x.Title })
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

        // ✅ GET STAGES BY PROJECT
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
                .Where(x => !x.IsDeleted)
                .ToListAsync();

            // 🔥 EXISTING LOGIC (Auto extend expired date)
            foreach (var item in data)
            {
                if (item.TargetDate.HasValue &&
                    item.TargetDate.Value.Date < today &&
                    item.StageStatus != "Complete & Generate Invoice")
                {
                    item.TargetDate = DateTime.SpecifyKind(
                        today.AddDays(15).Date,
                        DateTimeKind.Unspecified
                    );

                    item.ModifiedDate = DateTime.Now;
                }
            }

            await _db.SaveChangesAsync();

            // 🔥 ADD HISTORY WITH EACH RECORD
            var result = data
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new
                {
                    x.Id,
                    x.ProjectId,
                    x.Stage,
                    x.TargetDate,
                    x.StageStatus,
                    x.Feedback,

                    history = _db.ProjectTargetHistories
                        .Where(h => h.ProjectTargetId == x.Id)
                        .OrderByDescending(h => h.ChangedOn)
                        .ToList()
                });

            return Ok(result);
        }



    }
}