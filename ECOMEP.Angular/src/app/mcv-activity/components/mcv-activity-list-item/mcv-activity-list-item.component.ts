import { Component, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { ActivityDto } from 'src/app/shared/models/activity-dto';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { NgClass, NgIf, NgFor, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McvLinkPipe } from 'src/app/shared/pipes/mcv-link.pipe';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'mcv-activity-list-item',
  templateUrl: './mcv-activity-list-item.component.html',
  styleUrls: ['./mcv-activity-list-item.component.scss'],
  standalone: true,
  imports: [MatTooltipModule, NgClass, NgIf, NgFor, McvFileComponent, DatePipe, McvLinkPipe, MatIconModule]
})
export class McvActivityListItemComponent {
    @Input() item: any;
  showPropertyChanges = false;

  constructor(
    private config: AppConfig,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
  }

  openPhotoDialog(member: any ) {
        this.dialog.open(ContactPhotoNameDialogComponent, {
          data: {
            photoUrl: member.contactPhotoUrl,
            fullName: member.contactName
          }
        });
  }

  togglePropertyChanges() {
    this.showPropertyChanges = !this.showPropertyChanges;
  }
}
