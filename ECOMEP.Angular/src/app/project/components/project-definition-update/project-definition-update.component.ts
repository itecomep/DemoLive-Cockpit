import { AbstractControl, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Component, EventEmitter, inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';

import { Observable, debounceTime, distinctUntilChanged, startWith, map, firstValueFrom, take } from 'rxjs';
import { Project } from '../../models/project.model';
import { Contact } from 'src/app/contact/models/contact';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { Company } from 'src/app/shared/models/company.model';
import { ProjectApiService } from '../../services/project-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { CityOption, CountryCode, StateCode } from 'src/app/shared/models/locations';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AppConfig } from 'src/app/app.config';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvActivityListComponent } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { McvTagEditorComponent } from '../../../mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Router } from '@angular/router';
import { ContactDialogComponent } from 'src/app/contact/components/contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-project-definition-update',
  templateUrl: './project-definition-update.component.html',
  styleUrls: ['./project-definition-update.component.scss'],
  standalone: true,
  imports: [NgxMatSelectSearchModule, MatExpansionModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule, MatIconModule, NgIf, MatButtonModule, McvTagEditorComponent, McvActivityListComponent, AsyncPipe]
})
export class ProjectDefinitionUpdateComponent implements OnInit {
  //--------FORM RELATED----------------//
  readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly projectService = inject(ProjectApiService);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  form!: FormGroup;

  referredByFC: FormControl = new FormControl<any>('');
  clientContactFC: FormControl = new FormControl<any>('');
  groupContactFC: FormControl = new FormControl<any>('');
  groupCompanyContactFC: FormControl = new FormControl<any>('');

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get isPermissionBillingEdit() { return this.projectService.isPermissionBillingEdit; }

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

