import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { McvFileUploadComponent } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contact-work-order-payment-update-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    McvFileUploadComponent,
    CommonModule,
    McvFileComponent,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './contact-work-order-payment-update-dialog.component.html',
  styleUrls: ['./contact-work-order-payment-update-dialog.component.scss']
})
export class ContactWorkOrderPaymentUpdateDialogComponent {

}
