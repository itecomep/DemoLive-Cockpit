import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, ObservableInput, forkJoin, map, of, switchMap, startWith } from 'rxjs';

import { ContactApiService } from '../../services/contact-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { AppConfig } from 'src/app/app.config';
import { ContactCreateComponent } from '../contact-create/contact-create.component';
import { Contact, ContactPhone, ContactEmail, ContactAddress } from '../../models/contact';
import { ContactAppointmentApiService } from '../../services/contact-appointment-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { Company } from 'src/app/shared/models/company.model';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { ContactAppointment, ContactAppointmentAttachment } from '../../models/contact-appointment.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { ContactAppointmentAttachmentApiService } from '../../services/contact-appointment-attachment-api.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ContactEmailFormComponent } from '../contact-email-form/contact-email-form.component';
import { ContactPhoneFormComponent } from '../contact-phone-form/contact-phone-form.component';
import { McvTagEditorComponent } from '../../../mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { ContactAddressFormComponent } from '../contact-address-form/contact-address-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet, CommonModule, AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContactMergeComponent } from '../contact-merge/contact-merge.component';
import { CityOption, CountryCode, StateCode } from 'src/app/shared/models/locations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-contact-team-create',
  templateUrl: './contact-team-create.component.html',
  styleUrls: ['./contact-team-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    NgTemplateOutlet,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    TextFieldModule,
    AsyncPipe,
    MatCheckboxModule,
    NgxMatSelectSearchModule,

    //Components
    ContactAddressFormComponent,
    McvFileUploadComponent,
    McvFileComponent,
    McvTagEditorComponent,
    ContactPhoneFormComponent,
    ContactEmailFormComponent,
  ]
})
export class ContactTeamCreateComponent implements OnInit {
  // FORM --------------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);

  form!: FormGroup;
  photoUrl!:string;
  appointmentForm!: FormGroup;
  contactOptions: Contact[] = [];
  get f(): any { return this.form.controls; }
  get af(): any { return this.appointmentForm.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }



