import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, map } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactAddress, Contact } from '../../models/contact';
import { StateCode } from 'src/app/shared/models/locations';
import { CityOption, CountryCode } from 'src/app/shared/models/locations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-contact-address-form',
  templateUrl: './contact-address-form.component.html',
  styleUrls: ['./contact-address-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule,NgIf, NgFor, MatOptionModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatInputModule, MatAutocompleteModule, AsyncPipe]
})
export class ContactAddressFormComponent implements OnInit {
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);

  form!: FormGroup;
  contact!: Contact;

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  private touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }
  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  currentEntity: ContactAddress = new ContactAddress();
  @Input() titleOptions: string[] = ["Home", "Work"];
  autoUpdate: boolean = false;
  isCreateMode: boolean = false;
  cityOptions: CityOption[] = [];
  filteredCityOptions$!: Observable<string[]>;

  stateCodeOptions: StateCode[] = [];
  filteredStateOptions$!: Observable<string[]>;

  countryCodeOptions: CountryCode[] = [];
  filteredCountryOptions$!: Observable<string[]>;

  @Input('config') set configValue(value: { isCreateMode: boolean, autoUpdate: boolean, address?: ContactAddress, contact?: Contact }) {
    if (value) {
      this.isCreateMode = value.isCreateMode;
      this.autoUpdate = value.autoUpdate;
      this.currentEntity = value.address ? value.address : new ContactAddress();
      if (value.contact) {
        this.contact = value.contact;
        this.currentEntity.contactID = value.contact.id;
      }
      this.buildForm();
    }
  }

  @Output() created = new EventEmitter<ContactAddress>();
  @Output() updated = new EventEmitter<ContactAddress>();
  @Output() deleted = new EventEmitter<ContactAddress>();

  async ngOnInit() {
    this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());
    if (!this.form) {
      this.buildForm();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      street: new FormControl<any>(this.currentEntity.street, { validators: [Validators.required] }),
      area: new FormControl<any>(this.currentEntity.area),
      city: new FormControl<any>(this.currentEntity.city),
      state: new FormControl<any>(this.currentEntity.state),
      country: new FormControl<any>(this.currentEntity.country),
      pinCode: new FormControl<any>(this.currentEntity.pinCode),
      title: new FormControl<any>(this.currentEntity.title || this.titleOptions[0], { validators: [Validators.required] }),
      isPrimary: new FormControl<any>(this.currentEntity.isPrimary, { validators: [Validators.required] }),
    });

    this.filteredCityOptions$ = this.f['city'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => typeof value === "string" ? value : (value as CityOption)?.city),
      map((value: string) =>
        value ? this.filterCity(value) : this.filterCity()
      )
    );

    this.f['city'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((value: string) => {
      if (value) {
        const option = this.cityOptions.find(x => x.city === value);
        this.f['state'].setValue(option?.state, { emitEvent: false });
        this.f['country'].setValue(option?.country, { emitEvent: false });
      }
    });

    this.filteredStateOptions$ = this.f['state'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => typeof value === "string" ? value : (value as CityOption)?.state),
      map((value: string) =>
        value ? this.filterState(value) : this.filterState()
      )
    );

    this.f['state'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((value: string) => {
      if (value) {
        const option = this.cityOptions.find(x => x.state === value);
        this.f['country'].setValue(option?.country, { emitEvent: false });
      }
    });

    this.filteredCountryOptions$ = this.f['country'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => typeof value === "string" ? value : (value as CountryCode)?.country),
      map((value: string) =>
        value ? this.filterCountry(value) : this.filterCountry()
      )
    );

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        if (value) {
          this.onSubmit();
        }
      });
  }

  private filterCity(value?: string) {
    if (!value) {
      return this.cityOptions.map(x => x.city);
    }
    return this.cityOptions.map(x => x.city).filter(x => x.toLowerCase().includes(value.toLowerCase()));
  }

  private filterState(value?: string) {
    const uniqueStringArray = [...new Set(this.cityOptions.map(x => x.state))];
    if (!value) {
      return uniqueStringArray;
    }
    return uniqueStringArray.filter(x => x.toLowerCase().includes(value.toLowerCase()));
  }

  private filterCountry(value?: string) {

    if (!value) {
      return this.countryCodeOptions.map(x => x.country);
    }
    return this.countryCodeOptions.map(x => x.country).filter(x => x.toLowerCase().includes(value.toLowerCase()));
  }

  validationMessages?:string;
  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      // this.utilityService.showSweetDialog('Invalid Form',
      //   'Please fill all required fields with valid data and try again.', 'error'
      // );
      this.validationMessages = 'Please fill all required fields with valid data and try again.'
      return;
    }
    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    if (this.isCreateMode) {
      this.currentEntity.contactID = this.contact.id;
     this.created.emit(this.currentEntity);
    }
    else {
      this.updated.emit(this.currentEntity);
    }
  }

  async onDelete() {

    this.deleted.emit(this.currentEntity);
  }
}


