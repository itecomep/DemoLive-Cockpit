import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from '../../services/auth.service';
import { RegisterUserDto } from '../../models/register-user-dto';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { firstValueFrom } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-register-dialog',
    templateUrl: './register-dialog.component.html',
    styleUrls: ['./register-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatTooltipModule]
})
export class RegisterDialogComponent
{
  form!: FormGroup;
  contactID: number;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RegisterDialogComponent>,
    public utilityService: UtilityService,
    private accountsService: AuthService,
    private contactService: ContactApiService,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  )
  {
    this.contactID = dialogData.contactID;
  }

  ngOnInit()
  {
    this.buildForm();
  }

  private buildForm()
  {
    this.form = this.formBuilder.group({
      username: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl<any>(null, { nonNullable: true, validators: [Validators.minLength(6)] }),
      confirmPassword: new FormControl<any>(null, { nonNullable: true, validators: [Validators.minLength(6)] }),
      chkPasswordChange: new FormControl<boolean>(true)
    });

    this.f.chkPasswordChange.setValue(true);
  }

  get f(): any
  {
    return this.form.controls;
  }

  onSaveButtonClicked()
  {
    this.registerEmployee();
  }

  onCancelButtonClicked()
  {
    this.dialogRef.close(false);
  }

  public async registerEmployee()
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
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }

    let user = new RegisterUserDto();
    user.contactID = this.contactID;
    user.username = this.f['username'].value;
    user.password = this.f['password'].value;
    user.confirmPassword = this.f['confirmPassword'].value;
    user.isChangePassword = this.f['chkPasswordChange'].value;

    await firstValueFrom(this.accountsService.register(user));
    this.dialogRef.close(user.username);
    this.utilityService.showSwalToast('Success', "Registered successfully.");

  }
}
