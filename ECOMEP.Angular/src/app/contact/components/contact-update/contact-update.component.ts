import { Router } from '@angular/router';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, inject } from '@angular/core';

import { ContactApiService } from '../../services/contact-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { AppConfig } from 'src/app/app.config';
import { Observable, debounceTime, distinctUntilChanged, map, firstValueFrom, take } from 'rxjs';
import { Contact, ContactAddress, ContactAssociation, ContactEmail, ContactPhone } from '../../models/contact';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { ContactAssociationFormComponent } from '../contact-association-form/contact-association-form.component';
import { McvTagEditorComponent } from '../../../mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { ContactEmailFormComponent } from '../contact-email-form/contact-email-form.component';
import { ContactPhoneFormComponent } from '../contact-phone-form/contact-phone-form.component';
import { McvActivityListComponent } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { ContactAddressFormComponent } from '../contact-address-form/contact-address-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ContactMergeComponent } from '../contact-merge/contact-merge.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CityOption, CountryCode, StateCode } from 'src/app/shared/models/locations';

@Component({
  selector: 'app-contact-update',
  templateUrl: './contact-update.component.html',
  styleUrls: ['./contact-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatExpansionModule,
    TextFieldModule,
    MatAutocompleteModule,

    // Components 
    McvTagEditorComponent,
    McvActivityListComponent,
    ContactPhoneFormComponent,
    ContactEmailFormComponent,
    ContactAddressFormComponent,
    ContactAssociationFormComponent,
  ]
})
export class ContactUpdateComponent implements OnInit {
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
  //-----------------------------------//

  currentEntity: Contact = new Contact();
  selectedAssociates: ContactAssociation[] = [];

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
  phoneTitleOptions = ["Work", "Personal", "Landline", "Other"];
  emailTitleOptions = ["Work", "Personal", "Other"];
  addressTitleOptions = ["Work", "Home", "Other"];
  genderOptions = ["Male", "Female", "Other"];
  alertMessage: string = "";
  isShowAlert: boolean = false;
  selectedContact!: Contact;
  currentEntityContact!: Contact;

  @Input('currentEntity') set currentEntityValue(value: Contact) {
    if (value) {
      if (!this.form) {
        this.buildForm()
      }
      this.currentEntity = value;
      this.selectedAssociates = this.currentEntity.isCompany ? this.currentEntity.associatedContacts : this.currentEntity.associatedCompanies;
      this.getCurrentEntityContact();
      this.setAssociationConfig();
      this.showNewAssociate = this.currentEntity.associatedContacts.length == 0;
    }
  }

  @Output() updated = new EventEmitter<any>();
  @Output() deleted = new EventEmitter<any>();
  @Output() formChange = new EventEmitter<any>();

