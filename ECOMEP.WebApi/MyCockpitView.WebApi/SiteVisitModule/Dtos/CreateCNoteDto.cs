

namespace MyCockpitView.WebApi.SiteVisitModule.Dtos;

public class CreateCNoteDto
{
    public SiteVisitAgendaDto SiteVisitAgenda { get; set; }
    public virtual ICollection<SiteVisitAttendeeDto> Attendees { get; set; } = new List<SiteVisitAttendeeDto>();
}


