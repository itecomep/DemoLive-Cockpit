import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from '../../services/auth.service';
import { ResetPasswordDto } from '../../models/reset-password-dto';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-reset-password-dialog',
    templateUrl: './reset-password-dialog.component.html',
    styleUrls: ['./reset-password-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatTooltipModule]
})
export class ResetPasswordDialogComponent
{
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    public utilityService: UtilityService,
    private accountsService: AuthService,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  ngOnInit()
  {
    this.buildForm();
  }

  private buildForm()
  {
    this.form = this.formBuilder.group({
      password: new FormControl<any>(null, { nonNullable: true, validators: [Validators.minLength(6)] }),
      confirmPassword: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      chkPasswordChange: new FormControl<boolean>(true, { nonNullable: true, validators: [Validators.required] })
    });

    this.f.chkPasswordChange.setValue(true);
  }

  get f(): any
  {
    return this.form.controls;
  }

  /************* Initialization End **************************/

  /************* Button click listeners ***********************/
  onSaveButtonClicked()
  {
    this.submit();
  }

  onCancelButtonClicked()
  {
    this.dialogRef.close(false);
  }

  /************* Button click listeners end ***********************/

  /******* Reset Password  *********************************/
  public submit()
  {
    if (this.form.invalid)
    {
      Object.keys(this.f).forEach(field =>
      {
        const control = this.form.get(field);
        if (control != null)
        {
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else
    {
      let obj = new ResetPasswordDto();
      obj.username = this.dialogData.username;
      obj.password = this.f['password'].value;
      obj.confirmPassword = this.f['confirmPassword'].value;
      obj.isChangePassword = this.f['chkPasswordChange'].value;
      // console.log('reset',obj);
      this.accountsService.resetPassword(obj).subscribe(
        res =>
        {
          this.dialogRef.close(res);
          this.utilityService.showSwalToast('Success', "Password reset successfully.");
        }
      );
    }
  }
}
