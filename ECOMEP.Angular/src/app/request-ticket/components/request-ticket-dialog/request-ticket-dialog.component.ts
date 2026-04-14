import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RequestTicketComponent } from '../request-ticket/request-ticket.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-request-ticket-dialog',
    templateUrl: './request-ticket-dialog.component.html',
    styleUrls: ['./request-ticket-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, RequestTicketComponent]
})
export class RequestTicketDialogComponent 
{
  data: any;
  constructor(
    private dialog: MatDialogRef<RequestTicketDialogComponent>,
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

