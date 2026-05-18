using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
namespace MyCockpitView.WebApi.TodoModule.Dtos;

public class TodoListDto : BaseEntityDto
{


    public string? Title { get; set; }
    public string? SubTitle { get; set; }



    public DateTime DueDate { get; set; }

    public ContactListDto? Assigner { get; set; }

    public ContactListDto? Assignee { get; set; }


    public bool IsDelayed { get; set; }
    [StringLength(50)]
    public string? Priority { get; set; }
}
public class TodoDto : TodoListDto
{

    public DateTime StartDate { get; set; }

    public string? Comment { get; set; }
    public int? ParentID { get; set; }


    public int AssigneeContactID { get; set; }


    public int AssignerContactID { get; set; }


    public virtual ICollection<TodoAttachmentDto> Attachments { get; set; }=new List<TodoAttachmentDto>();

    public virtual ICollection<TodoAgendaDto> Agendas { get; set; }= new List<TodoAgendaDto>();
    public int? ProjectID { get; set; }

    public decimal MHrAssigned { get; set; }
    public decimal MHrConsumed { get; set; }


}

public class TodoAttachmentDto : BaseBlobEntityDto
{

    public int TodoID { get; set; }

}