  private touchForm() {
      /**
   * Marks all form controls in the `form` and `appointmentForm` as touched.
   * 
   * This method ensures that all controls, including nested controls within 
   * `FormArray` and `FormGroup`, are marked as touched. This is useful for 
   * triggering validation messages for untouched fields.
   * 
   * - For `form`, it iterates through all controls, and if a control is a 
   *   `FormArray`, it further iterates through its child controls to mark 
   *   them as touched.
   * - For `appointmentForm`, it directly marks all controls as touched.
   * 
   */
    if (this.form) {
      
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
          if (control instanceof FormArray) {
            control.controls.forEach(arrayControl => {
              Object.keys((arrayControl as FormGroup).controls).forEach(subField => {
                const subControl = (arrayControl as FormGroup).get(subField);
                if (subControl) {
                  subControl.markAsTouched({ onlySelf: true });
                }
              });
            });
          }
        }
      });
    }
    if (this.appointmentForm) {
      Object.keys(this.appointmentForm.controls).forEach(field => {
        const control = this.appointmentForm.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  currentEntity: Contact = new Contact();
  existingContacts: Contact[] = [];
  get dialogTitle() { return `New Team Member`; }
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionEdit; }
  get isPermissionDelete() { return this.entityApiService.isPermissionDelete; }
  get isPermissionList() { return this.entityApiService.isPermissionDelete; }

  get isCompany() { return this.currentEntity.isCompany; }

  alertMessage: string = "";
  isShowAlert: boolean = false;
  clientContactFC: FormControl = new FormControl<any>('');

  phoneTitleOptions = ["Work", "Personal", "Other"];
  emailTitleOptions = ["Work", "Personal", "Other"];
  addressTitleOptions = ["Current", "Home", "Other"];
  genderOptions = ["Male", "Female", "Other"];
  filteredManagerContacts$!: Observable<Contact[]>;

  cityOptions: CityOption[] = [];
  filteredCityOptions$: Observable<any[]>[] = [];

  stateCodeOptions: StateCode[] = [];
  filteredStateOptions$: Observable<any[]>[] = [];

  countryCodeOptions: CountryCode[] = [];
  filteredCountryOptions$: Observable<any[]>[] = [];

  constructor(
    private config: AppConfig,
    private entityApiService: ContactApiService,
    private dialog: MatDialogRef<ContactCreateComponent>,
    private appSettingService: AppSettingMasterApiService,
    private contactAppointmentService: ContactAppointmentApiService,
    private typeMasterService: TypeMasterService,
    private companyService: CompanyApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private contactAppointmentAttachmentService: ContactAppointmentAttachmentApiService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
  }

  onClose(e: any) {
    this.dialog.close(e);
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    this.getFilteredContacts();
    this.onAddAddress();
    this.onAddEmail();
    this.onAddPhone();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    if (this.appSettingService.presets) {
      const _presetValue = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
      if (_presetValue) {
        this.blobConfigPhoto = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.nameOfEntity}`
        );

        this.blobConfigAppointment = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT}`
        );
      }
    }

    this.getAppointmentTypeOptions();
    this.getCompanyOptions();
    this.getSearchAttachmentTagOptions();
    this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());
  }

  filteredContacts$!: Observable<Contact[]>;
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
      familyContactPhone: new FormControl<any>(null,[Validators.pattern(/^\d+$/)]),
      familyContactRelation: new FormControl<any>(null),
      emergencyContactPhone: new FormControl<any>(null,[Validators.pattern(/^\d+$/)]),
      emergencyContactName: new FormControl<any>(null),
      emergencyContactRelation: new FormControl<any>(null),

      phones: this.formBuilder.array([]),
      emails: this.formBuilder.array([]),
      addresses: this.formBuilder.array([]),
    });

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(
        (value) => {
          if (this.form.getRawValue().isCompany && this.form.getRawValue().firstName) {
            this.getExistingContacts(this.form.getRawValue().isCompany, this.form.getRawValue().firstName);
          } else if (!this.form.getRawValue().isCompany && this.form.getRawValue().firstName && this.form.getRawValue().lastName) {
            this.getExistingContacts(this.form.getRawValue().isCompany, this.form.getRawValue().firstName + ' ' + this.form.getRawValue().lastName);
          }
        }
      )

    this.appointmentForm = this.formBuilder.group({
      typeFlag: new FormControl<any>(0, { nonNullable: true, validators: [Validators.required] }),
      designation: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      joiningDate: new FormControl<any>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      resignationDate: new FormControl<Date | undefined>(undefined),
      manValue: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required, Validators.minLength(1), Validators.maxLength(10)] }),
      companyID: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      managerContact: new FormControl<any>(null),
    });

    this.filteredManagerContacts$ = this.clientContactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );
    this.touchForm();
  }

  filterContacts(property: string): any[]
  {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnManagerContact(option?: Contact): string {
    return option ? option.name : '';
  }

  private async getFilteredContacts() {
    this.contactOptions = await firstValueFrom(this.entityApiService.getOptions([
      { key: 'appointmentStatusFlag', value: this.config.TEAM_APPOINTMENT_STATUS_APPOINTED.toString() },
    ]).pipe(map(data => data ? data.map((x: Contact) => x) : [])));
  }

  companyOptions: Company[] = [];
  async getCompanyOptions() {
    this.companyOptions = await firstValueFrom(this.companyService.get());
    this.af['companyID'].setValue(this.companyOptions[0].id, { emitEvent: false });
  }

  appointmentTypeOptions: TypeMaster[] = [];
  async getAppointmentTypeOptions() {
    this.appointmentTypeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT }]));
    this.af['typeFlag'].setValue(this.appointmentTypeOptions[0].value, { emitEvent: false });
  }

  //Phone add/remove code below
  // Getter for phones FormArray
  phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  onAddPhone() {
    this.addPhone(new ContactPhone({ isPrimary: this.phones().length == 0,title: this.phoneTitleOptions[0] }));
  }

  // Add phone to FormArray
  addPhone(value: ContactPhone) {
    this.phones().push(this.formBuilder.group({
      isPrimary: new FormControl<boolean>(value.isPrimary, { validators: [Validators.required] }),
      title: new FormControl<any>(value.title),
      phone: new FormControl<any>(value.phone, { validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
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
      email: new FormControl<any>(value.email, { validators: [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)] }),
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

  // Remove address from FormArray
  onRemoveAddress(index: number) {
    this.addresses().removeAt(index);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.fullName : '';
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


// Function to remove invalid or empty FormGroup elements from a FormArray
private removeInvalidFormGroups() {
  const formArrays = ['phones', 'emails', 'addresses']; // List of FormArray keys
  
  formArrays.forEach((key) => {
    const formArray = this.form.get(key) as FormArray;

    if (formArray) {
      // Filter the FormArray to retain only valid groups
      for (let i = formArray.length - 1; i >= 0; i--) {
        const group = formArray.at(i) as FormGroup;

        if (group.invalid || this.isFormGroupEmpty(group)) {
          formArray.removeAt(i); // Remove invalid or empty group
        }
      }
    }
  });
}

// Utility method to check if all controls in a FormGroup are empty
private isFormGroupEmpty(group: FormGroup): boolean {
  return Object.values(group.controls).every((control) => {
    const value = control.value;
    return value === null || value === undefined || value === '';
  });
}
  onSubmit() {

    this.removeInvalidFormGroups();

    if (this.form.invalid || this.appointmentForm.invalid) {
      this.touchForm();
      console.log(this.form);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    this.currentEntity = Object.assign(new Contact(), this.form.getRawValue());
    this.currentEntity.photoUrl = this.photoUrl;

    const _messageText = "Create New " + 'Team Member' + ": " +
      this.currentEntity.firstName + " " + this.currentEntity.lastName;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        this.currentEntity = await firstValueFrom(this.entityApiService.create(this.currentEntity));
        try {
          let appointment = new ContactAppointment(this.appointmentForm.getRawValue());
          appointment.contactID = this.currentEntity.id;
          appointment.managerContactID = this.af['managerContact'].value ? (this.af['managerContact'].value as Contact).id : undefined;
          appointment.contactID = this.currentEntity.id; // ContactID is necessary 
          appointment = await firstValueFrom(this.contactAppointmentService.create(appointment));
  
          if (this.attachments.length > 0) {
            let _createRequests = this.attachments.map(x => {
              x.contactAppointmentID = appointment.id;
              return this.contactAppointmentAttachmentService.create(x);
            });
            const results = await firstValueFrom(forkJoin(_createRequests));
            appointment.attachments.push(...results);
          }
          this.currentEntity.appointments.push(appointment);
          this.utilityService.showSwalToast('Success!', 'Save successful.');

          this.entityApiService.refreshList();
          this.onClose(this.currentEntity);
        } catch (error) {
          
          await firstValueFrom(this.entityApiService.delete(this.currentEntity.id));
          // this.utilityService.showErrorToast('Error!', 'Save failed.');
          this.onClose(null);
        }
      

       
      }
    );
  }

  blobConfigPhoto!: McvFileUploadConfig;
  async onUploadPhoto(uploads: UploadResult[]) {
    this.currentEntity.photoUrl = uploads[0].url;
    const dialogRef = this.mcvFileUtilityService.openImageEditorDialog(uploads[0].blobPath, uploads[0].url);
    dialogRef.afterClosed().subscribe(async (res: any) => {
      // console.log('onClose', res);
      if (res) {
        console.log(res);
        this.photoUrl = res;
        this.currentEntity.photoUrl = this.photoUrl;
        // if (!this.isCreateMode)
        // {
        //   await firstValueFrom(this.entityApiService.update(this.currentEntity));
        //   this.entityApiService.refreshList();
        //   this.update.emit(this.currentEntity);
        // }
      }
    });
  }

  async onRemovePhoto() {
    if (this.currentEntity) {
      this.photoUrl = '';
      this.currentEntity.photoUrl = '';
      // await firstValueFrom(this.entityApiService.update(this.currentEntity));
      // this.entityApiService.refreshList();
      // this.update.emit(this.currentEntity);
    }
  }


  private async getExistingContacts(isCompany: boolean, name: string) {
    this.existingContacts = await firstValueFrom(this.entityApiService.getOptions([{ key: 'isCompany', value: isCompany.toString() }],name));

    // console.log('duplicates', this.existingContacts);
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
        this.onClose(res);
      }
    });
  }

  // APPOINTMENT ATTACHMENTS
  attachments: ContactAppointmentAttachment[] = [];
  blobConfigAppointment!: McvFileUploadConfig;
  async onDeleteAttachment(item: ContactAppointmentAttachment) {
    if (item) {
      this.attachments = this.attachments.filter(obj => obj.uid !== item.uid);
      if (item.id != 0) {
        await firstValueFrom(this.contactAppointmentAttachmentService.delete(item.id, true));
      }
    }
  }

  onDownloadAttachment(item: any) {
    window.open(item.url);
  }

  getFilteredAttachments(attachments: ContactAppointmentAttachment[], typeFlag: number, isMedia: boolean) {
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }

  async onTagsUpdate(tags: string[], attachment: ContactAppointmentAttachment) {
    if (tags) {
      attachment.searchTags = tags;
      if (attachment.id != 0) {
        await firstValueFrom(this.contactAppointmentAttachmentService.update(attachment));
      }
    }
  }

  uploadQueue: ContactAppointmentAttachment[] = [];
  async onUploadAppointment(uploads: UploadResult[]) {
    // console.log('attachments', uploads);
    // let _createRequests: Observable<any>[] = [];
    this.uploadQueue = uploads.map(x =>
      new ContactAppointmentAttachment({
        filename: x.filename,
        size: x.size,
        contentType: x.contentType,
        guidname: x.blobPath,
        blobPath: x.blobPath,
        // contactApppointmentID : appointment.id,
        container: this.blobConfigAppointment.container,
        typeFlag: 0,
        url: x.url,
        originalUrl: x.url,
        id: 0,
      })
    );

    this.attachments.push(...this.uploadQueue);
  }

  attachmentTagOptions: any[] = [];
  private async getSearchAttachmentTagOptions() {
    this.attachmentTagOptions = await firstValueFrom(this.contactAppointmentAttachmentService.getSearchTagOptions());
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
