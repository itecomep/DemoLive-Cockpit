import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from './components/otp-input/otp-input.component';
import { OtpInputKeysPipe } from './pipes/otp-input-keys.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OtpInputComponent,
        OtpInputKeysPipe
    ],
    exports: [OtpInputComponent],
    providers: [OtpInputKeysPipe]
})
export class McvOtpInputModule { }
