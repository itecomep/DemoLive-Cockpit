namespace MyCockpitView.WebApi.WFTaskModule.Dtos;

public class WFTaskAnalysisDto
{
    public string? Project { get; set; }
    public string? Person { get; set; }
    public string? AssignedBy { get; set; }
    public string? Entity { get; set; }
    public string? EntityTitle { get; set; }
    public string? TaskTitle { get; set; }
    public int Revision { get; set; }
    public string? WorkDescription { get; set; }
    public string? Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public decimal Delay { get; set; }
    public string? CommentOnCompletion { get; set; }
    public bool IsTimeBoundTask { get; set; }
    public decimal ManValue { get; set; }
    public decimal VHrRate { get; set; }
    public decimal MHrAssigned { get; set; }
    public decimal VHrAssigned { get; set; }
    public decimal VHrAssignedCost { get; set; }
    public decimal MHrConsumed { get; set; }
    public decimal VHrConsumed { get; set; }
    public decimal VHrConsumedCost { get; set; }
    public decimal MHrAssessed { get; set; }
    public decimal VHrAssessed { get; set; }
    public decimal VHrAssessedCost { get; set; }
    public bool IsAssessmentApplicable { get; set; }
    public decimal AssessmentPoints { get; set; }
    public string? AssessmentRemark { get; set; }
    public string? AssessmentSummary { get; set; }
    public int WFTaskID { get; set; }
    public int? EntityID { get; set; }
    public int ContactID { get; set; }
    public int? ProjectID { get; set; }
    public int? CompanyID { get; set; }
    public virtual IEnumerable<WFTaskAnalysisAssessmentDto> Assessments { get; set; } = new List<WFTaskAnalysisAssessmentDto>();

    public decimal MHrBurned
    {
        get
        {
            return MHrConsumed > MHrAssessed ? MHrConsumed - MHrAssessed : 0;
        }
    }
}
