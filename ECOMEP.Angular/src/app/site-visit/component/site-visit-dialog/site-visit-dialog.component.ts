import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { SiteVisitComponent } from '../site-visit/site-visit.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-site-visit-dialog',
    templateUrl: './site-visit-dialog.component.html',
    styleUrls: ['./site-visit-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, SiteVisitComponent]
})
export class SitevisitDialogComponent 
{
  data: any;
  constructor(
    private dialog: MatDialogRef<SitevisitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  )
  {
    this.data = data;
  }

  onClose(e: any)
  {
    this.dialog.close(e);
  }
}
