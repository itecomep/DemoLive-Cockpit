import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, EventEmitter, inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { take, Observable, debounceTime, distinctUntilChanged, firstValueFrom, map } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact, ContactPhone, ContactEmail, ContactAddress } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContactEmailFormComponent } from '../contact-email-form/contact-email-form.component';
import { ContactPhoneFormComponent } from '../contact-phone-form/contact-phone-form.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContactAddressFormComponent } from '../contact-address-form/contact-address-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { ContactMergeComponent } from '../contact-merge/contact-merge.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { CityOption, CountryCode, StateCode } from 'src/app/shared/models/locations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-contact-team-update',
  templateUrl: './contact-team-update.component.html',
  styleUrls: ['./contact-team-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    TextFieldModule,
    MatCheckboxModule,
    MatAutocompleteModule,

    //Components
    McvFileUploadComponent,
    ContactAddressFormComponent,
    ContactPhoneFormComponent,
    ContactEmailFormComponent,
  ]
})
export class ContactTeamUpdateComponent implements OnInit {
  //--------FORM RELATED----------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);

  form!: FormGroup
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  private readonly ngZone = inject(NgZone);
  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;
  private triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1)).subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }
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
  //-----------------------------------//

  currentEntity: Contact = new Contact();
  // selectedAssociates: ContactAssociation[] = [];

  cityOptions: CityOption[] = [];
  filteredCityOptions$: Observable<any[]>[] = [];

  stateCodeOptions: StateCode[] = [];
  filteredStateOptions$: Observable<any[]>[] = [];

  countryCodeOptions: CountryCode[] = [];
  filteredCountryOptions$: Observable<any[]>[] = [];


  get dialogTitle() { return `New ${this.nameOfEntity}`; }
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionEdit; }
  get isPermissionDelete() { return this.entityApiService.isPermissionDelete; }
  get isPermissionList() { return this.entityApiService.isPermissionDelete; }

  get isCompany() { return this.currentEntity.isCompany; }

  alertMessage: string = "";
  isShowAlert: boolean = false;
  phoneTitleOptions = ["Work", "Personal", "Other"];
  emailTitleOptions = ["Work", "Personal", "Other"];
  addressTitleOptions = ["Current", "Home", "Other"];
  genderOptions = ["Male", "Female", "Other"];

  filteredManagerContacts$!: Observable<Contact[]>;
  @Input('currentEntity') set currentEntityValue(value: Contact) {
    if (value) {
      if (!this.form) {
        this.buildForm();
      }
      this.currentEntity = value;
    }
  }

  @Output() updated = new EventEmitter<Contact>();
  @Output() deleted = new EventEmitter<Contact>();
  @Output() formChange = new EventEmitter<any>();

  constructor(
    private entityApiService: ContactApiService,
    private router: Router,
    private config: AppConfig,
    private McvFileUtilityservice: McvFileUtilityService,
    private appSettingService: AppSettingMasterApiService
  ) {
  }


  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }

    this.getContactOptions();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    if (this.appSettingService.presets) {
      const _presetValue = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
      if (_presetValue) {
        this.blobConfig = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.nameOfEntity}`
        );
      }
    }

    this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());
    
    this.bindForm();
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      isCompany: new FormControl<any>(false),
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      firstName: new FormControl<any>(null, { validators: [Validators.required] }),
      middleName: new FormControl<any>(null, { validators: [Validators.required] }),
      lastName: new FormControl<any>(null, { validators: [Validators.required] }),
      gender: new FormControl<any>(this.genderOptions[0], { validators: [Validators.required] }),
      maritalStatus: new FormControl<any>(null),
      birth: new FormControl<any>(null),
      anniversary: new FormControl<any>(null),
      pan: new FormControl<any>(null),
      tan: new FormControl<any>(null),
      gstin: new FormControl<any>(null),
      hsn: new FormControl<any>(null),
      arn: new FormControl<any>(null),
      aadhaar: new FormControl<any>(null),
      udhyam: new FormControl<any>(null),
      description: new FormControl<any>(null),
      bankName: new FormControl<any>(null),
      bankAccountNo: new FormControl<any>(null),
      ifscCode: new FormControl<any>(null),
      // drivingLicenseNo: new FormControl<any>(null),
      familyContactName: new FormControl<any>(null),
      familyContactPhone: new FormControl<any>(null),
      familyContactRelation: new FormControl<any>(null),
      emergencyContactPhone: new FormControl<any>(null),
      emergencyContactName: new FormControl<any>(null),
      emergencyContactRelation: new FormControl<any>(null),

      phones: new FormArray([]),
      emails: new FormArray([]),
      addresses: new FormArray([]),
    });

    // this.onAddAddress();
    // this.onAddEmail();
    // this.onAddPhone();

    this.f['isCompany'].valueChanges.subscribe((value: boolean) => {
      this.currentEntity.isCompany = value;
    });


    this.f['firstName'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe(
      async (value: string) => {
        this.isShowAlert = false;
        if (value && value.length > 3) {
          const existingContacts = await firstValueFrom(this.entityApiService.get([], value));
          if (existingContacts.filter(x => x.uid != this.currentEntity.uid).length > 0) {
            this.alertMessage = `${existingContacts.filter(x => x.uid != this.currentEntity.uid).length} contact(s) already exists with same name.`;
            this.isShowAlert = true;
            // this.utilityService.showSweetDialog('Duplicate Name', this.firstNameHint, 'warning');
          }
        }
      }
    );
    this.touchForm();

    this.form.valueChanges.pipe(
      debounceTime(1200),
      distinctUntilChanged(),
    ).subscribe((value: string) => {
      this.formChange.emit(this.form);
    });
  }

  //Phone add/remove code below
  // Getter for phones FormArray
  phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  onAddPhone() {
    this.addPhone(new ContactPhone({ isPrimary: this.phones().length == 0, title: this.phoneTitleOptions[0] }));
  }

  // Add phone to FormArray
  addPhone(value: ContactPhone) {
    this.phones().push(this.formBuilder.group({
      isPrimary: new FormControl<boolean>(value.isPrimary, { validators: [Validators.required] }),
      title: new FormControl<any>(value.title),
      phone: new FormControl<any>(
        value.phone ? value.phone.replace(/\s+/g, '') : '', // Remove all spaces
        { validators: [
            Validators.required, 
            Validators.pattern(/^\d+$/) // Number only validation
        ]}
      ),
    }));
  }

  // Remove phone from FormArray
  onRemovePhone(index: number) {
    this.phones().removeAt(index);
  }
  //Phone add/remove code ends.


  //Email add/remove code below.
  // Getter for emails FormArray
  emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  onAddEmail() {
    this.addEmail(new ContactEmail({ isPrimary: this.emails().length == 0, title: this.emailTitleOptions[0] }));
  }
  // Add email to FormArray
  addEmail(value: ContactEmail) {
    this.emails().push(this.formBuilder.group({
      isPrimary: new FormControl<boolean>(value.isPrimary, { validators: [Validators.required] }),
      title: new FormControl<any>(value.title),
      email: new FormControl<any>(value.email, { validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]  }),
    }));
  }

  // Remove email from FormArray
  onRemoveEmail(index: number) {
    this.emails().removeAt(index);
  }
  //Email add/remove code ends


  //Address add/remove code below.
  // Getter for addresses FormArray
  addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  onAddAddress() {
    this.addAddress(new ContactAddress({ isPrimary: this.addresses().length == 0, title: this.addressTitleOptions[0] }));
  }
  // Add address to FormArray
  addAddress(value: ContactAddress) {
    this.addresses().push(this.formBuilder.group({
      isPrimary: new FormControl<boolean>(value.isPrimary, { validators: [Validators.required] }),
      title: new FormControl<any>(value.title),
      street: new FormControl<any>(value.street, { validators: [Validators.required] }),
      area: new FormControl<any>(value.area),
      city: new FormControl<any>(value.city),
      state: new FormControl<any>(value.state),
      pinCode: new FormControl<any>(value.pinCode),
      country: new FormControl<any>(value.country),
    }));
    this.manageAddress(this.addresses().length - 1);
  }

  manageAddress(index: number) {
    var arrayControl = this.form.get('addresses') as FormArray;
    const _cityControl = arrayControl.at(index).get('city');
    if (_cityControl) {
      this.filteredCityOptions$[index] = _cityControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(value => typeof value === "string" ? value : value.city),
        map((value: string) => value ? this.filterCity(value) : this.filterCity())
      );
    }

    const _stateControl = arrayControl.at(index).get('state');
    if (_stateControl) {
      this.filteredStateOptions$[index] = _stateControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(value => typeof value === "string" ? value : value.state),
        map((value: string) => value ? this.filterState(value) : this.filterState())
      );
    }

    const _countryControl = arrayControl.at(index).get('country');
    if (_countryControl) {
      this.filteredCountryOptions$[index] = _countryControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(value => typeof value === "string" ? value : value.country),
        map((value: string) => value ? this.filterCountry(value) : this.filterCountry())
      );
    }
  }

  displayFnCity(option?: string): string {
    return option ? option : '';
  }

  displayFnState(option?: string): string {
    return option ? option : '';
  }

  displayFnCountry(option?: string): string {
    return option ? option : '';
  }

  private filterCity(value?: string)
  {
    if (!value)
    {
      return this.cityOptions.map(x => x.city);
    }
    return this.cityOptions.map(x => x.city).filter(x => x.toLowerCase().includes(value.toLowerCase()));
  }

  private filterState(value?: string)
  {
    const uniqueStringArray = [...new Set(this.cityOptions.map(x => x.state))];
    if (!value)
    {
      return uniqueStringArray;
    }
    return uniqueStringArray.filter(x => x.toLowerCase().includes(value.toLowerCase()));
  }

  private filterCountry(value?: string)
  {

    if (!value)
    {
      return this.countryCodeOptions.map(x => x.country);
    }
    return this.countryCodeOptions.map(x => x.country).filter(x => x.toLowerCase().includes(value.toLowerCase()));
  }


  // Remove address from FormArray
  onRemoveAddress(index: number) {
    this.addresses().removeAt(index);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.fullName : '';
  }

  contactOptions: Contact[] = [];
  private async getContactOptions() {
    this.contactOptions = await firstValueFrom(this.entityApiService.getOptions([{ key: 'IsAppointed', value: 'true' }, { key: 'usersonly', value: 'true' }]));
  }

  private bindForm() {
    this.form.patchValue(this.currentEntity);

    // Populate phones
    this.currentEntity.phones.forEach((phone: ContactPhone) => {
      this.addPhone(phone);
    });

    // Populate emails
    this.currentEntity.emails.forEach((email: ContactEmail) => {
      this.addEmail(email);
    });

    // Populate addresses
    this.currentEntity.addresses.forEach((address: ContactAddress) => {
      this.addAddress(address);
    });

    this.formChange.emit(this.form);
  }

  onCancelEdit() {
    this.entityApiService.isEditMode = false;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    if (!this.currentEntity) {
      this.currentEntity = new Contact();
    }

    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    this.currentEntity.title = this.currentEntity.isCompany ? undefined : this.currentEntity.title;
    const _messageText = `Update | ${(this.currentEntity.isCompany ? 'Company' : 'Person')} | ${this.nameOfEntity}: ${this.currentEntity.fullName}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));

        this.utilityService.showSwalToast('Success!', 'Save successful.');

        this.entityApiService.refreshList();
        this.updated.emit(this.currentEntity);

      }
    );
  }

  onDelete() {
    const _messageText = `Delete ${this.nameOfEntity}: ${this.currentEntity.name}`;

    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        await firstValueFrom(this.entityApiService.delete(this.currentEntity.id))
        this.utilityService.showSwalToast(
          'Success!',
          'Delete successful.',
        );
        this.deleted.emit(this.currentEntity);
        this.entityApiService.refreshList();
        this.router.navigate([this.config.ROUTE_CONTACT_LIST]);
      }
    );
  }

  blobConfig!: McvFileUploadConfig;
  async onUpload(uploads: UploadResult[]) {
    this.currentEntity.photoUrl = uploads[0].url;
    const dialogRef = this.McvFileUtilityservice.openImageEditorDialog(uploads[0].blobPath, uploads[0].url);
    dialogRef.afterClosed().subscribe(async (res: any) => {
      if (res) {
        this.currentEntity.photoUrl = res;
      }
    });
  }

  async onRemovePhoto() {
    if (this.currentEntity) {
      this.currentEntity.photoUrl = '';
    }
  }

  existingContacts: Contact[] = [];
  private async getExisting(isCompany: boolean, firstName: string, lastName?: string) {
    let filters: ApiFilter[] = [
      { key: 'isCompany', value: isCompany.toString() },
      { key: 'firstName', value: firstName }
    ];
    if (lastName) {
      filters.push({ key: 'lastName', value: lastName });
    }
    const data = await firstValueFrom(this.entityApiService.getOptions(filters));
    this.existingContacts = data.filter(x => x.id != this.currentEntity.id);
    this.isShowAlert = false;
    if (this.existingContacts.length > 0) {
      this.isShowAlert = true;
    }

  }
  onOpenMerge() {
    const _dialogRef = this.entityApiService.openDialog(ContactMergeComponent, { contactList: this.existingContacts });
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.updated.emit(this.currentEntity);
      }
    });
  }

  onSelectCity(event: any, index: number) {
    var arrayControl = this.form.get('addresses') as FormArray;
    const _obj = this.cityOptions.find(x => x.city.toLowerCase() == event.option.value.toLowerCase());
    if (_obj) {
      arrayControl.at(index).get('city')?.setValue(_obj.city, { emitEvent: false });
      arrayControl.at(index).get('state')?.setValue(_obj.state, { emitEvent: false });
      arrayControl.at(index).get('country')?.setValue(_obj.country, { emitEvent: false });
    }
  }

  onSelectState(event: any, index: number) {
    var arrayControl = this.form.get('addresses') as FormArray;
    const _obj = this.cityOptions.find(x => x.state.toLowerCase() == event.option.value.toLowerCase());
    if (_obj) {
      arrayControl.at(index).get('state')?.setValue(_obj.state, { emitEvent: false });
    }
  }

  onSelectCountry(event: any, index: number) {
    var arrayControl = this.form.get('addresses') as FormArray;
    const _obj = this.cityOptions.find(x => x.country.toLowerCase() == event.option.value.toLowerCase());
    if (_obj) {
      arrayControl.at(index).get('country')?.setValue(_obj.country, { emitEvent: false });
    }
  }

  onPhonePrimaryChange(selectedIndex: number) {
    this.phones().controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('isPrimary')?.setValue(false, { emitEvent: false });
      }
    });
  }

  onEmailPrimaryChange(selectedIndex: number) {
    this.emails().controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('isPrimary')?.setValue(false, { emitEvent: false });
      }
    });
  }

  onAddressPrimaryChange(selectedIndex: number) {
    this.addresses().controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('isPrimary')?.setValue(false, { emitEvent: false });
      }
    });
  }
}

