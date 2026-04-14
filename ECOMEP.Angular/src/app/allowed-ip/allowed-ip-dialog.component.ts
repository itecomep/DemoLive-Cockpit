import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-allowed-ip-dialog',
  template: `
    <h2 mat-dialog-title>Add New IP</h2>
    <form [formGroup]="ipForm" (ngSubmit)="submit()">
      <mat-dialog-content style="padding:10px !important">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>IP Address</mat-label>
          <input matInput formControlName="ipAddress" placeholder="Enter IP">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="ipForm.invalid">Add</button>
      </mat-dialog-actions>
    </form>
  `
})
export class AllowedIpDialogComponent {
  ipForm = new FormGroup({
    ipAddress: new FormControl('', Validators.required),
    description: new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<AllowedIpDialogComponent>) {}

  submit() {
    if (this.ipForm.valid) {
      this.dialogRef.close(this.ipForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
