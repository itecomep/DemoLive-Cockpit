import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact } from '../../models/contact';
import { ContactAppointment, ContactAppointmentAttachment } from '../../models/contact-appointment.model';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactAppointmentApiService } from '../../services/contact-appointment-api.service';
import { ContactTeamAppointmentCreateFormComponent } from '../contact-team-appointment-create-form/contact-team-appointment-create-form.component';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { ContactTeamAppointmentComponent } from '../contact-team-appointment/contact-team-appointment.component';
import { ContactTeamAppointmentFormComponent } from '../contact-team-appointment-form/contact-team-appointment-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { ContactTeamApiService } from '../../services/contact-team-api.service';
import { ContactTeam } from '../../models/contact-team.model';

@Component({
    selector: 'app-contact-team-appointment-list',
    templateUrl: './contact-team-appointment-list.component.html',
    styleUrls: ['./contact-team-appointment-list.component.scss'],
    standalone: true,
    imports: [NgIf, MatIconModule, NgFor, NgClass, McvFileComponent, MatChipsModule, ContactTeamAppointmentFormComponent, ContactTeamAppointmentComponent, DatePipe]
})
export class ContactTeamAppointmentListComponent 
{
  contact!: Contact;
  teams: ContactTeam[] = [];
  contactOptions: Contact[] = [];

  get TEAM_APPOINTMENT_STATUS_APPOINTED() { return this.appointmentsService.TEAM_APPOINTMENT_STATUS_APPOINTED; };
  get TEAM_APPOINTMENT_STATUS_RESIGNED() { return this.appointmentsService.TEAM_APPOINTMENT_STATUS_RESIGNED; }
  get TEAM_APPOINTMENT_STATUS_ONBREAK() { return this.appointmentsService.TEAM_APPOINTMENT_STATUS_ONBREAK; }

  @Input('contact') set setContact(value: Contact)
  {
    this.contact = value;
    // if (this.contact.appointments.length == 0)
    // {
      this.getAppointments();
      this.getContactOptions();
      this.getTeams();
    // }
  }

  isEditMode: boolean = false;
  @Input('isEditMode') set setIsEditMode(value: boolean)
  {
    this.isEditMode = value;
    // if (this.isEditMode)
    // {
    //   this.getContactOptions();
    // }
  }

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }

  get isPermissionEdit() { return this.entityService.isPermissionAppointmentsEdit; }
  get isPermissionDelete() { return this.entityService.isPermissionAppointmentsDelete; }

  constructor(
    private utilityService: UtilityService,
    private entityService: ContactApiService,
    private appointmentsService: ContactAppointmentApiService,
    private contactService: ContactApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private teamService: ContactTeamApiService
  ) { }

  private async getContactOptions()
  {
    this.contactOptions = await firstValueFrom(this.contactService.getOptions([{ key: 'IsAppointed', value: 'true' }, { key: 'usersonly', value: 'true' }]));
  }

  private async getAppointments()
  {
    this.contact.appointments = await firstValueFrom(this.appointmentsService.get([{ key: 'ContactID', value: this.contact.id.toString() }]));
    this.contact.appointments
      .sort((a, b) => a.statusFlag - b.statusFlag)
      .sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime());
  }

  public onClickNew()
  {
    // this.showNew = !this.showNew;
    let _dialogRef = this.appointmentsService.openDialog(ContactTeamAppointmentCreateFormComponent, {
      contact: this.contact,
      contactOptions: this.contactOptions
    });
    _dialogRef.afterClosed().subscribe((result) =>
    {
      if (result)
      {
        this.contact.appointments.push(result);
        this.contact.appointments
          .sort((a, b) => a.statusFlag - b.statusFlag)
          .sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime());
        this.entityService.refreshList();
      }
    });
  }


  onDelete(appointment: ContactAppointment)
  {
    this.contact.appointments = this.contact.appointments.filter(x => x.id !== appointment.id);
    this.contact.appointments
      .sort((a, b) => a.statusFlag - b.statusFlag)
      .sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime());
  }

  onUpdate(updated: ContactAppointment, original: ContactAppointment)
  {
    original = Object.assign({}, updated);
    this.contact.appointments
      .sort((a, b) => a.statusFlag - b.statusFlag)
      .sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime());
  }
  getFilteredAttachments(attachments: ContactAppointmentAttachment[], typeFlag: number, isMedia: boolean)
  {
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }

  async getTeams(){
    this.teams = await firstValueFrom(this.teamService.get());
  }

  isMemberInTeam(team: any, contactID: number): boolean {
    return team.members?.some((member: any) => member.contactID === contactID);
  }
}
