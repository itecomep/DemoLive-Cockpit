namespace MyCockpitView.WebApi.ProjectStageModule.Dtos
{
    public class ProjectStageMailDto
    {
        public int UserId { get; set; }
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int StageId { get; set; }
        public string? StageName { get; set; }
        public bool StageComplete { get; set; }
        public bool GenerateInvoice { get; set; }
        public bool Rework { get; set; }
        public string? ToMail { get; set; }
        public string? CcMail { get; set; }
        public string? BccMail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public string? GmailMessageId { get; set; }
        public string? GmailThreadId { get; set; }
    }
}