  currentEntity: Project = new Project();
  get dialogTitle() { return `New ${this.nameOfEntity}`; }
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionEdit; }
  get isPermissionDelete() { return this.entityApiService.isPermissionDelete; }
  get isPermissionList() { return this.entityApiService.isPermissionDelete; }

  alertMessage: string = "";
  isShowAlert: boolean = false;
  @Input('currentEntity') set currentEntityValue(value: Project) {
    if (value) {
      if (!this.form) this.buildForm();
      this.currentEntity = value;
      this.bindForm();
    }
  }

  contactFilter = [];
  locationOptions: any[] = [];
  filteredLocationOptions!: Observable<any[]>;

  cityOptions: CityOption[] = [];
  filteredCityOptions$!: Observable<string[]>;

  stateCodeOptions: StateCode[] = [];
  filteredStateOptions$!: Observable<string[]>;
  filteredStateCodeOptions$!: Observable<StateCode[]>;

  countryCodeOptions: CountryCode[] = [];
  filteredCountryOptions$!: Observable<string[]>;

  companyOptions: Company[] = [];
  contactOptions: any[] = [];
  filteredClientOptions!: Observable<any[]>;
  filteredGroupCompanyOptions!: Observable<any[]>;
  filteredGroupOptions!: Observable<any[]>;
  filteredReferrerOptions!: Observable<any[]>;
  segmentOptions: string[] = [];
  typologyOptions: string[] = [];

  IsProjectExists: boolean = false;
  now = new Date();

  dateFilter = (d: Date | null): boolean => {
    if (d && d < new Date()) {
      return false;
    }
    return true;
  }


  @Output() updated = new EventEmitter<Project>();
  @Output() deleted = new EventEmitter<Project>();
  @Output() formChange = new EventEmitter<any>();

  constructor(
    private entityApiService: ProjectApiService,
    private config: AppConfig,
    private appSettingService: AppSettingMasterApiService,
    private statusMasterService: StatusMasterService,
    private typeMasterService: TypeMasterService,
    private companyService: CompanyApiService,
    private contactService: ContactApiService,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    await this.getCompanyOptions();
    await this.getLocationOptions();
    await this.getContactOptions();
    await this.getStatusOptions();
    await this.getTypeOptions();
    await this.getSegmentOptions();
    await this.getTypologyOptions();
    // this.bindForm();


    //The below code allows us to bind value as the value we are binding are from contactOptions
    const _referredContact = this.contactOptions.filter(x => x.fullName.toLowerCase() == this.currentEntity.referredByContact?.fullName.toLowerCase());
    if (_referredContact) {
      this.f['referredByContact'].setValue(_referredContact[0], { emitEvent: false });
    }

    const _clientContact = this.contactOptions.filter(x => x.fullName.toLowerCase() == this.currentEntity.clientContact?.fullName.toLowerCase());
    if (_clientContact) {
      this.f['clientContact'].setValue(_clientContact[0], { emitEvent: false });
    }

    const _groupContact = this.contactOptions.filter(x => x.id == this.currentEntity.groupContact?.id);
    if (_groupContact) {
      this.f['groupContact'].setValue(_groupContact[0], { emitEvent: false });
    }

    this.filteredReferrerOptions = this.referredByFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );

    this.filteredClientOptions = this.clientContactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );

    this.filteredGroupOptions = this.groupContactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );

    this.filteredGroupCompanyOptions = this.groupCompanyContactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      location: new FormControl<any>(null),
      city: new FormControl<any>(null),
      state: new FormControl<any>(null),
      country: new FormControl<any>(null),
      pinCode: new FormControl<any>(null),
      hsn: new FormControl<any>(null),
      stateCode: new FormControl<any>(null),
      comment: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      code: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      contractStartDate: new FormControl<any>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      contractCompletionDate: new FormControl<any>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      expectedCompletionDate: new FormControl<any>(null),
      clientContact: new FormControl<any>(null),
      groupContact: new FormControl<any>(null),
      groupCompanyContact: new FormControl<any>(null),
      referredByContact: new FormControl<Contact | null>(null),
      statusFlag: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      typeFlag: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      billingTitle: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      companyID: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      segments: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      typologies: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      expectedMHr: new FormControl<any>('0'),
      fee: new FormControl<any>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    });

    if (!this.isPermissionEdit) {
      this.form.disable();
    }

    this.f['clientContact'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value: Contact) => {
        if (value) {
          // this.f["gstin"].setValue(value.gstin, { emitEvent: false });
          // this.f["pan"].setValue(value.pan, { emitEvent: false });
          // this.f["tan"].setValue(value.tan, { emitEvent: false });
          // this.f["arn"].setValue(value.arn, { emitEvent: false });
          // this.f["udhyam"].setValue(value.udhyam, { emitEvent: false });
          // this.f["aadhaar"].setValue(value.aadhaar, { emitEvent: false });
        }
      });

    this.filteredLocationOptions = this.f['location'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as any).name) : null),
      map(name => (name ? this._filterLocation(name as string) : this.locationOptions.slice()))
    );

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

        const stateInfo = this.stateCodeOptions.find(x => x.state === option?.state);
        this.f['stateCode'].setValue(stateInfo?.tin, { emitEvent: false })

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

    this.filteredStateCodeOptions$ = this.f['stateCode'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as any).state) : null),
      map(name => (name ? this._filterStateCode(name as any) : this.stateCodeOptions.slice()))
    );

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(
        (value) => {
          if (this.form.getRawValue().title) {
            this.getExisting(this.form.getRawValue().title);
          }
        }
      )
  }


  bindForm() {
    this.form.patchValue(this.currentEntity);
    this.f['comment'].reset();
    this.f['segments'].setValue(this.currentEntity.segment?.split(','), { emitEvent: false });
    this.f['typologies'].setValue(this.currentEntity.typology?.split(','), { emitEvent: false });
    //Binding Value for ngx mat select search
    const _referredContact = this.contactOptions.filter(x => x.fullName.toLowerCase() == this.currentEntity.referredByContact?.fullName.toLowerCase());
    if (_referredContact) {
      this.f['referredByContact'].setValue(_referredContact[0], { emitEvent: false });
    }

    const _clientContact = this.contactOptions.filter(x => x.fullName.toLowerCase() == this.currentEntity.clientContact?.fullName.toLowerCase());
    if (_clientContact) {
      this.f['clientContact'].setValue(_clientContact[0], { emitEvent: false });
    }

    const _groupContact = this.contactOptions.filter(x => x.id == this.currentEntity.groupContact?.id);
    if (_groupContact) {
      this.f['groupContact'].setValue(_groupContact[0], { emitEvent: false });
    }


    if (this.currentEntity.expectedCompletionDate && this.currentEntity.expectedCompletionDate < new Date()) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      this.f['expectedCompletionDate'].setValue(date);
    } else {
      this.f['expectedCompletionDate'].setValue(this.currentEntity.expectedCompletionDate);
    }
    this.formChange.emit(this.form);
  }

  onCancelEdit() {
    this.entityApiService.isEditMode = false;
  }

  existing: Contact[] = [];
  private async getExisting(title: string,) {
    let filters: ApiFilter[] = [
      { key: 'title', value: title }
    ];
    const data = await firstValueFrom(this.entityApiService.get(filters));
    this.existing = data.filter(x => x.companyID == this.currentEntity.companyID && x.id != this.currentEntity.id);
    this.isShowAlert = false;
    if (this.existing.length > 0) {
      this.isShowAlert = true;
    }

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


  private async getContactOptions() {
    if(this.contactOptions.length == 0)
    this.contactOptions = await firstValueFrom(this.contactService.getOptions(this.contactFilter, '', 'fullName'));
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnContact(option?: any): string {
    return option ? option.name : '';
  }

  displayFnLocation(option?: any): string {
    return option ? option : '';
  }

  displayFnCity(option?: any): string {
    return option ? (typeof option == "string" ? option : option.city) : '';
  }

  displayFnState(option?: string): string {
    return option ? option : '';
  }

  displayFnCountry(option?: any): string {
    return option ? (typeof option == "string" ? option : option.country) : '';
  }

  private _filterLocation(property: string): any[] {
    const filterValue = property ? property.toLowerCase() : '';

    return this.locationOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displayFnStateCode(option?: any): string {
    return option ? (typeof option == "string" ? option : option.tin + " | " + option.state) : '';
  }
  private _filterStateCode(property: string): StateCode[] {
    const filterValue = property ? property.toLowerCase() : '';

    return this.stateCodeOptions.filter(option =>
      option.state?.toLowerCase().includes(filterValue)
    );
  }

  private async getCompanyOptions() {
    this.companyOptions = await firstValueFrom(this.companyService.get());
    // this.f['company'].setValue(this.companyAccountOptions[0], { emitEvent: false });
  }

  private async getLocationOptions() {
    this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());
    const res = await firstValueFrom(this.entityApiService.getFieldOptions('Location'));
    this.locationOptions = res.filter((x: any) => x && x.length > 0);
  }

  statusOptions: StatusMaster[] = [];
  private async getStatusOptions() {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECT }]));
    // this.f["statusFlag"].setValue(this.statusOptions.find(x => x.value == this.config.PROJECT_STATUS_FLAG_INQUIRY)?.value, { emitEvent: false });
  }

  private async getSegmentOptions() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_SEGMENT_OPTIONS);
    if (_setting) {
      this.segmentOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
      // this.f["segment"].setValue(this.segmentOptions[0], { emitEvent: false });
    }
  }

  private async getTypologyOptions() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_TYPOLOGY_OPTIONS);
    if (_setting) {
      this.typologyOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
      // this.f["segment"].setValue(this.segmentOptions[0], { emitEvent: false });
    }
  }

  typeOptions: TypeMaster[] = [];
  private async getTypeOptions() {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECT }]));
    // this.f["typeFlag"].setValue(this.typeOptions[0]?.value, { emitEvent: false });
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
      this.currentEntity = new Project();
    }

    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    this.currentEntity.segment = this.f['segments'].value?.join(',');
    this.currentEntity.typology = this.f['typologies'].value?.join(',');
    this.currentEntity.clientContactID = this.f['clientContact'].value ? this.f['clientContact'].value.id : null;
    this.currentEntity.groupContactID = this.f['groupContact'].value ? this.f['groupContact'].value.id : null;
    this.currentEntity.referredByContactID = this.f['referredByContact'].value ? this.f['referredByContact'].value.id : null;
    this.currentEntity.groupCompanyContactID = this.f['groupCompanyContact'].value ? this.f['groupCompanyContact'].value.id : null;
    const _messageText = `Update | ${this.nameOfEntity}: ${this.currentEntity.title}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {

        // await this.contactAssociationService.updateItems();

        this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
        this.f['comment'].reset();
        this.entityApiService.activeEntity = this.currentEntity;
        this.utilityService.showSwalToast('Success!', 'Save successful.');

        this.entityApiService.refreshList();
        this.updated.emit(this.currentEntity);
      }
    );
  }

  onCreateChild() {
    this.utilityService.showConfirmationDialog(`Do you want create child project for ${this.currentEntity.title}?`, async () => {
      let _childProject = new Project();
      _childProject = Object.assign(_childProject, this.currentEntity);
      _childProject.id = 0;
      _childProject.parentID = this.currentEntity.id;
      const _project = await firstValueFrom(this.entityApiService.create(_childProject));
      this.entityApiService.refreshList();
      this.router.navigate([this.entityApiService.defaultRoute, _project.id]);
    });
  }
  onDeleteClientContact() {

    this.utilityService.showConfirmationDialog(`Do you want to remove  ${this.currentEntity.clientContact?.fullName} ?`, async () => {
      this.currentEntity.clientContactID = undefined;
      this.currentEntity.clientContact = undefined;
      this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
      // this.update.emit(this.currentEntity);
      this.utilityService.showSwalToast('', 'Client removed successfully!!', 'success');
    });

  }

  onDeleteReferredContact() {
    this.utilityService.showConfirmationDialog(`Do you want to remove  ${this.currentEntity.referredByContact?.fullName} ?`, async () => {
      this.currentEntity.referredByContactID = undefined;
      this.currentEntity.referredByContact = undefined;
      this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
      // this.update.emit(this.currentEntity);
      this.utilityService.showSwalToast('', 'Referred by contact removed successfully!!', 'success');
    });

  }

  onDeleteGroupContact() {
    this.utilityService.showConfirmationDialog(`Do you want to remove  ${this.currentEntity.groupContact?.fullName} ?`, async () => {
      this.currentEntity.groupContactID = undefined;
      this.currentEntity.groupContact = undefined;
      this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
      // this.update.emit(this.currentEntity);
      this.utilityService.showSwalToast('', 'Group contact removed successfully!!', 'success');
    });

  }

  onDeleteGroupCompanyContact() {
    this.utilityService.showConfirmationDialog(`Do you want to remove  ${this.currentEntity.groupCompanyContact?.fullName} ?`, async () => {
      this.currentEntity.groupCompanyContact = undefined;
      this.currentEntity.groupCompanyContactID = undefined;
      this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
      // this.update.emit(this.currentEntity);
      this.utilityService.showSwalToast('', 'Group company contact removed successfully!!', 'success');
    });

  }

  onOpenContactDialog(contact: Contact) {
    this.entityApiService.openDialog(ContactDialogComponent, contact);
  }
}
