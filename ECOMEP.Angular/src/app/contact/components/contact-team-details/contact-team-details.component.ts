import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact, ContactAssociation, ContactAddress } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { McvActivityListComponent as McvActivityListComponent_1 } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { ContactTeamUpdateDialogComponent } from '../contact-team-update-dialog/contact-team-update-dialog.component';

@Component({
    selector: 'app-contact-team-details',
    templateUrl: './contact-team-details.component.html',
    styleUrls: ['./contact-team-details.component.scss'],
    standalone: true,
    imports: [MatExpansionModule, NgIf, NgFor, MatButtonModule, MatTooltipModule, MatIconModule, McvActivityListComponent_1, DatePipe]
})
export class ContactTeamDetailsComponent 
{

  config = inject(AppConfig);
  dialog = inject(MatDialog);
  clipboard = inject(Clipboard);
  utilityService = inject(UtilityService);
  entityApiService = inject(ContactApiService);
  @ViewChild(McvActivityListComponent) activity!: McvActivityListComponent;

  currentEntity!: Contact;
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isPermissionEdit(){return this.entityApiService.isPermissionTeamContactEdit}

  @Input('currentEntity') set currentEntityValue(value: Contact)
  {
    if (value)
    {
      this.currentEntity = value;
    }
  };

  get isCompany() { return this.currentEntity.isCompany; }
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

  constructor() { }

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
      (window as any).open(`https://${e}`, "_blank");
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

  onOpenContactDetails(contact: Contact)
  {

    const _dialogRef = this.entityApiService.openDialog(ContactDialogComponent, contact);
    _dialogRef.afterClosed().subscribe(res =>
    {
      if (res)
      {
        console.log(res);
      }
    });
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

    const _dialogRef = this.dialog.open(ContactTeamUpdateDialogComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.currentEntity = Object.assign(res);
      }
    });
  }
}
