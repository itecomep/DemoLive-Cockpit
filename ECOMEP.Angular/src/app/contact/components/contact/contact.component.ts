import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContactApiService } from '../../services/contact-api.service';
import { Contact, ContactAssociation } from '../../models/contact';
import { ContactAppointment } from '../../models/contact-appointment.model';
import { ContactAppointmentApiService } from '../../services/contact-appointment-api.service';
import { firstValueFrom } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { FormGroup } from '@angular/forms';
import { ContactAssociationApiService } from '../../services/contact-association-api.service';
import { ContactUpdateComponent } from '../contact-update/contact-update.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactAssociationComponent } from '../contact-association/contact-association.component';
import { ContactProjectsComponent } from '../contact-projects/contact-projects.component';
import { ContactWorkOrderComponent } from '../contact-work-order/contact-work-order.component';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [MatTabsModule, ContactAssociationComponent, NgClass, NgIf, NgFor, MatButtonModule, MatTooltipModule, MatIconModule,

    //Components
    ContactDetailsComponent,
    ContactUpdateComponent,
    ContactProjectsComponent,
    ContactWorkOrderComponent
  ]
})
export class ContactComponent implements OnInit {

  @Input('config') set configValue(value: {
    entityID: number;
    currentEntity: any;
  }) {
    if (value) {
      this.entityID = value.entityID;
      this.currentEntity = value.currentEntity;
      this.refresh();
    }
  }
  entityID!: number;
  currentEntity: Contact = new Contact();
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isEditMode() { return this.entityApiService.isEditMode; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionEdit; }
  get isPermissionDelete() { return this.entityApiService.isPermissionDelete; }
  get isPermissionList() { return this.entityApiService.isPermissionDelete; }
  get isPermissionNotesView(): boolean { return this.entityApiService.isPermissionNotesView; }
  get isPermissionNotesEdit(): boolean { return this.entityApiService.isPermissionNotesEdit; }
  get isPermissionAssocationView(): boolean { return this.entityApiService.isPermissionAssocationView; }
  get TEAM_APPOINTMENT_STATUS_APPOINTED() { return this.contactAppointmentService.TEAM_APPOINTMENT_STATUS_APPOINTED; };

  //Contact Project 
  get isPermissionProjectView(){return this.entityApiService.isPermissionProjectView}

  //WorkOrder
  get isPermissionWorkOrderView(){return this.entityApiService.isPermissionWorkOrderView}

  updateForm!: FormGroup;

  get isActiveAppointment() { return this.currentEntity.appointments.filter(x => x.statusFlag == this.TEAM_APPOINTMENT_STATUS_APPOINTED).length > 0; }

  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  constructor(
    private entityApiService: ContactApiService,
    private contactAppointmentService: ContactAppointmentApiService,
    private contactAssociationService: ContactAssociationApiService,
    private utilityService: UtilityService,
    private router: Router,
    private config: AppConfig,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    if (this.currentEntity.appointments.length)
      this.getAppointMents();
  }
  async refresh() {
    this.currentEntity = new Contact();
    if (this.entityID && this.entityID !== -1) {
      await this.getCurrent(this.entityID);
      this.entityApiService.activeEntity = this.currentEntity;
    }
  }

  private async getCurrent(id: number) {
    this.currentEntity = await firstValueFrom(this.entityApiService.getById(id));
    this.contactAssociationService.resetItems();

    this.entityApiService.isEditMode = false;
  }

  onUpdate(event: Contact) {
    this.currentEntity = Object.assign({}, event);
    this.update.emit(event);
  }

  onFormChange(event: FormGroup) {
    this.updateForm = event
  }

  // onDelete(event: Contact)
  // {
  //   this.delete.emit(event);
  // }

  onEdit() {
    this.entityApiService.isEditMode = true;
  }

  onViewMode() {
    this.entityApiService.isEditMode = false;
  }

  showNewAppointment: boolean = false;

  onAppointMentChange(appointment: any) {
    if (appointment) {
      let exist = this.currentEntity.appointments.find(x => x.id == appointment.id);
      if (!exist) {
        this.currentEntity.appointments.push(appointment);
      } else {
        exist = Object.assign({}, appointment);
      }
      this.showNewAppointment = this.currentEntity.appointments.length == 0;
    }
  }

  addAppointment() {
    this.showNewAppointment = true;
  }

  onDeleteAppointment(appointment: ContactAppointment) {
    this.currentEntity.appointments = this.currentEntity.appointments.filter(x => x.id !== appointment.id);
  }

  async getAppointMents() {
    this.currentEntity.appointments = await firstValueFrom(this.contactAppointmentService.getById(this.currentEntity.id));
  }

  onDelete() {
    const _messageText = `Delete ${this.nameOfEntity}: ${this.currentEntity.name}`;

    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        await firstValueFrom(this.entityApiService.delete(this.currentEntity.id))
        this.utilityService.showSwalToast(
          'Success!',
          'Delete successful.',
        );
        this.delete.emit(this.currentEntity);
        this.entityApiService.activeEntity = undefined;
        this.entityApiService.refreshList();
        this.router.navigate([this.config.ROUTE_CONTACT_LIST]);
      }
    );
  }
  private touchForm(form: FormGroup) {
    if (form) {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onSubmit() {
    if (this.updateForm.invalid) {
      this.touchForm(this.updateForm);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    if (!this.currentEntity) {
      this.currentEntity = new Contact();
    }

    this.currentEntity = Object.assign(this.currentEntity, this.updateForm.value);
    this.currentEntity.title = this.currentEntity.isCompany ? undefined : this.currentEntity.title;
    console.log(this.currentEntity);
    const _messageText = `Update ${(this.currentEntity.isCompany ? 'Company' : 'Person')} | ${this.nameOfEntity}: ${this.currentEntity.fullName}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        await this.contactAssociationService.updateItems();
        this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
        this.entityApiService.activeEntity = this.currentEntity;
        this.utilityService.showSwalToast('Success!', 'Save successful.');
        this.entityApiService.refreshList();
        this.update.emit(this.currentEntity);
      }
    );
  }

  updateAssociation(associations: ContactAssociation[]) {
    if (this.currentEntity.isCompany) {
      this.currentEntity.associatedContacts = associations;
    } else {
      this.currentEntity.associatedCompanies = associations;
    }
  }

  openPhotoDialog() {
      this.dialog.open(ContactPhotoNameDialogComponent, {
        data: {
          photoUrl: this.currentEntity.photoUrl,
          fullName: this.currentEntity.fullName,
          isCompany: this.currentEntity.isCompany
        }
      });
    }
}

