import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { Observable, ObservableInput, debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, startWith, take } from 'rxjs';

import { Company } from 'src/app/shared/models/company.model';
import { Project } from '../../models/project.model';
import { Contact } from 'src/app/contact/models/contact';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { ProjectAssociation } from '../../models/project-association.model';

import { ProjectApiService } from '../../services/project-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { ProjectAssociationApiService } from '../../services/project-association-api.service';
import { ProjectNote } from '../../models/project-note.model';
import { ProjectNoteApiService } from '../../services/project-note-api.service';
import { CityOption, StateCode, CountryCode } from 'src/app/shared/models/locations';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { ProjectCreateAssociationsComponent } from '../project-create-associations/project-create-associations.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgTemplateOutlet,NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Router } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  standalone: true,
  imports: [MatButtonModule,
    MatExpansionModule,
    NgTemplateOutlet,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    ProjectCreateAssociationsComponent,
    TextFieldModule,
    AsyncPipe,
    NgxMatSelectSearchModule
  ]
})
export class ProjectCreateComponent implements OnInit
{
  currentEntity: Project = new Project();
  get dialogTitle() { return `New ${this.nameOfEntity}`; }
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionEdit; }

  referredByFC: FormControl = new FormControl<any>('');
  groupContactFC: FormControl = new FormControl<any>('');
  clientContactFC: FormControl = new FormControl<any>('');
  groupCompanyContactFC: FormControl = new FormControl<any>('');

  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;
  form: any;
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  contactFilter = [];
  locationOptions: any[] = [];
  filteredLocationOptions!: Observable<any[]>;
  cityOptions: CityOption[] = [];
  filteredCityOptions$!: Observable<string[]>;

  stateCodeOptions: StateCode[] = [];
  filteredStateOptions$!: Observable<string[]>;

  countryCodeOptions: CountryCode[] = [];
  filteredCountryOptions$!: Observable<string[]>;
  filteredStateCodeOptions$!: Observable<StateCode[]>;

  companyOptions: Company[] = [];
  contactOptions: any[] = [];
  filteredClientOptions!: Observable<any[]>;
  filteredGroupOptions!: Observable<any[]>;
  filteredReferrerOptions!: Observable<any[]>;
  filteredGroupCompanyOptions!: Observable<any[]>;
  segmentOptions: string[] = [];
  typologyOptions: string[] = [];

  constructor(
    private entityApiService: ProjectApiService,
    private contactService: ContactApiService,
    private statusMasterService: StatusMasterService,
    private typeMasterService: TypeMasterService,
    private companyService: CompanyApiService,
    private associateService: ProjectAssociationApiService,
    private notesService: ProjectNoteApiService,
    private appSettingService: AppSettingMasterApiService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private config: AppConfig,
    private dialog: MatDialogRef<ProjectCreateComponent>,
    private router: Router
  )
  {
  }

  onClose(e: any)
  {
    this.dialog.close(e);
  }

  async ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }
    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
      {
        await this.appSettingService.loadPresets();
      }
    const _segmentOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_SEGMENT_OPTIONS);

    if (_segmentOptions)
    {
      this.segmentOptions = _segmentOptions.presetValue.split(',').map(x => x.toUpperCase());
      this.f["segments"].setValue([this.segmentOptions[0]], { emitEvent: false });
    }

    const _typologyOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_TYPOLOGY_OPTIONS);
    if (_typologyOptions)
    {
      this.typologyOptions = _typologyOptions.presetValue.split(',').map(x => x.toUpperCase());
      this.f["typologies"].setValue([this.typologyOptions[0]], { emitEvent: false });
    }

    this.currentEntity = new Project();
    this.setAssociationConfig();
    await this.getCompanyOptions();
    this.getLocationOptions();
    this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());
    this.getContactOptions();
    this.getStatusOptions();
    this.getTypeOptions();
    await this.getProjectCode();
    // this.getMasterTagOptions();

    // if (!this.appSettingService.presets || !this.appSettingService.presets.length)
    // {
    //   await this.appSettingService.loadPresets();
    // }
    // const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    // if (preset)
    // {
    //   this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    // }

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
  touchForm()
  {
    //touch form inputs to show validation messages
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        // {1}
        const control = this.form.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  resetForm()
  {
    if (this.form)
    {
      this.form.reset();
    }
  }

  triggerResize()
  {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  get isInquiryMode(): boolean
  {
    return this.currentEntity && this.currentEntity.statusFlag < 2;
  }

  private buildForm()
  {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      location: new FormControl<any>(null),
      city: new FormControl<any>(null),
      state: new FormControl<any>(null),
      country: new FormControl<any>(null),
      pinCode: new FormControl<any>(null),
      pan: new FormControl<any>(null),
      tan: new FormControl<any>(null),
      gstin: new FormControl<any>(null),
      aadhaar: new FormControl<any>(null),
      udhyam: new FormControl<any>(null),
      hsn: new FormControl<any>(null),
      arn: new FormControl<any>(null),
      stateCode: new FormControl<any>(null),
      code: new FormControl<any>(null,{ nonNullable: true, validators: [Validators.required] }),
      contractStartDate: new FormControl<any>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      contractCompletionDate: new FormControl<any>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      expectedCompletionDate: new FormControl<any>(null),
      clientContact: new FormControl<any>(null),
      groupContact: new FormControl<any>(null),
      referredByContact: new FormControl<any>(null),
      groupCompanyContact: new FormControl<any>(null),
      statusFlag: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      typeFlag: new FormControl<any>(null),
      billingTitle: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      companyID: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      segments: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      typologies: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      expectedMHr: new FormControl<any>('0'),
      fee: new FormControl<any>('0'),
      landscapeArea: new FormControl<any>('0'),
      facadeArea: new FormControl<any>('0'),
      interiorArea: new FormControl<any>('0'),
      //NOTES
      note: new FormControl<any>(''),
    });

    if (!this.isPermissionEdit)
    {
      this.form.disable();
    }

    // this.f['title'].valueChanges
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((value: any) => this.validateTitle(value));

    this.f['clientContact'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value: Contact) =>
      {
        if (value)
        {
          this.f["gstin"].setValue(value.gstin, { emitEvent: false });
          this.f["pan"].setValue(value.pan, { emitEvent: false });
          this.f["tan"].setValue(value.tan, { emitEvent: false });
          this.f["udhyam"].setValue(value.udhyam, { emitEvent: false });
          this.f["aadhaar"].setValue(value.aadhaar, { emitEvent: false });
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
    ).subscribe((value: string) =>
    {
      if (value)
      {
        const option = this.cityOptions.find(x => x.city === value);
        this.f['state'].setValue(option?.state, { emitEvent: false });
        this.f['country'].setValue(option?.country, { emitEvent: false });
        const stateInfo = this.stateCodeOptions.find(x=> x.state === option?.state );
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
    ).subscribe((value: string) =>
    {
      if (value)
      {
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
    
    // this.filteredClientOptions = this.f['clientContact'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   startWith<string | any>(""),
    //   map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
    //   map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    // );

    // this.filteredReferrerOptions = this.f['referredByContact'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   startWith<string | any>(""),
    //   map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
    //   map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    // );

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(
        (value: any) =>
        {
          if (this.form.getRawValue().title)
          {
            this.getExisting(this.form.getRawValue().title);
            if(!this.f.billingTitle.value)
              {
                this.f.billingTitle.setValue(this.form.getRawValue().title, {emitEvent: false});
              }
          } 
        }
      )
  }

  associationConfig: any;
  private setAssociationConfig()
  {
    this.associationConfig = {
      isReadOnly: !this.isPermissionEdit,
      project: this.currentEntity,
      associations: this.currentEntity.associations,
      updateDatabase: false
    };
  }
  onAssociationsChange(data: ProjectAssociation[])
  {
    this.currentEntity.associations = data;
  }

  onSubmit()
  {
    if (this.form.invalid)
      {
        this.touchForm();
        this.utilityService.showSweetDialog('Invalid Form',
          'Please fill all required fields with valid data and try again.', 'error'
        );
        return;
      }
  
      if (!this.currentEntity)
      {
        this.currentEntity = new Project();
      }
  
      this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
      this.currentEntity.segment=this.f['segments'].value?.join(',');
      this.currentEntity.typology=this.f['typologies'].value?.join(',');
      this.currentEntity.clientContactID = this.f['clientContact'].value ? this.f['clientContact'].value.id : null;
      this.currentEntity.groupContactID = this.f['groupContact'].value ? this.f['groupContact'].value.id : null;
      this.currentEntity.referredByContactID = this.f['referredByContact'].value ? this.f['referredByContact'].value.id : null;
      this.currentEntity.groupCompanyContactID = this.f['groupCompanyContact'].value ? this.f['groupCompanyContact'].value.id : null;
      const associations= this.currentEntity.associations;
      const _messageText = `Create ${this.nameOfEntity}: ${this.currentEntity.title}`;
     
      this.utilityService.showConfirmationDialog(_messageText,
        async () =>
        {
          this.currentEntity = await firstValueFrom(this.entityApiService.create(this.currentEntity));
          if (associations.length)
            {
              const requests: ObservableInput<any>[] = [];
              associations.forEach(associate =>
              {

                associate.projectID = this.currentEntity.id;

                requests.push(this.associateService.create(associate))
              });
              await firstValueFrom(forkJoin(requests));
            }

            if (this.f['note'].value && this.f['note'].value.length)
            {
              let obj = new ProjectNote();

              obj.notes = this.f['note'].value;
              obj.projectID = this.currentEntity.id;
              await firstValueFrom(this.notesService.create(obj));
            }

          this.utilityService.showSwalToast('Success!', 'Save successful.');
          this.entityApiService.refreshList();
          this.router.navigate([this.entityApiService.defaultRoute, this.currentEntity.id]);
          this.onClose(this.currentEntity);
        }
      );

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


  private async getContactOptions()
  {
    this.contactOptions = await firstValueFrom(this.contactService.getOptions(this.contactFilter, '', 'fullName'));
  }

  filterContacts(property: string): any[]
  {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnContact(option?: any): string
  {
    return option ? option.name : '';
  }


  displayFnLocation(option?: any): string
  {
    return option ? option : '';
  }

  displayFnCity(option?: any): string
  {
    return option ? (typeof option == "string" ? option : option.city) : '';
  }

  displayFnState(option?: string): string
  {
    return option ? option : '';
  }

  displayFnCountry(option?: any): string
  {
    return option ? (typeof option == "string" ? option : option.country) : '';
  }

  private _filterLocation(property: string): any[]
  {
    const filterValue = property ? property.toLowerCase() : '';

    return this.locationOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displayFnStateCode(option?: any): string
  {
    return option ? (typeof option == "string" ? option : option.tin + " | " + option.state) : '';
  }
  private _filterStateCode(property: string): StateCode[]
  {
    const filterValue = property ? property.toLowerCase() : '';

    return this.stateCodeOptions.filter(option =>
      option.state?.toLowerCase().includes(filterValue)
    );
  }

  private async getCompanyOptions()
  {
    this.companyOptions = await firstValueFrom(this.companyService.get());
    this.f['companyID'].setValue(this.companyOptions[0]?.id, { emitEvent: false });
  }

  private async getLocationOptions()
  { this.cityOptions = await firstValueFrom(this.utilityService.getCityOptions());
    this.stateCodeOptions = await firstValueFrom(this.utilityService.getStateGSTINCodes());
    this.countryCodeOptions = await firstValueFrom(this.utilityService.getCountryCodes());
    const res = await firstValueFrom(this.entityApiService.getFieldOptions('Location'));
    this.locationOptions = res.filter((x: any) => x && x.length > 0);
  }

  statusOptions: StatusMaster[] = [];
  private async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECT }]));
    this.f["statusFlag"].setValue(this.statusOptions.find(x => x.value == this.config.PROJECT_STATUS_FLAG_INQUIRY)?.value, { emitEvent: false });
  }

  typeOptions: TypeMaster[] = [];
  private async getTypeOptions() {
    const _typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECT }]));
    if (_typeOptions) {
      this.typeOptions = _typeOptions;
      this.f["typeFlag"].setValue(this.typeOptions[0]?.value, { emitEvent: false });
    }
  }

  isShowAlert: boolean = false;
  existing: Contact[] = [];
  private async getExisting(title: string,)
  {
    let filters: ApiFilter[] = [
      { key: 'title', value: title }
    ];
    const data = await firstValueFrom(this.entityApiService.getOptions(filters));
    this.existing = data.filter(x => x.companyID == this.currentEntity.companyID && x.id != this.currentEntity.id);
    this.isShowAlert = false;
    if (this.existing.length > 0)
    {
      this.isShowAlert = true;
    }
  }

  async getProjectCode() {
    const _code = await firstValueFrom(this.entityApiService.getNewProjectCode(this.f['companyID'].value));
    this.f['code'].setValue(_code.code, { emitEvent: false });
  }
}
