import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact, ContactAttachment } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactUserPermissionsComponent } from '../contact-user-permissions/contact-user-permissions.component';
import { ContactTeamAppointmentListComponent } from '../contact-team-appointment-list/contact-team-appointment-list.component';
import { ContactTeamUpdateComponent } from '../contact-team-update/contact-team-update.component';
import { ContactTeamDetailsComponent } from '../contact-team-details/contact-team-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { ContactTeamDocumentsComponent } from '../contact-team-documents/contact-team-documents.component';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

@Component({
    selector: 'app-contact-team',
    templateUrl: './contact-team.component.html',
    styleUrls: ['./contact-team.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, NgFor, MatButtonModule, MatTooltipModule, MatIconModule, MatTabsModule, ContactTeamDetailsComponent, ContactTeamUpdateComponent, ContactTeamAppointmentListComponent, ContactUserPermissionsComponent,ContactTeamDocumentsComponent]
})
export class ContactTeamComponent implements OnInit
{

  @Input('config') set configValue(value: {
    entityID: number;
    currentEntity: any;
  })
  {
    if (value)
    {
      this.entityID = value.entityID;
      this.currentEntity = value.currentEntity;
      this.refresh();
    }
  }
  entityID!: number;
  currentEntity: Contact = new Contact();
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isEditMode() { return this.entityApiService.isEditMode; }
  get isPermissionView(): boolean { return this.entityApiService.isPermissionTeamContactView; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionTeamContactEdit; }
  get isPermissionDelete() { return this.entityApiService.isPermissionTeamContactDelete; }
  get isPermissionAppointmentEdit(): boolean { return this.entityApiService.isPermissionAppointmentsEdit; }
  get isPermissionAppointmentDelete() { return this.entityApiService.isPermissionAppointmentsDelete; }
  get isPermissionUserManagement(): boolean { return this.entityApiService.isPermissionUserManagement; }

  get isPermissionAppointmentsView() { return this.entityApiService.isPermissionAppointmentsView; }
  get isPermissionDocumentsView() { return this.entityApiService.isPermissionDocumentsView; }

  updateForm!: FormGroup;
  editableAttachmentConfig: any;

  @Output() update = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<Contact>();
  constructor(
    private entityApiService: ContactApiService,
    private utilityService: UtilityService,
    private router: Router,
    private config: AppConfig,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void
  {
    if (this.currentEntity.appointments.length)
    {
      // this.getAppointMents();
    }
  }
  async refresh()
  {
    this.currentEntity = new Contact();
    if (this.entityID && this.entityID !== -1)
    {
      await this.getCurrent(this.entityID);
    }
  }

  private async getCurrent(id: number)
  {
    this.currentEntity = await firstValueFrom(this.entityApiService.getById(id))
    this.entityApiService.isEditMode = false;
    this.editableAttachmentConfig = {
      apiUrl: this.config.apiContactAttachments,
      typeFlag: 0,
      entityTitle: this.currentEntity.name,
      entityID: this.currentEntity.id,
      allowEdit: this.entityApiService.isPermissionDocumentsEdit,
      allowDelete: this.entityApiService.isPermissionDocumentsDelete
    };
  }

  onUpdate(event: Contact)
  {
    this.currentEntity = Object.assign({}, event);
    this.update.emit(event);
  }

  onEdit()
  {
    this.entityApiService.isEditMode = true;
  }

  onViewMode()
  {
    this.entityApiService.isEditMode = false;
  }

  onFormChange(event: FormGroup)
  {
    if(event){
    this.updateForm = event
    }
  }

  onDelete()
  {
    const _messageText = `Delete ${this.nameOfEntity}: ${this.currentEntity.name}`;

    this.utilityService.showConfirmationDialog(_messageText,
      async () =>
      {
        await firstValueFrom(this.entityApiService.delete(this.currentEntity.id))
        this.utilityService.showSwalToast(
          'Success!',
          'Delete successful.',
        );
        this.delete.emit(this.currentEntity);
        this.entityApiService.activeEntity = null;
        this.entityApiService.refreshList();
        this.router.navigate([this.config.ROUTE_CONTACT_LIST]);
      }
    );
  }
  private touchForm(form: FormGroup)
  {
    if (form)
    {
      Object.keys(form.controls).forEach(field =>
      {
        const control = form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }
  onSubmit()
  {
    if(!this.updateForm) return;
    if (this.updateForm?.invalid)
    {
      this.touchForm(this.updateForm);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    if (!this.currentEntity)
    {
      this.currentEntity = new Contact();
    }

    this.currentEntity = Object.assign(this.currentEntity, this.updateForm.getRawValue());
    this.currentEntity.title = this.currentEntity.isCompany ? undefined : this.currentEntity.title;
    const _messageText = `Update | ${(this.currentEntity.isCompany ? 'Company' : 'Person')} | ${this.nameOfEntity}: ${this.currentEntity.fullName}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () =>
      {

        this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
        this.entityApiService.activeEntity = this.currentEntity;
        this.utilityService.showSwalToast('Success!', 'Save successful.');

        this.entityApiService.refreshList();
        this.update.emit(this.currentEntity);

      }
    );
  }

  onUploadAttachments(items: ContactAttachment[]) {
    if (items) {
      this.currentEntity.attachments = items;
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
