namespace MyCockpitView.WebApi.MeetingModule.Dtos;

public class CreateCNoteDto
{
    public MeetingAgendaDto MeetingAgenda { get; set; }
    public virtual ICollection<MeetingAttendeeDto> Attendees { get; set; } = new List<MeetingAttendeeDto>();
}

