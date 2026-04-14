import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AllowedIpService, ContactUser } from '../../allowed-ip/services/allowed-ip.service';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <h2 mat-dialog-title>Add Bypass User</h2>

    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Select User</mat-label>
        <mat-select [formControl]="username">
          <mat-option *ngFor="let u of users" [value]="u.username">
            {{ u.username }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!username.value">
        Save
      </button>
    </mat-dialog-actions>
  `
})
export class AddBypassUserDialogComponent implements OnInit {

  users: ContactUser[] = [];
  username = new FormControl('');

  constructor(
    private service: AllowedIpService,
    private dialogRef: MatDialogRef<AddBypassUserDialogComponent>
  ) {}

  ngOnInit(): void {
    this.service.getContactUsers().subscribe(res => {
      this.users = res;
    });
  }

//   save(): void {
//     this.service.addBypassUserByUsername(this.username.value!)
//       .subscribe(() => this.dialogRef.close(true));
//   }
    save(): void {
    const user = {
        username: this.username.value!,
        isActive: true
    };

    this.service.addBypassUser(user).subscribe({
        next: () => {
        this.dialogRef.close(true);
        },
        error: (err) => {
        const message = err?.error?.message ?? 'Username already exists';
        }
    });
    }


  close(): void {
    this.dialogRef.close();
  }
}
