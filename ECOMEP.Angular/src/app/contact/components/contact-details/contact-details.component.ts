import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ContactApiService } from '../../services/contact-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { Contact, ContactAddress, ContactAssociation } from '../../models/contact';
import { firstValueFrom } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { ContactListItemComponent } from '../contact-list-item/contact-list-item.component';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContactUpdateDialogComponent } from '../contact-update-dialog/contact-update-dialog.component';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  standalone: true,
  imports: [MatExpansionModule,
    NgIf, MatIconModule,
    MatTooltipModule, NgFor,
    MatButtonModule, McvActivityListComponent,
    MatChipsModule, DatePipe,
    ContactListItemComponent
  ]
})
export class ContactDetailsComponent
{
  @ViewChild(McvActivityListComponent) activity!: McvActivityListComponent;

  currentEntity: Contact = new Contact();
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionEdit; }
  get isPermissionDelete() { return this.entityApiService.isPermissionDelete; }
  get isPermissionList() { return this.entityApiService.isPermissionDelete; }
  get isActiveAppointment() { return this.currentEntity.appointments.filter(x => x.statusFlag == this.appConfig.TEAM_APPOINTMENT_STATUS_APPOINTED).length > 0; }

  @Input('currentEntity') set currentEntityValue(value: Contact)
  {
    if (value && value.id != 0)
    {
      this.currentEntity = value;
      // console.log('currentEntity', this.currentEntity);
      this.getContact(this.currentEntity.id);

    }
  };

  get isCompany() { return this.currentEntity?.isCompany; }
  get address()
  {
    const addressLines = [
      this.currentEntity?.addresses[0].street,
      this.currentEntity?.addresses[0].area,
      this.currentEntity?.addresses[0].city + ", " + this.currentEntity?.addresses[0].state,
      this.currentEntity?.addresses[0].country + " " + this.currentEntity?.addresses[0].pinCode
    ];

    return addressLines
      .filter(value => value !== null && value !== undefined)
      .join(',\n');

  }

  get isMobileView() { return this.utilityService.isMobileView; }

  get isEditMode() { return this.entityApiService.isEditMode; }

  @Output() editContactForm = new EventEmitter<boolean>();

  constructor(
    private appConfig: AppConfig,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private utilityService: UtilityService,
    private entityApiService: ContactApiService,
  ) { }

  async getContact(contactID: number)
  {
    this.currentEntity = await firstValueFrom(this.entityApiService.getById(contactID));
  }
  onEdit()
  {
    this.entityApiService.isEditMode = true;
  }

  onGetVCard()
  {
    this.entityApiService.getVCard(this.currentEntity.uid);
  }
  // selectedContactType = this.config.CONTACT_TYPE_FLAG_PERSON;
  selectedAssociates: ContactAssociation[] = [];
  onAddressClick(e?: string)
  {
    if (e)
      (window as any).open(`https://maps.google.com/?q=${e}`, "_blank");
  }

  onCopyToClipboard(e?: string)
  {
    if (e)
      this.clipboard.copy(e);
  }

  onOpenWebsite(e?: string)
  {
    if (e)
      (window as any).open(`${e}`, "_blank");
  }

  mailTo(e?: string)
  {
    if (e)
      (window as any).open(`mailto:${e}`, "_blank");
  }

  callTo(e?: string)
  {
    if (e)
      (window as any).open(`tel:${e}`, "_blank");
  }

  getAddressString(item: ContactAddress)
  {
    const addressLines = [
      item.street,
      item.area,
      item.city,
      item.state,
      item.country + " " + item.pinCode
    ];

    return addressLines
      .filter(value => value !== null && value !== undefined)
      .join(',\n');
  }

  onOpenContactDialog(contact: Contact)
  {this.entityApiService.openDialog(ContactDialogComponent, contact);
  }

   onEditContact(event: MouseEvent) {
      event.stopPropagation();
      const _dialogConfig = new MatDialogConfig();
      _dialogConfig.autoFocus = true;
      _dialogConfig.disableClose = true;
      _dialogConfig.data = {
        contact: this.currentEntity
      }
  
      if(this.isMobileView){
        _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
      }
  
      const _dialogRef = this.dialog.open(ContactUpdateDialogComponent, _dialogConfig);
      _dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.currentEntity = Object.assign(res);
        }
      });
    }
}
