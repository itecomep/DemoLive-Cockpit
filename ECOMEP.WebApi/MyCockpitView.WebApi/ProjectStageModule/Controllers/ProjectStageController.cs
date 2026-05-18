using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ProjectStageModule.Dtos;
using MyCockpitView.WebApi.ProjectStageModule.Entities;

namespace MyCockpitView.WebApi.ProjectStageModule.Controllers
{
    [ApiController]
    [Route("api/project-stages")]
    public class ProjectStageController : ControllerBase
    {
        private readonly EntitiesContext _dbContext;
        public ProjectStageController(EntitiesContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("save-project-stage-mail")]
        public async Task<IActionResult> SaveProjectStageMail(
            [FromBody] ProjectStageMailDto dto)
        {
            try
            {
                // var existingCount = await _dbContext.ProjectStageMails
                //     .CountAsync(x =>
                //         x.ProjectId == dto.ProjectId &&
                //         x.StageId == dto.StageId &&
                //         x.StageComplete == dto.StageComplete &&
                //         x.GenerateInvoice == dto.GenerateInvoice &&
                //         x.Rework == dto.Rework
                //     );

                // var revisionName = $"R{existingCount}";
                string? stageCompleteRevision = null;
                string? generateInvoiceRevision = null;
                string? reworkRevision = null;

                if (dto.StageComplete)
                {
                    var count = await _dbContext.ProjectStageMails
                        .CountAsync(x =>
                            x.ProjectId == dto.ProjectId &&
                            x.StageId == dto.StageId &&
                            x.StageComplete
                        );

                    stageCompleteRevision = $"R{count}";
                }

                if (dto.GenerateInvoice)
                {
                    var count = await _dbContext.ProjectStageMails
                        .CountAsync(x =>
                            x.ProjectId == dto.ProjectId &&
                            x.StageId == dto.StageId &&
                            x.GenerateInvoice
                        );

                    generateInvoiceRevision = $"R{count}";
                }

                if (dto.Rework)
                {
                    var count = await _dbContext.ProjectStageMails
                        .CountAsync(x =>
                            x.ProjectId == dto.ProjectId &&
                            x.StageId == dto.StageId &&
                            x.Rework
                        );

                    reworkRevision = $"R{count}";
                }
                var entity = new ProjectStageMail
                {
                    UserId = dto.UserId,
                    ProjectId = dto.ProjectId,
                    ProjectName = dto.ProjectName,
                    StageId = dto.StageId,
                    StageName = dto.StageName,
                    StageComplete = dto.StageComplete,
                    GenerateInvoice = dto.GenerateInvoice,
                    Rework = dto.Rework,
                    StageCompleteRevision = stageCompleteRevision,
                    GenerateInvoiceRevision = generateInvoiceRevision,
                    ReworkRevision = reworkRevision,
                    ToMail = dto.ToMail,
                    CcMail = dto.CcMail,
                    BccMail = dto.BccMail,
                    Subject = dto.Subject,
                    Body = dto.Body,
                    GmailMessageId = dto.GmailMessageId,
                    GmailThreadId = dto.GmailThreadId,
                    MailSentDate = DateTime.UtcNow
                };

                _dbContext.ProjectStageMails.Add(entity);
                await _dbContext.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    message = "Mail details saved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // [HttpGet("user-mails/{userId}")]
        // public async Task<IActionResult> GetUserProjectStageMails(int userId)
        // {
        //     var data = await _dbContext.ProjectStageMails
        //         .Where(x => x.UserId == userId)
        //         .OrderByDescending(x => x.MailSentDate)
        //         .ToListAsync();
        //     return Ok(data);
        // }

        [HttpPost("user-mails")]
        public async Task<IActionResult> GetUserProjectStageMails([FromBody] List<int> projectIds)
        {
            var data = await _dbContext.ProjectStageMails
                .Where(x => projectIds.Contains(x.ProjectId))
                .OrderByDescending(x => x.MailSentDate)
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("stages/{projectId}")]
        public async Task<IActionResult> GetStagesByProject(int projectId)
        {
            var stages = await _dbContext.ProjectStages
                .Where(x => x.ProjectID == projectId)
                .Select(x => new { x.ID, x.Title })
                .ToListAsync();
            return Ok(stages);
        }

        [HttpGet("latest-revisions")]
        public async Task<IActionResult> GetLatestRevisions(
            int projectId,
            int stageId)
        {
            var mails = await _dbContext.ProjectStageMails
                .Where(x =>
                    x.ProjectId == projectId &&
                    x.StageId == stageId
                )
                .ToListAsync();

            string stageCompleteRevision = mails
                .Where(x => x.StageComplete && x.StageCompleteRevision != null)
                .OrderByDescending(x => x.MailSentDate)
                .Select(x => x.StageCompleteRevision)
                .FirstOrDefault() ?? "-";

            string generateInvoiceRevision = mails
                .Where(x => x.GenerateInvoice && x.GenerateInvoiceRevision != null)
                .OrderByDescending(x => x.MailSentDate)
                .Select(x => x.GenerateInvoiceRevision)
                .FirstOrDefault() ?? "-";

            string reworkRevision = mails
                .Where(x => x.Rework && x.ReworkRevision != null)
                .OrderByDescending(x => x.MailSentDate)
                .Select(x => x.ReworkRevision)
                .FirstOrDefault() ?? "-";

            return Ok(new
            {
                stageCompleteRevision,
                generateInvoiceRevision,
                reworkRevision
            });
        }
    }
}