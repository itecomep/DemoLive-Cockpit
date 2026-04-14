import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { Company } from 'src/app/shared/models/company.model';
import { PresetMaster } from 'src/app/shared/models/preset-master';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact } from '../../models/contact';
import { ContactAppointment, ContactAppointmentAttachment } from '../../models/contact-appointment.model';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactAppointmentApiService } from '../../services/contact-appointment-api.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { ContactAppointmentAttachmentApiService } from '../../services/contact-appointment-attachment-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { McvTagEditorComponent } from '../../../mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ContactTeam, ContactTeamMember } from '../../models/contact-team.model';
import { ContactTeamMemberApiService } from '../../services/contact-team-member-api.service';

@Component({
    selector: 'app-contact-team-appointment-form',
    templateUrl: './contact-team-appointment-form.component.html',
    styleUrls: ['./contact-team-appointment-form.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatRadioModule,NgxMatSelectSearchModule, NgFor, MatFormFieldModule, MatButtonModule, MatTooltipModule, MatIconModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, MatAutocompleteModule, NgIf, McvFileUploadComponent, McvFileComponent, McvTagEditorComponent, AsyncPipe]
})
export class ContactTeamAppointmentFormComponent implements OnInit
{
  expectedPay: number = 0;
  preset: PresetMaster[] = [];
  companyCost: number = 0;
  contact!: Contact;
  teamFC: FormControl = new FormControl();
  contactOptions: Contact[] = [];
  teamOptions: ContactTeam[] = []; //Contains all the teams
  filteredTeamOptions:ContactTeam[]=[];  //Only the teams where user is not there
  currentEntity = new ContactAppointment();
  clientContactFC: FormControl = new FormControl<any>('');
  filteredManagerContacts$!: Observable<Contact[]>;

  TEAM_APPOINTMENT_STATUS_LEFT_WIHOUT_INFORMING = this.config.TEAM_APPOINTMENT_STATUS_LEFT_WIHOUT_INFORMING;

  @Input('config') set setConfigValue(value: {
    contact: Contact,
    appointment: ContactAppointment,
    contactOptions: Contact[],
    teamOptions: ContactTeam[]
  })
  {
    if (value)
    {
      this.contact = value.contact;
      this.currentEntity = value.appointment;
      this.contactOptions = value.contactOptions;
      this.teamOptions = value.teamOptions;
      this.filteredTeams();     
      this.buildForm();
    }
  }

  @Output() delete = new EventEmitter();
  @Output() update = new EventEmitter<ContactAppointment>();

  typeOptions: TypeMaster[] = [];
  companyOptions: Company[] = [];
  statusOptions: StatusMaster[] = [];
  form!: FormGroup;

  get f(): any
  {
    return this.form.controls;
  }

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }

  get isPermissionEdit(): boolean
  {
    return this.contactService.isPermissionAppointmentsEdit;
  }

  get isPermissionDelete(): boolean
  {
    return this.contactService.isPermissionAppointmentsDelete;
  }

  constructor(
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private contactService: ContactApiService,
    private appointmentsService: ContactAppointmentApiService,
    private companyAccountsService: CompanyApiService,
    private typeMasterService: TypeMasterService,
    private statusMasterService: StatusMasterService,
    private appSettingService: AppSettingMasterApiService,
    private contactAppointmentAttachmentService: ContactAppointmentAttachmentApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private config: AppConfig,
    private contactTeamMemberService: ContactTeamMemberApiService
  ) { }



  async ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }
    
    this.bindForm();
    this.getStatusOptions();
    this.getTypeOptions();
    this.getCompanyOptions();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
      {
        await this.appSettingService.loadPresets();
      }
    if (this.appSettingService.presets)
    {
      const _presetValue = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
      if (_presetValue)
      {
        this.blobConfigAppointment = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT}`
        );
      }
    }
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      typeFlag: new FormControl<any>(this.currentEntity.typeFlag, { nonNullable: true, validators: [Validators.required] }),
      designation: new FormControl<any>(this.currentEntity.designation, { nonNullable: true, validators: [Validators.required] }),
      joiningDate: new FormControl<any>(this.currentEntity.joiningDate, { nonNullable: true, validators: [Validators.required] }),
      resignationDate: new FormControl<any>(this.currentEntity.resignationDate),
      manValue: new FormControl<any>(this.currentEntity.manValue, { nonNullable: true, validators: [Validators.required, Validators.minLength(1), Validators.maxLength(10)] }),
      statusFlag: new FormControl<any>(this.currentEntity.statusFlag, { nonNullable: true, validators: [Validators.required] }),
      companyID: new FormControl<any>(this.currentEntity.companyID, { nonNullable: true, validators: [Validators.required] }),
      managerContact: new FormControl<any>(this.currentEntity.managerContact),
      location: new FormControl<any>(this.currentEntity.location),
      employeeCode: new FormControl<any>(this.currentEntity.employeeCode),
      description: new FormControl<any>(this.currentEntity.description),
    });

    this.filteredManagerContacts$ = this.clientContactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );

    this.f['manValue'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()).subscribe((value: any) =>
      {
        this.expectedPay = (value * 190 * this.companyCost);
      });

    this.f['statusFlag'].valueChanges.subscribe((value: number) => {
      if (value === this.TEAM_APPOINTMENT_STATUS_LEFT_WIHOUT_INFORMING) {
        this.f['description'].setValidators([Validators.required]);
      } else {
        this.f['description'].clearValidators();
      }
      this.f['description'].updateValueAndValidity();
    });       
  }

  bindForm(){
    const _clientContact = this.contactOptions.find(x => x.id == this.currentEntity.managerContactID);
    if (_clientContact) {
      this.f['managerContact'].setValue(_clientContact, { emitEvent: false });
    }
  }


  displayFnContact(option?: Contact): string
  {
    return option ? option.fullName : '';
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  reset()
  {
    this.currentEntity = new ContactAppointment();
    this.form.reset();
  }

  async getCompanyOptions()
  {
    this.companyOptions = await firstValueFrom(this.companyAccountsService.get())
    if (this.companyOptions && this.companyOptions.length !== 0 && this.f.companyID.value === null)
    {
      this.f['companyID'].setValue(this.companyOptions[0].id, { emitEvent: false });
    }
  }

  async getTypeOptions()
  {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT }]));
    if (this.typeOptions && this.typeOptions.length !== 0 && this.f.typeFlag.value === null)
    {
      this.f['typeFlag'].setValue(this.typeOptions[0].value, { emitEvent: false });
    }

  }

  async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT }]));
    if (this.statusOptions && this.statusOptions.length !== 0 && this.f.statusFlag.value === null)
    {
      this.f['statusFlag'].setValue(this.statusOptions[0].value, { emitEvent: false });
    }
  }

  async onSubmit()
  {

    if (this.form.invalid)
    {
      // console.log('Invalid form', this.form);
      Object.keys(this.form.controls).forEach(field =>
      {
        const control = this.form.get(field);
        if (control != null)
        {
          control.markAsTouched({ onlySelf: true });
        }
      });

      this.utilityService.showSwalToast('Incomplete Form',
        'Please enter valid data and try again.', 'error'
      );

      return;
    }

    this.currentEntity = Object.assign({}, this.currentEntity, this.form.getRawValue());
    this.currentEntity.contactID = this.contact.id;
    this.currentEntity.managerContactID = this.f['managerContact'].value ? (this.f['managerContact'].value as Contact).id : undefined;

    this.currentEntity = await firstValueFrom(this.appointmentsService.update(this.currentEntity));
    this.utilityService.showSwalToast('Success',
      'Appointment saved successfully.'
    );

    this.update.emit(this.currentEntity);
  }


  onDelete()
  {
    this.utilityService.showConfirmationDialog('You want to delete appointment. You will loose all the appointment related data.', async () =>
    {
      await firstValueFrom(this.appointmentsService.delete(this.currentEntity.id))
      this.utilityService.showSwalToast('Success', 'Deleted Successfully');

      this.delete.emit(this.currentEntity);
    });
  }

  // APPOINTMENT ATTACHMENTS
  blobConfigAppointment!: McvFileUploadConfig;
  async onDeleteAttachment(item: ContactAppointmentAttachment)
  {
    if (item)
    {
      this.currentEntity.attachments = this.currentEntity.attachments.filter(obj => obj.uid !== item.uid);
      await firstValueFrom(this.contactAppointmentAttachmentService.delete(item.id, true));
    }
  }

  onDownloadAttachment(item: any)
  {
    window.open(item.url);
  }

  getFilteredAttachments(attachments: ContactAppointmentAttachment[], typeFlag: number, isMedia: boolean)
  {
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }

  async onTagsUpdate(tags: string[], attachment: ContactAppointmentAttachment)
  {
    if (tags)
    {
      attachment.searchTags = tags;
      await firstValueFrom(this.contactAppointmentAttachmentService.update(attachment));
    }
  }

  async onUploadAppointment(uploads: UploadResult[])
  {
    // console.log('attachments', uploads);
    let _createRequests: Observable<any>[] = [];
    uploads.forEach(x =>
    {
      let obj = new ContactAppointmentAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.contactAppointmentID = this.currentEntity.id;
      obj.container = this.blobConfigAppointment.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;

      _createRequests.push(this.contactAppointmentAttachmentService.create(obj));
    });

    const results = await firstValueFrom(forkJoin(_createRequests));
    this.currentEntity.attachments.push(...results);
  }

  attachmentTagOptions: any[] = [];
  private async getSearchAttachmentTagOptions()
  {
    this.attachmentTagOptions = await firstValueFrom(this.contactAppointmentAttachmentService.getSearchTagOptions());
  }

  filteredTeams() {
    this.filteredTeamOptions = this.teamOptions.filter(team =>
      !team.members.some(y => y.contactID === this.currentEntity.contactID)
    );
  }

  isMemberInTeam(team: any, contactID: number): boolean {
    return team.members?.some((member: any) => member.contactID === contactID);
  }

  //Remove Team Member
  async onRemoveMember(team: ContactTeam,) {
    // console.log(team);
    this.utilityService.showConfirmationDialog(`Do you want to remove ${this.contact.fullName} from ${team.title} team?`, async () => {
      const _member = team.members.find(x => x.contactID == this.currentEntity.contactID);
      if (_member) {
        await firstValueFrom(this.contactTeamMemberService.delete(_member.id));
        team.members = team.members.filter(x => x.contactID !== this.currentEntity.contactID);
        this.filteredTeamOptions.push(team);
        this.utilityService.showSwalToast('', 'Team Member removed!!', 'success');
        this.teamFC.reset();
      }
    });
  }
  
  //Add Team Member
  onSelectTeam(event: MatSelectChange) {
    // console.log(event); 
    const _team = event.value;
    this.utilityService.showConfirmationDialog(`Do you want to add ${this.contact.fullName} in ${_team.title} team?`, async () => {
      let member = new ContactTeamMember({
        contactID: this.currentEntity.contactID,
        contactTeamID: _team?.id,
      });
      const _member = await firstValueFrom(this.contactTeamMemberService.create(member));
      // console.log(_member);
      if (_member) {
        const team = this.filteredTeamOptions.find(x => x.id == _member.contactTeamID);
        if (team) {
          team.members.push(_member);
          this.utilityService.showSwalToast('', 'Team Member added!!', 'success');
          this.teamFC.reset();
        }
      }
    });
    this.teamFC.reset();
  }
}
