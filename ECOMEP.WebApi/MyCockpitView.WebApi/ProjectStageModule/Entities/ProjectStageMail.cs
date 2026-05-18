using System;

namespace MyCockpitView.WebApi.ProjectStageModule.Entities
{
    public class ProjectStageMail
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int StageId { get; set; }
        public string? StageName { get; set; }
        public string? StageCompleteRevision { get; set; }
        public string? GenerateInvoiceRevision { get; set; }
        public string? ReworkRevision { get; set; }
        public bool StageComplete { get; set; }
        public bool GenerateInvoice { get; set; }
        public bool Rework { get; set; }
        public string? ToMail { get; set; }
        public string? CcMail { get; set; }
        public string? BccMail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public DateTime MailSentDate { get; set; }
        public string? GmailMessageId { get; set; }
        public string? GmailThreadId { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}