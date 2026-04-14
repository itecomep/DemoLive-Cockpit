import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, ObservableInput, forkJoin, firstValueFrom, map } from 'rxjs';

import { ContactApiService } from '../../services/contact-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactAssociationApiService } from '../../services/contact-association-api.service';

import { AppConfig } from 'src/app/app.config';
import { Contact, ContactAddress, ContactAssociation, ContactEmail, ContactPhone } from '../../models/contact';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { McvTagEditorComponent } from '../../../mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ContactMergeComponent } from '../contact-merge/contact-merge.component';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CityOption, CountryCode, StateCode } from 'src/app/shared/models/locations';
import { validate } from 'uuid';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    NgTemplateOutlet,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    TextFieldModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    McvTagEditorComponent
]
})
export class ContactCreateComponent implements OnInit {
  // FORM --------------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);
  form!: FormGroup;
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  private touchForm() {
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
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  phoneArray!: FormArray;
  existingContacts: Contact[] = [];
  categoryOptions: string[] = [];
  currentEntity: Contact = new Contact();

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
  phoneTitleOptions = ["Work", "Personal", "Landline","Other"];
  emailTitleOptions = ["Work", "Personal", "Other"];
  addressTitleOptions = ["Work", "Home", "Other"];
  genderOptions = ["Male", "Female", "Other"];
  alertMessage: string = "";
  isShowAlert: boolean = false;
  constructor(
    private config: AppConfig,
    private entityApiService: ContactApiService,
    private contactAssociationService: ContactAssociationApiService,
    private dialog: MatDialogRef<ContactCreateComponent>,
    private appSettingService: AppSettingMasterApiService,
    private router: Router
  ) { }

  onClose(e: any) {
    this.dialog.close(e);
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    this.onAddAddress();
    this.onAddPhone();
    this.onAddEmail();
    
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_CONTACT_CATEGORY_OPTIONS);
    if (_setting) {
      this.categoryOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
    }
    this.getTagOptions();
    this.contactAssociationService.resetItems();
    this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());
  }

  filteredContacts$!: Observable<Contact[]>;
  private buildForm() {
    this.form = this.formBuilder.group({
      isCompany: new FormControl<boolean>(false, { validators: [Validators.required] }),
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      firstName: new FormControl<any>(null, { validators: [Validators.required] }),
      middleName: new FormControl<any>(null),
      lastName: new FormControl<any>(null),
      gender: new FormControl<any>(this.genderOptions[0], { validators: [Validators.required] }),
      maritalStatus: new FormControl<any>(null),
      birth: new FormControl<any>(null),
      anniversary: new FormControl<any>(null),
      website: new FormControl<any>(null),
      categories: new FormControl<any>(null),
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

      phones: this.formBuilder.array([]),
      emails: this.formBuilder.array([]),
      addresses: this.formBuilder.array([]),
    });

    this.f['isCompany'].valueChanges.subscribe((value: boolean) => {
      this.currentEntity.isCompany = value;
      this.currentEntity = Object.assign({}, this.currentEntity);
      if (!this.currentEntity.isCompany) {
        this.f.title.setValidators([Validators.required]);
        this.f.gender.setValidators([Validators.required]);
      } else {
        this.f.title.clearValidators();
        this.f.gender.clearValidators();
      }
    });

    // this.filteredContacts$ = this.f['relationshipManager'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   // switchMap(name => name ? this.getContactOptions(name as string) : of([])),
    //   map(value => typeof value === "string" ? value : (value as Contact)?.name),
    //   map((value: string) =>
    //     value ? this.filterAppointedContact(value) : this.filterAppointedContact()
    //   )
    // );

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(
        () => {
          console.log('check duplicates', this.form.getRawValue().firstName);
          if (this.form.getRawValue().isCompany && this.form.getRawValue().firstName) {
            this.getExistingContacts(this.form.getRawValue().isCompany, this.form.getRawValue().firstName);
          } else if (!this.form.getRawValue().isCompany && this.form.getRawValue().firstName && this.form.getRawValue().lastName) {
            this.getExistingContacts(this.form.getRawValue().isCompany, this.form.getRawValue().firstName + ' ' + this.form.getRawValue().lastName);
          }
        }
      )

    this.touchForm();
  }

  //Phone add/remove code below
  // Getter for phones FormArray
  phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  onAddPhone() {
    console.log('this.phones()',this.phones());
    this.addPhone(new ContactPhone({ isPrimary: this.phones().length == 0, title: this.phoneTitleOptions[0] }));
  }

  // Add phone to FormArray
  addPhone(value: ContactPhone) {
    this.phones().push(this.formBuilder.group({
      isPrimary: new FormControl<boolean>(value.isPrimary, { validators: [Validators.required] }),
      title: new FormControl<any>(value.title),
      phone: new FormControl<any>(value.phone, { 
      validators: [
        Validators.required, 
        Validators.pattern(/^\d+$/) // Number only validation
      ] 
      }),
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
      email: new FormControl<any>(value.email, { validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)] }),
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

  // contactOptions: Contact[] = [];
  // private async getContactOptions() {
  //   this.contactOptions = await firstValueFrom(this.entityApiService.getOptions());
  // }

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



  private async getExistingContacts(isCompany: boolean, name: string) {
    this.existingContacts = await firstValueFrom(this.entityApiService.getOptions([{ key: 'isCompany', value: isCompany.toString() }],name));

    // console.log('duplicates', this.existingContacts);
    this.isShowAlert = false;
    if (this.existingContacts.length > 0) {
      this.isShowAlert = true;
    }

  }
  openContactDetails(contact: Contact) {
    this.entityApiService.openDialog(ContactDialogComponent, { data: contact });;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      // console.log(this.form.value);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }


    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    this.currentEntity.title = this.currentEntity.isCompany ? undefined : this.currentEntity.title;
    // this.currentEntity.relationshipManagerID = this.f['relationshipManager'].value ? (this.f['relationshipManager'].value as Contact).id : undefined;
    console.log(this.currentEntity);
    const _messageText = `Create New Contact | ${this.currentEntity.firstName} ${this.currentEntity.lastName ? this.currentEntity.lastName : ''} ?`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        const associatedCompanies = this.currentEntity.associatedCompanies;
        const associatedContacts = this.currentEntity.associatedContacts;

        this.currentEntity = await firstValueFrom(this.entityApiService.create(this.currentEntity));

        if (associatedCompanies && associatedCompanies.length) {
          const requests: ObservableInput<any>[] = [];
          associatedCompanies.forEach(x => {
            x.personContactID = this.currentEntity.id;
            requests.push(this.contactAssociationService.create(x))
          });
          this.currentEntity.associatedCompanies = await firstValueFrom(forkJoin(requests));
        }
        if (associatedContacts && associatedContacts.length) {
          const requests: ObservableInput<any>[] = [];
          associatedContacts.forEach(x => {
            x.companyContactID = this.currentEntity.id;
            requests.push(this.contactAssociationService.create(x))
          });
          this.currentEntity.associatedContacts = await firstValueFrom(forkJoin(requests));
        }

        this.utilityService.showSwalToast('Success!', 'Save successful.');

        this.entityApiService.refreshList();
        this.router.navigate([this.entityApiService.defaultRoute, this.currentEntity.id]);
        this.onClose(this.currentEntity);
      }
    );
  }

  // Association //
  showNewAssociation: boolean = true;
  addAssociation() {
    this.showNewAssociation = true;
  }
  onAssociationChange(association: ContactAssociation) {
    if (association) {
      if (this.currentEntity.isCompany) {
        let exist = this.currentEntity.associatedContacts.find(x => x.personContactID == association.personContactID);
        if (!exist) {
          this.currentEntity.associatedContacts.push(association);
        } else {
          exist = Object.assign({}, association);
        }
        this.showNewAssociation = this.currentEntity.associatedContacts.length == 0;
      } else {
        let exist = this.currentEntity.associatedCompanies.find(x => x.companyContactID == association.companyContactID);
        if (!exist) {
          this.currentEntity.associatedCompanies.push(association);
        } else {
          exist = Object.assign({}, association);
        }
        this.showNewAssociation = this.currentEntity.associatedCompanies.length == 0;
      }

    }
  }
  onDeleteAssociation(association: ContactAssociation) {
    if (this.currentEntity.isCompany) {
      this.currentEntity.associatedContacts = this.currentEntity.associatedContacts.filter(x => x.personContactID == association.personContactID);
    } else {
      this.currentEntity.associatedCompanies = this.currentEntity.associatedCompanies.filter(x => x.companyContactID == association.companyContactID);
    }
  }
  // -------------------- //

  onOpenMerge() {
    const _dialogRef = this.entityApiService.openDialog(ContactMergeComponent, { contactList: this.existingContacts });
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.onClose(res);
      }
    });
  }

  tagOptions: string[] = [];
  private async getTagOptions() {
    this.tagOptions = await firstValueFrom(this.entityApiService.getSearchTagOptions());
  }
  onTagsChange(tags: string[]) {
    this.currentEntity.searchTags = tags;
  }

  updateAssociation(associations: ContactAssociation[]) {
    if (this.currentEntity.isCompany) {
      this.currentEntity.associatedContacts = associations;
    } else {
      this.currentEntity.associatedCompanies = associations;
    }
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
