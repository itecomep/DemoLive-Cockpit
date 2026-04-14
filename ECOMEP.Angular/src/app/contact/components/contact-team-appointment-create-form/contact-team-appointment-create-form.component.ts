import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ContactAppointment } from '../../models/contact-appointment.model';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact } from '../../models/contact';
import { ContactAppointmentApiService } from '../../services/contact-appointment-api.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { Observable, debounceTime, distinctUntilChanged, map, firstValueFrom, startWith } from 'rxjs';
import { Company } from 'src/app/shared/models/company.model';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { AppConfig } from 'src/app/app.config';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { ContactApiService } from '../../services/contact-api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet, NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
    selector: 'app-contact-team-appointment-create-form',
    templateUrl: './contact-team-appointment-create-form.component.html',
    styleUrls: ['./contact-team-appointment-create-form.component.scss'],
    standalone: true,
    imports: [CommonModule ,MatButtonModule, NgTemplateOutlet,NgxMatSelectSearchModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatRadioModule, NgFor, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, MatAutocompleteModule, AsyncPipe]
})
export class ContactTeamAppointmentCreateFormComponent implements OnInit
{

  private readonly entityApiService = inject(ContactAppointmentApiService);
  private readonly typeMasterService = inject(TypeMasterService);
  private readonly statusMasterService = inject(StatusMasterService);
  private readonly config = inject(AppConfig);
  private readonly companyService = inject(CompanyApiService);
  // FORM --------------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);
  form!: FormGroup;
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  private touchForm()
  {
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }
  getErrorMessage(control?: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  contact!: Contact;
  clientContactFC: FormControl = new FormControl<any>('');
  currentEntity: ContactAppointment = new ContactAppointment();
  typeOptions: TypeMaster[] = [];
  companyOptions: Company[] = [];
  statusOptions: StatusMaster[] = [];
  
  TEAM_APPOINTMENT_STATUS_LEFT_WIHOUT_INFORMING = this.config.TEAM_APPOINTMENT_STATUS_LEFT_WIHOUT_INFORMING;

  get dialogTitle() { return `${this.contact.name} | New Appointment`; }
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }

  filteredManagerContacts$!: Observable<Contact[]>;
  constructor(@Inject(MAT_DIALOG_DATA) dialogData: any,
    private dialogRef: MatDialogRef<ContactTeamAppointmentCreateFormComponent>,
    private contactService: ContactApiService,
  )
  {
    this.contact = dialogData.contact;
    this.contactOptions = dialogData.contactOptions;
  }

  onClose(result: any)
  {
    this.dialogRef.close(result);
  }

  async ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }
    this.getStatusOptions();
    this.getTypeOptions();
    this.getCompanyOptions();
  }

  filteredContacts$!: Observable<Contact[]>;
  private buildForm()
  {
    this.form = this.formBuilder.group({
      typeFlag: new FormControl<any>(0, { nonNullable: true, validators: [Validators.required] }),
      statusFlag: new FormControl<any>(0, { nonNullable: true, validators: [Validators.required] }),
      designation: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      joiningDate: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      resignationDate: new FormControl<Date | undefined>(undefined),
      location: new FormControl<Date | undefined>(undefined),
      manValue: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required, Validators.minLength(1), Validators.maxLength(10)] }),
      companyID: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      managerContact: new FormControl<any>(null),
      description: new FormControl<any>(null),
      employeeCode: new FormControl<any>(null),
    });

    this.filteredManagerContacts$ = this.clientContactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      // switchMap(name => name ? this.getFilteredContacts(name as string) : of([])),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );

    this.f['statusFlag'].valueChanges.subscribe((value: number) => {
      if (value === this.TEAM_APPOINTMENT_STATUS_LEFT_WIHOUT_INFORMING) {
        this.f['description'].setValidators([Validators.required]);
      } else {
        this.f['description'].clearValidators();
      }
      this.f['description'].updateValueAndValidity();
    });

    this.touchForm();
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  contactOptions: Contact[] = [];
  async getContactOptions() {
    this.contactOptions = await firstValueFrom(this.contactService.getOptions([
      { key: 'appointmentStatusFlag', value: this.config.TEAM_APPOINTMENT_STATUS_APPOINTED.toString() },
    ]).pipe(map(data => data ? data.map((x: Contact) => x) : [])));
    console.log(this.contactOptions);
  }

  displayFnContact(option?: Contact): string
  {
    return option ? option.fullName : '';
  }

  private getFilteredContacts(search: string): Observable<Contact[]>
  {
    // console.log('getFilteredContacts', search);
    return this.contactService.getOptions([
      { key: 'appointmentStatusFlag', value: this.config.TEAM_APPOINTMENT_STATUS_APPOINTED.toString() },
    ], search).pipe(map(data => data ? data.map((x: Contact) => x) : []));
  }
  async getCompanyOptions()
  {
    this.companyOptions = await firstValueFrom(this.companyService.get())
    if (this.companyOptions && this.companyOptions.length !== 0)
    {
      this.f['companyID'].setValue(this.companyOptions[0].id, { emitEvent: false });
    }
  }

  async getTypeOptions()
  {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT }]));
    if (this.typeOptions && this.typeOptions.length !== 0)
    {
      this.f['typeFlag'].setValue(this.typeOptions[0].value, { emitEvent: false });
    }

  }

  async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT }]));
    if (this.statusOptions && this.statusOptions.length !== 0)
    {
      this.f['statusFlag'].setValue(this.statusOptions[0].value, { emitEvent: false });
    }
  }
  onSubmit()
  {
    if (this.form.invalid)
    {
      this.touchForm();
      // console.log(this.form.value);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    this.currentEntity.contactID = this.contact.id;
    this.currentEntity.managerContactID = this.f['managerContact'].value ? (this.f['managerContact'].value as Contact).id : undefined;
    const _messageText = "Create New Appointment";
    this.utilityService.showConfirmationDialog(_messageText,
      async () =>
      {
        this.currentEntity = await firstValueFrom(this.entityApiService.create(this.currentEntity));
        this.utilityService.showSwalToast('Success!', 'Save successful.');
        this.entityApiService.refreshList();
        this.onClose(this.currentEntity);
      }
    );
  }
}
