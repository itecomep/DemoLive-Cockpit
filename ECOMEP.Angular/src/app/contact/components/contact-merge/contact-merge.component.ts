import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactApiService } from '../../services/contact-api.service';
import { FormBuilder } from '@angular/forms';
import { Contact } from '../../models/contact';
import { firstValueFrom } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-contact-merge',
  templateUrl: './contact-merge.component.html',
  styleUrls: ['./contact-merge.component.scss'],
  standalone: true,
  imports: [MatButtonModule, NgTemplateOutlet, MatIconModule, MatDialogModule, NgFor, NgIf, MatCheckboxModule, MatTooltipModule]
})
export class ContactMergeComponent
{
  private readonly utilityService = inject(UtilityService);
  private readonly contactApiService = inject(ContactApiService);
  dialogTitle: string = "Contact Merge";
  contactList: Contact[] = [];
  constructor(
    private router: Router,
    private config: AppConfig,
    private dialog: MatDialogRef<ContactMergeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  )
  {
    console.log(data);
    this.contactList = data.contactList;
  }

  onClose(e: any)
  {
    this.dialog.close(e);
  }

  selected: Contact[] = [];
  getIsMerged(item: Contact) { return this.selected.find(x => x.id == item.id) ? true : false; }
  async onSelect(item: Contact)
  {
    if (this.selected.find(x => x.id == item.id))
    {
      this.selected = this.selected.filter(x => x.id != item.id);
    } else
    {
      this.selected.push(item);
    }
  }
  onSubmit()
  {


    let oldestEntity = this.selected.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())[0];
    const _messageText = `This action will merge with oldest record selected and delete all other duplicates. You want to Merge Contact: ${oldestEntity.name}.`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () =>
      {
        oldestEntity = await firstValueFrom(this.contactApiService.merge(this.selected.map(x => x.id)));
        this.contactApiService.navigateToDetails(oldestEntity.id);
        this.onClose(oldestEntity);
        this.router.navigate([this.config.ROUTE_CONTACT_LIST]);
      });

  }

  openContactDetails(contact: Contact)
  {
    this.contactApiService.openDialog(ContactDialogComponent, contact);
  }
}