  constructor(
    private entityApiService: ContactApiService,
    private appSettingService: AppSettingMasterApiService,
    private router: Router,
    private config: AppConfig
  ) {
  }


  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    this.getMasterCategoryOptions();
    this.setAssociationConfig();
    this.getContactOptions();
    this.getTagOptions();
    this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());

    this.bindForm();
  }

  filteredRealtionshipManagerContacts$!: Observable<Contact[]>;
  private buildForm() {
    this.form = this.formBuilder.group({
      isCompany: new FormControl<boolean>(false, { validators: [Validators.required] }),
      title: new FormControl<any>(null),
      firstName: new FormControl<any>(null, { validators: [Validators.required] }),
      middleName: new FormControl<any>(null),
      lastName: new FormControl<any>(null),
      categories: new FormControl<any>(null),
      gender: new FormControl<any>(null),

      maritalStatus: new FormControl<any>(null),
      birth: new FormControl<any>(null),
      anniversary: new FormControl<any>(null),

      website: new FormControl<any>(null),

      pan: new FormControl<any>(null),
      aadhaar: new FormControl<any>(null),
      udhyam: new FormControl<any>(null),
      tan: new FormControl<any>(null),
      gstin: new FormControl<any>(null),
      hsn: new FormControl<any>(null),
      arn: new FormControl<any>(null),
      source: new FormControl<any>(null),
      grade: new FormControl<any>(null),
      employeeCount: new FormControl<any>(null),
      description: new FormControl<any>(null),
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

    this.touchForm();

    this.form.valueChanges.pipe(
      debounceTime(1200),
      distinctUntilChanged(),
    ).subscribe((value: string) => {
      this.formChange.emit(this.form);
    });

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(
        (value) => {
          if (this.form.getRawValue().isCompany && this.form.getRawValue().firstName) {
            this.getExisting(this.form.getRawValue().isCompany, this.form.getRawValue().firstName);
          } else if (!this.form.getRawValue().isCompany && this.form.getRawValue().firstName && this.form.getRawValue().lastName) {
            this.getExisting(this.form.getRawValue().isCompany, this.form.getRawValue().firstName, this.form.getRawValue().lastName);
          }
        }
      )
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



  contactOptions: Contact[] = [];
  private async getContactOptions() {
    this.contactOptions = await firstValueFrom(this.entityApiService.getOptions());
  }

  onSelectContact(event: MatAutocompleteSelectedEvent) {
    this.selectedContact = event.option.value;
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

  associationConfig: any;
  private setAssociationConfig() {
    this.associationConfig = {
      isReadOnly: !this.isPermissionEdit,
      contact: this.currentEntity,
      associations: this.selectedAssociates,
      updateDatabase: true
    };
  }
  onAssociationsChange(data: ContactAssociation[]) {
    this.selectedAssociates = data;
  }

  // Category //
  categoryOptions: any[] = [];
  private async getMasterCategoryOptions() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_CONTACT_CATEGORY_OPTIONS);
    if (_setting) {
      this.categoryOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
    }

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
        this.entityApiService.activeEntity = null;
        this.router.navigate([this.config.ROUTE_CONTACT_LIST]);
      }
    );
  }

  //Phone add/remove code below
  // Getter for phones FormArray
  phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  onAddPhone() {
    this.addPhone(new ContactPhone());
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
    this.addEmail(new ContactEmail());
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
    this.addAddress(new ContactAddress());
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
  
  addAssociate() {
    this.showNewAssociate = true;
  }
  //Address add/remove code ends.

  showNewAssociate: boolean = false;
  onAssociateChange(associate: ContactAssociation) {
    if (associate) {
      let _exist: ContactAssociation | undefined;
      if (this.currentEntity.isCompany) {
        _exist = this.currentEntity.associatedContacts.find(x => x.personContactID == associate.personContactID);
        if (!_exist) {
          this.currentEntity.associatedContacts.push(associate);
        } else {
          _exist = Object.assign({}, associate);
        }
        this.selectedAssociates = this.currentEntity.associatedCompanies;
      } else {
        _exist = this.currentEntity.associatedCompanies.find(x => x.companyContactID == associate.companyContactID);
        if (!_exist) {
          this.currentEntity.associatedCompanies.push(associate);
        } else {
          _exist = Object.assign({}, associate);
        }
        this.selectedAssociates = this.currentEntity.associatedContacts;
      }
      this.showNewAssociate = false;
      this.updated.emit(this.currentEntity);
    }
  }

  onDeleteAssociation(associate: ContactAssociation) {
    if (this.currentEntity.associatedCompanies.length) {
      this.currentEntity.associatedCompanies = this.currentEntity.associatedCompanies.filter(x => x.id !== associate.id);
    } else {
      this.currentEntity.associatedContacts = this.currentEntity.associatedContacts.filter(x => x.id !== associate.id);
    }
    // if (!this.contactAssociationService.deletedAssociates.find(x => x.personContactID == associate.personContactID && x.companyContactID == associate.companyContactID))
    //   this.contactAssociationService.deletedAssociates.push(associate);
    this.updated.emit(this.currentEntity);
  }

  async getCurrentEntityContact() {
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
    // this.existingContacts = data.filter(x => x.id != this.currentEntity.id);
    this.existingContacts = data;
    this.isShowAlert = false;
    if (this.existingContacts.length > 1) {
      this.isShowAlert = true;
    }
  }

  onOpenMerge() {
    const _dialogRef = this.entityApiService.openDialog(ContactMergeComponent, { contactList: this.existingContacts });
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updated.emit(this.currentEntity);
      }
    });
  }

  tagOptions: string[] = [];
  private async getTagOptions() {
    this.tagOptions = await firstValueFrom(this.entityApiService.getSearchTagOptions());
  }

  async onTagsChange(tags: string[]) {
    this.currentEntity.searchTags = tags;
    this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
    this.utilityService.showSwalToast('', 'Tags updated successfully.');
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

  onAddressPrimaryChange(selectedIndex: number) {
    this.addresses().controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('isPrimary')?.setValue(false, { emitEvent: false });
      }
    });
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
}
