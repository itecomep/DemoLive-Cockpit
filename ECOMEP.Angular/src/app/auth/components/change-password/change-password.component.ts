import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AppConfig } from 'src/app/app.config';
import { AuthService } from '../../services/auth.service';


import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, MatButtonModule]
})
export class ChangePasswordComponent
{
  form!: FormGroup;
  returnUrl: string = '';
  logoUrl: string = environment.logoUrl;
  // convenience getter for easy access to form fields
  get f(): any { return this.form.controls; }
  version: string = environment.appVersion;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private config: AppConfig,
    private utilityService: UtilityService,

  ) { }

  ngOnInit()
  {
    this.buildForm();
    // this.presetMasterService.getValue(this.config.PRESET_COMPANY_LOGO_URL).subscribe((value) => {
    //   this.logoUrl = value;
    // });
  }

  private buildForm()
  {
    this.form = this.formBuilder.group({
      password: new FormControl<any>("", { nonNullable: true, validators: [Validators.required] }),
      passwordNew: new FormControl<any>("", { nonNullable: true, validators: [Validators.required] }),
      passwordConfirm: new FormControl<any>("", { nonNullable: true, validators: [Validators.required] }),
    })
    this.touchForm();
  }

  private touchForm()
  {
    Object.keys(this.form.controls).forEach(field =>
    {
      // {1}
      const control = this.form.get(field); // {2}
      if (control != null)
      {
        control.markAsTouched({ onlySelf: true }); // {3}
      }
    });
  }

  getErrorMessage(control: any)
  {
    return this.utilityService.getErrorMessage(control);
  }
  async onSubmit()
  {
    if (this.form.invalid)
    {
      this.touchForm();
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }
    await firstValueFrom(this.authService.changePassword({
      username: this.authService.currentUserStore?.username ? this.authService.currentUserStore?.username : '',
      oldPassword: this.f['password'].value,
      newPassword: this.f['passwordNew'].value,
      confirmPassword: this.f['passwordConfirm'].value
    }));

    this.utilityService.showSwalToast("Success", "Password changed successfully!", "success");
    // tslint:disable-next-line: prefer-const
    let user = this.authService.currentUserStore;
    if (user != null)
    {
      user.isChangePassword = false;
      this.authService.setUserStore(user);
      this.router.navigate([this.authService.redirectUrl ? this.authService.redirectUrl : '']);
    }
  }

  onCancel()
  {
    this.router.navigate([this.authService.redirectUrl ? this.authService.redirectUrl : '']);

  }

  isChangePassword()
  {
    if (this.authService.currentUserStore != null)
    {
      return this.authService.currentUserStore.isChangePassword;
    }
    return false;
  }
}
