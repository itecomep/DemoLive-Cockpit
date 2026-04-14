// src/app/allowed-ip/allowed-ip.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AllowedIpComponent } from './allowed-ip.component';
import { AllowedIpDialogComponent } from './allowed-ip-dialog.component';
import { ALLOWED_IP_ROUTES } from './allowed-ip.routes';
import { HeaderComponent } from './../mcv-header/components/header/header.component';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BypassAllowedUserComponent } from './bypass-allowed-user/bypass-allowed-user.component';
import { AddBypassUserDialogComponent } from './bypass-allowed-user/add-bypass-user-dialog.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AllowedIpComponent,
    AllowedIpDialogComponent,
    BypassAllowedUserComponent,
    AddBypassUserDialogComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ALLOWED_IP_ROUTES),
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    HeaderComponent
  ]
})
export class AllowedIpModule {}
