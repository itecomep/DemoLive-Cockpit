import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { firstValueFrom } from 'rxjs';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { OtpInputConfig } from '../../mcv-otp-input/models/otp-input-config.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { OtpInputComponent } from '../../mcv-otp-input/components/otp-input/otp-input.component';
import { IpService } from 'src/app/allowed-ip/services/ip.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,OtpInputComponent]
})
export class LoginComponent
{ 
  clientIp: string = '';
  form!: FormGroup;
  returnUrl: string = '';
  version: string = environment.appVersion;
  logoUrl: string = environment.logoUrl;
  logoUrl_two: string = environment.logoUrl_two;
  isLoggedIn: boolean = false;
  lattitude!: number;
  longitude!: number;
  coordinates!: any;
  geoLocation!:string;
  clientIpAddress: string = '';
  locationOn: boolean = false;
  locationOptions: any = {
    maximumAge : 10000 ,
    enableHighAccuracy: true,
    timeout: 15000
  }

  otpConfig: OtpInputConfig = {
    length: 6, allowNumbersOnly: true,
    inputClass: '',
    isPasswordInput: false,
    disableAutoFocus: false,
    letterCase: 'Upper'
  }
  otpFC = new FormControl('', [Validators.required, Validators.minLength(this.otpConfig.length)]);
  get isLocked() { return false; } //return environment.isLocked; }
  // convenience getter for easy access to form fields
  get f(): any { return this.form.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private config: AppConfig,
    private utilityService: UtilityService,
    private contactService: ContactApiService,
    private contactTeamService:ContactTeamApiService,
    private ipService: IpService
  ) { }

  ngOnInit()
  {
    if (localStorage.getItem('currentUser'))
    {
      console.log('Existing user session found. Clearing session and local storage for security.');
      localStorage.removeItem('currentUser');
    }

    this.buildForm();
    this.getGeolocation();
    this.ipService.getClientIp().subscribe({
      next: (ip) => {
        this.clientIp = ip;
        console.log('Client IP:', ip);
      },
      error: (err) => {
        console.error('Error fetching IP', err);
      }
    });
  }

  private buildForm()
  {
    this.form = this.formBuilder.group({
      username: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] })
    });
    // this.touchForm();
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

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

   onRetry()
  {
    this.isLoggedIn = false;
    this.authService.logout();
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
    var result = await firstValueFrom(this.authService.login(this.f['username'].value, this.f['password'].value,this.geoLocation ));

    if (result)
    {
      this.isLoggedIn = true;
      sessionStorage.setItem('userId', result.userId!);
      sessionStorage.setItem('sessionId', result.sessionID);
      if (result.isOTPRequired)
      {
        this.utilityService.showSwalToast("OTP sent to registered email!", "", "success");
      } else
      {

        this.redirectToCockpit();
      }

    }
  }

  async getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // console.log(position);
        this.geoLocation = JSON.stringify(position);
        this.lattitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.locationOn = true;
      }
        , () => {
          this.lattitude = 0;
          this.longitude = 0;
          this.utilityService.showSweetDialog("Location Not Found!", "Please enable your location to continue using the website.", "error");
        }
      );
    } else {
      this.utilityService.showSweetDialog("Location Not Found!", "Please enable your location to continue using the website.", "error");
    }
  }

  async onOtpChange(otp: string)
  {
    const result = await firstValueFrom(this.authService.verifyEmailOTP(otp));
    if (result.status == 'success')
    {
      this.utilityService.showSwalToast("OTP verification successful!", "", "success");
      await this.redirectToCockpit();
    } else
    {
      this.utilityService.showSweetDialog("OTP verification failed!", "Please enter a valid otp received on email.", "error");
    }
  }

  private async redirectToCockpit()
  {
    if (this.authService.currentUserStore)
    {
      this.authService.currentUserStore.roles = await firstValueFrom(this.authService.getRolesByUsername(this.f['username'].value));
      this.authService.currentUserStore.contact = (await firstValueFrom(this.contactService.get([{ key: 'Username', value: this.f['username'].value }])))[0];
      this.authService.currentUserStore.teams=await firstValueFrom(this.contactTeamService.get([{key:'contactID',value:this.authService.currentUserStore.contact.id.toString()}]));
      
      this.authService.setUserStore(this.authService.currentUserStore);

      if (this.authService.currentUserStore?.isChangePassword)
      {
        this.router.navigate([this.config.ROUTE_CHANGE_PASSWORD]);
      } else
      {
        const redirect = this.authService.redirectUrl
          && this.authService.redirectUrl != this.config.ROUTE_LOGIN ? this.authService.redirectUrl : '';
        this.router.navigate([redirect]);
      }
    } else
    {
      this.authService.logout();
    }
  }

  async verifyOTP()
  {
    if (this.otpFC.invalid)
    {
      // this.touchForm();
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please enter valid OTP and try again!',
        'warning');
      return;
    }
    // this.authService.verifyOTP(`91${this.mobileFC.value}`, this.otpFC.value)
    const otp = this.otpFC.value;
    if (otp)
    {
      console.log("calling OTP verification API");
      const result = await firstValueFrom(this.authService.verifyEmailOTP(otp));
      console.log(result);
      if (result.status === 'success')
      {
        this.utilityService.showSwalToast("OTP verification successful!", "", "success");
        if (this.authService.currentUserStore && this.authService.currentUserStore.isChangePassword)
        {
          this.router.navigate([this.config.ROUTE_CHANGE_PASSWORD]);
        } else
        {
          const redirect = this.authService.redirectUrl
            && this.authService.redirectUrl != this.config.ROUTE_LOGIN ? this.authService.redirectUrl : '';
          this.router.navigate([redirect]);
        }
      } else
      {
        this.utilityService.showSweetDialog("OTP verification failed!", "Please enter a valid otp received on email.", "error");
      }

    } else
    {
      this.utilityService.showSweetDialog("OTP verification failed!", "Please enter a valid otp received on email.", "error");
    }
  }

}
