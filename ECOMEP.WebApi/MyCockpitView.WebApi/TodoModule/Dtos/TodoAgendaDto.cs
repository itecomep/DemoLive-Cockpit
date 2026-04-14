using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.TodoModule.Dtos;

public class TodoAgendaDto : BaseEntityDto
{

    public string? Title { get; set; }

    public int TodoID { get; set; }

}