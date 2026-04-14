import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime, distinctUntilChanged, firstValueFrom, map, Observable } from 'rxjs';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { WFTask } from '../../models/wf-task.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatIconModule } from '@angular/material/icon';
import { RequestTicketAssignee } from 'src/app/request-ticket/models/request-ticket-assignee';
import { EmailContact } from 'src/app/shared/models/email-contact';
import { Contact, ContactAttachment } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { MatButtonModule } from '@angular/material/button';
import { RequestTicket, RequestTicketAttachment } from 'src/app/request-ticket/models/request-ticket';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { Project } from 'src/app/project/models/project.model';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';

@Component({
  selector: 'app-wf-task-todo-request-ticket-action',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    McvFileUploadComponent,
    McvFileComponent
  ],
  templateUrl: './wf-task-todo-request-ticket-action.component.html',
  styleUrls: ['./wf-task-todo-request-ticket-action.component.scss']
})
export class WfTaskTodoRequestTicketActionComponent {

  task!: WFTask;
  form!: FormGroup;
  project!: Project;
  assigneeFC = new FormControl();
  projectStages: string[] = [
    'Approval Stage',
    'Concept Stage',
    'Design Detail Stage',
    'Tender Stage',
    'Construction Stage',
    'Procurement & Installation Stage',
  ];
  currentEntity: RequestTicket = new RequestTicket();
  emailContactOptions: EmailContact[] = [];
  filteredContacts$!: Observable<EmailContact[]>;
  selectedAssignees: RequestTicketAssignee[] = [];
  filteredSubjectOptions$!: Observable<any>;
  purposeOptions: { purpose: string; message: string }[] = [];
  subjectTypeOptions: string[] = [this.config.NAMEOF_ENTITY_PROJECT];
  authorityOptions: string[] = ['MOEF', 'CFO', 'M&E', 'LOI/IOD/IOA', 'Others'];
  blobConfig!: McvFileUploadConfig;
  nameOfEntity = this.config.NAMEOF_ENTITY_REQUEST_TICKET;
  readonly DEFAULT_REPEAT_INTERVAL = 7;

  readonly REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO = this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO;
  readonly REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC = this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC;
  readonly REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC = this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC;

