import { Component, Input } from '@angular/core';
import { ContactAppointment } from '../../models/contact-appointment.model';

@Component({
    selector: 'app-contact-team-appointment',
    templateUrl: './contact-team-appointment.component.html',
    styleUrls: ['./contact-team-appointment.component.scss'],
    standalone: true
})
export class ContactTeamAppointmentComponent
{

  @Input() appointment!: ContactAppointment;
}
