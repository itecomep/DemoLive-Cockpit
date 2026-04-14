using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.ActivityModule.Entities;
using System.ComponentModel;

namespace MyCockpitView.WebApi.TodoModule.Dtos;

public class TodoAnalysisDto
{
    public DateTime StartDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }

    public decimal Delay { get{ return CompletedDate.HasValue && CompletedDate > DueDate ? Convert.ToDecimal((CompletedDate.Value - DueDate).TotalHours) : 0m;}}

    public string? Priority { get; set; }
    public string? StatusValue { get; set; }
    public string? Title { get; set; }
    public Contact? Assignee { get; set; }
    public int AssigneeContactID { get; set; }
    public string AssigneeName { get; set; }
    public Contact? Assigner{ get; set; }
    public int AssignerContactID { get; set; }
    public string AssignerName { get; set; }
    public decimal MHrAssigned { get; set; }
    public decimal MHrConsumed { get; set; }
    public int? ProjectID { get; set; }
    public int? EntityID { get; set; }
    public int StatusFlag { get; set; }
    public int Revision { get; set; }
    public ICollection<TodoAnalysisAgenda> Agendas { get; set; }=new List<TodoAnalysisAgenda>();
    public ICollection<TodoAnalysisAgenda> CompletedAgendas { get; set; } = new List<TodoAnalysisAgenda>();
    public ICollection<TodoAnalysisAgenda> PendingAgendas { get; set; } = new List<TodoAnalysisAgenda>();

    public decimal AgendaScore { get { return CompletedAgendas.Count != 0 ? (Agendas.Count / CompletedAgendas.Count) : 100m; } }
    public ICollection<TodoAnalysisActivity> Activity { get; set; }= new List<TodoAnalysisActivity>();
    public ICollection<TodoAnalysisTeam> Teams {  get; set; } = new List<TodoAnalysisTeam>();
}

public class TodoAnalysisAgenda
{
    public int OrderFlag { get; set; }
    public int StatusFlag { get; set; }
    public string? Title { get; set; }
}

public class TodoAnalysisTeam
{
    public int ID { get; set; }
    public string Title { get; set; }
}

public class TodoAnalysisActivity
{
    public string? Action { get; set; }
    public string? ContactName { get; set; }
    public string? ContactPhotoUrl { get; set; }
    public string? EntityTitle { get; set; }
    public string? Status { get; set; }
    public string? Comments { get; set; }
    public DateTime Created { get; set; }
    public int? StatusFlag { get; set; }
    public ICollection<TodoAnalysisActvityAttachment> Attachments { get; set; } = new List<TodoAnalysisActvityAttachment>();
}

public class TodoAnalysisActvityAttachment
{
    public string? Filename { get; set; }
    public string? ContentType { get; set; }
    public string? Url { get; set; }
    public int? Size { get; set; }
    public string? ThumbUrl { get; set; }
}