  get toList() {
    return this.selectedAssignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO);
  }
  get ccList() {
    return this.selectedAssignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC);
  }
  get bccList() {
    return this.selectedAssignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC);
  }

  @Input('task') set taskValue(value: WFTask) {
    if (value) {
      this.task = value;
      if (this.task.projectID) {
        this.getProject();
        if (!this.form) {
          this.buildForm();
        }
        this.getEmailContactOptions();
        const purposeOptionSettings = this.appSettingService.presets
          .find(x => x.presetKey == this.config.PRESET_REQUEST_TICKET_PURPOSE_OPTIONS);
        if (purposeOptionSettings) {
          this.purposeOptions = JSON.parse(purposeOptionSettings.presetValue);
        }
      }
    }
  }

  @Output() update = new EventEmitter<any>();

  constructor(
    private config: AppConfig,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private contactService: ContactApiService,
    private projectService: ProjectApiService,
    private appSettingService: AppSettingMasterApiService,
  ) { }


  get f(): any { return this.form.controls; }

  get isMobileView(): boolean {
    return this.utilityService.isMobileView;
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  ngOnInit(): void {
    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset)
    {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }
  }

  dateFilter = (d: Date | null): boolean => {
    const today = (d || new Date());
    const date = new Date();
    date.setDate(date.getDate() - 1);

    if (today < date) {
      return false;
    }
    return true;
  }

  onDeleteAssignee(assignee: RequestTicketAssignee) {
    if (assignee) {
      this.currentEntity.assignees = this.currentEntity.assignees.filter(x => x.contactID !== assignee.contactID);
      this.selectedAssignees = this.selectedAssignees.filter(x => x.contactID !== assignee.contactID);
      this.update.emit(this.currentEntity);
    }
  }

  onPurposeChange(purposeData: MatSelectChange) {
    const _getMessage = this.purposeOptions.find(x => x.purpose == purposeData.value);
    if (_getMessage) {
      this.f['requestMessage'].setValue(_getMessage.message);
    }
  }

  private getEmailContactOptions() {
    this.contactService.getEmailOptions([], '', 'fullName').subscribe(data => this.emailContactOptions = data);
  }

  private async getProject(){
    const _project = await firstValueFrom(this.projectService.get([{key: 'id', value: this.task.projectID.toString()}]));
    this.project = _project[0];
  }

  onSelectContact(typeFlag: number = 0) {
    if (!this.assigneeFC.value || !this.assigneeFC.value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a person and try again!', 'error');
      return;
    }

    let _assignee = new RequestTicketAssignee();
    _assignee.contactID = this.assigneeFC.value.id;
    _assignee.typeFlag = typeFlag;
    _assignee.name = (this.assigneeFC.value as EmailContact).name;
    _assignee.email = (this.assigneeFC.value as EmailContact).email;
    _assignee.company = (this.assigneeFC.value as EmailContact).company;

    this.assigneeFC.reset();
    this.selectedAssignees.push(_assignee);
    this.currentEntity.assignees = this.selectedAssignees;
    this.update.emit(this.currentEntity);
  }

  displayFnContact(option?: EmailContact): string {
    return option ? (`${option.name} | ${option.email}`) : '';
  }

  displayFnSubject(option?: any): string {
    return option ? option : '';
  }

  buildForm() {
    this.form = this.formBuilder.group({
      subjectType: new FormControl<any>(this.subjectTypeOptions[0], { validators: [Validators.required] }),
      project: new FormControl<any>(null),
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      subtitle: new FormControl<any>(null),
      purpose: new FormControl<any>(null, { validators: [Validators.required] }),
      requestMessage: new FormControl<any>(null, { validators: [Validators.required] }),
      nextReminderDate: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      reminderInterval: new FormControl<any>(null, { validators: [Validators.required] }),
      isRepeatRequired: new FormControl<boolean>(false),
      stageTitle: new FormControl<any>(null),
      revision: new FormControl<any>(0),
      authority: new FormControl<any>(null),
    });

    let message = `Dear Sir/Madam,`;

    const _reminderInterval = this.DEFAULT_REPEAT_INTERVAL;
    const _nextDate = new Date();
    _nextDate.setDate(_nextDate.getDate() + _reminderInterval);
    this.f['nextReminderDate'].setValue(_nextDate, { emitEvent: false });
    this.f['reminderInterval'].setValue(_reminderInterval, { emitEvent: false });
    this.f['requestMessage'].setValue(message, { emitEvent: false });
    this.f['purpose'].setValue('Information', { emitEvent: false });

    this.f['subjectType'].setValue(this.subjectTypeOptions[0]);

    this.filteredContacts$ = this.assigneeFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.emailContactOptions.slice()),

    );

    this.form.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        if (value) {
          // console.log(value);
          // console.log(this.selectedAssignees);
          this.currentEntity = new RequestTicket();
          this.currentEntity = Object.assign(this.currentEntity, value);
          this.currentEntity.title = this.project.title;
          this.currentEntity.projectID = this.project.id;
          this.currentEntity.assignees = Object.assign([], this.selectedAssignees);
          this.update.emit(this.currentEntity);
        }
      });
  }

  private filterContacts(property: string): any[] {
    return this.emailContactOptions.filter(option => {
      return option ?
        (option.name.toLowerCase().includes(property.toLowerCase())
          || option.email.toLowerCase().includes(property.toLowerCase())
        )
        : false;
    });
  }

  onCheckboxValue(cbValue: MatCheckboxChange) {
    // this.currentEntity.isRepeatRequired = cbValue.checked;
    if (cbValue.checked) {
      this.f['nextReminderDate'].enable();
      this.f['reminderInterval'].enable();
      this.f['nextReminderDate'].setValidators([Validators.required]);
      this.f['reminderInterval'].setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.f['nextReminderDate'].clearValidators();
      this.f['reminderInterval'].clearValidators();
      this.f['nextReminderDate'].disable();
      this.f['reminderInterval'].disable();
      this.f['reminderInterval'].setValue(7, { emitEvent: false });
    }
  }



  onUpload(attachment:any){
    attachment.forEach((x:any) => {
      let obj = new RequestTicketAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      // obj.requestTicketID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.currentEntity.typeFlag;
      obj.url = x.url;
      this.currentEntity.attachments.push(obj);
      this.update.emit(this.currentEntity);
      // this.uploadQueue.push(x);
    });
  }

  onDeleteAttachment(item: RequestTicketAttachment) {
    console.log(this.currentEntity.attachments);
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.uid !== item.uid);
  }

}
