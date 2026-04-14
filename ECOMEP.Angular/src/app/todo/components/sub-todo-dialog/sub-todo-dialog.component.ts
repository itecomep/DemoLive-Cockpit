import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo, TodoAttachment } from '../../models/todo.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { Contact } from 'src/app/contact/models/contact';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, ObservableInput, of, switchMap } from 'rxjs';
import { Project } from 'src/app/project/models/project.model';
import { TodoAgenda } from '../../models/todo-agendaas';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TodoAgendaApiService } from '../../services/todo-agenda-api.service';
import { TodoApiService } from '../../services/todo-api.service';
import { TodoAttachmentApiService } from '../../services/todo-attachment-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { TodoAgendaComponent } from '../todo-agenda/todo-agenda.component';

@Component({
  selector: 'app-sub-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,

    //Components
    McvFileComponent,
    McvFileUploadComponent,
    TodoAgendaComponent,
  ],
  templateUrl: './sub-todo-dialog.component.html',
  styleUrls: ['./sub-todo-dialog.component.scss']
})
export class SubTodoDialogComponent implements OnInit {

  form!: FormGroup;
  selectedProject!: any;
  currentEntity: Todo = new Todo();
  subTodos: Todo[] = [];
  isSubtodos: boolean = false;
  subTodoUpdate: boolean = false;
  blobConfig!: McvFileUploadConfig;
  minutesGap = 5;
  timePickerMinutesGap = 5;
  subjectOptions: any[] = [];
  projectOptions: any[] = [];
  contactOptions: Contact[] = [];
  selectedAssignee: Contact | null = null;
  nameOfEntity = this.config.NAMEOF_ENTITY_TODO;

  filteredSubjects$!: Observable<string[]>;
  filteredContacts$!: Observable<Contact[]>;
  filteredProjects$!: Observable<Project[]>;
  titleTypeOptions: string[] = ['Project', 'Custom'];
  priorityOptions: string[] = ['HIGH', 'NORMAL', 'LOW'];
  contactFilter = [{ key: 'usersOnly', value: 'true' }];
  projectFilter = [
    { key: 'statusFlag', value: this.projectService.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'statusFlag', value: this.projectService.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() }
  ];

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialogRef<SubTodoDialogComponent>,
    private formBuilder: FormBuilder,
    private config: AppConfig,
    private authService: AuthService,
    private utilityService: UtilityService,
    private todoApiService: TodoApiService,
    private projectService: ProjectApiService,
    private contactService: ContactApiService,
    private attachmentService: TodoAttachmentApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private appSettingService: AppSettingMasterApiService  ) {
    if (data) {
      // console.log(data);
      this.currentEntity = data.todo;
      this.subTodoUpdate = true;4

      const _filter: ApiFilter[] = [{ key: 'id', value: this.currentEntity.projectID ? this.currentEntity.projectID.toString() : '0' }];
      this.selectedProject = this.projectService.get(_filter);

      if (!this.form) {
        this.buildForm();
      }

      this.bindForm(this.currentEntity);
    } else {
      if (!this.form) {
        this.buildForm();
      }
    }
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }

    this.setAgendaConfig();

    this.f['assignee'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.onAssigneeSelect(value);
      }
    });

    this.filteredContacts$ = this.f['assignee'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),

    );

    this.f['titleType'].valueChanges
      .pipe(debounceTime(400))
      .subscribe(
        (value: any) => {
          if (value) {
            this.f['title'].reset();
          }
        }
      );

    this.filteredProjects$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getProjectOptions(name as string) : of([])),
    );

    this.filteredSubjects$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? this.filterTitleOptions(value as string) : this.subjectOptions.slice()),
    );

    this.f['title'].valueChanges
      .pipe(debounceTime(400))
      .subscribe(
        (value: any) => {
          if (value) {

            if (typeof value === 'string') {
              this.currentEntity.title = value;
              this.currentEntity.entity = '';
              this.currentEntity.entityID = 0;
            } else {
              this.currentEntity.title = value.code + '-' + value.title;
              this.currentEntity.entity = this.config.NAMEOF_ENTITY_PROJECT;
              this.currentEntity.entityID = value.id;
              this.currentEntity.projectID = value.id;
            }
          }
        }
      );

    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset) {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }
    await this.getContactOptions();
    await this.getTitleOptions();
    if (!this.authService.isRoleMaster
      && !this.projectService.isPermissionSpecialShowAll
      && this.authService.currentUserStore?.teams
      && this.authService.currentUserStore?.teams.length > 0) {
      this.projectFilter.push(...this.authService.currentUserStore?.teams.map(x => new ApiFilter({ key: 'teamID', value: x.id.toString() })));
    }
    // await this.getProjectOptionsList();
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }

  displayFnProject(option?: any): string {
    return option ? (option.code + '-' + option.title) : '';
  }

  displayFnTitle(option?: any): string {
    return option ? option : '';
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  onProjectSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedProject = event;
  }

  private getProjectOptions(search: string): Observable<string[]> {

    return this.projectService.getPages(0, 20, this.projectFilter, search)
      .pipe(map(data => data ? data.list.map((x: Project) => x) : []));
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    //Creating a dummy object
    uploads.forEach(x => {
      let obj = new TodoAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.todoID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.currentEntity.typeFlag;
      obj.url = x.url;
      this.currentEntity.attachments.push(obj);
      this.uploadQueue.push(x);
    });
  }

  onClose() {
    this.dialog.close();
  }

  async getContactOptions() {
    if (!this.authService.isRoleMaster
      && !this.contactService.isPermissionSpecialShowAll
      && this.authService.currentUserStore?.teams
      && this.authService.currentUserStore?.teams.length > 0) {
      this.contactFilter.push(...this.authService.currentUserStore?.teams.map(x => new ApiFilter({ key: 'teamID', value: x.id.toString() })));
    }
    this.contactOptions = await firstValueFrom(this.contactService.get(this.contactFilter, '', 'fullName'));
  }

  async getTitleOptions() {
    this.subjectOptions = await firstValueFrom(this.todoApiService.getFieldOptions('Title'));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      assignee: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      titleType: new FormControl<any>(null),
      title: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      subTitle: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      priority: new FormControl<any>('NORMAL', { nonNullable: true, validators: [Validators.required] }),
      dueDate: new FormControl<any>(new Date, { nonNullable: true, validators: [Validators.required] }),
      dueTime: new FormControl<any>(null),
      comment: new FormControl<any>(null),
      mHrAssigned: new FormControl<any>(1, { nonNullable: true, validators: [Validators.required, Validators.min(0.5)] })
    });

    this.f['titleType'].setValue('Project');

    this.f['mHrAssigned'].setValue(1);
    this.f['dueDate'].setValue(new Date(), { emitEvent: false });
    this.f['dueTime'].setValue(this.utilityService.getTimeValue(new Date(), this.minutesGap), { emitEvent: false });

    this.touchForm();
  }

  bindForm(entity: Todo) {
    if (entity) {
      if (entity.assignee) {
        this.f['assignee'].setValue(entity.assignee);
      }

      this.f['titleType'].setValue(entity.projectID ? 'Project' : 'Custom');
      if (entity.projectID) {
        const _project = this.projectOptions.find(x => x.id == entity.projectID);
        if (!_project) {

          this.projectService.getById(entity.projectID).subscribe((data: Project) => {

            this.projectOptions.push(data);
            this.f['title'].setValue(data);
          });
        } else {
          this.f['title'].setValue(_project);
        }
      } else {
        this.f['title'].setValue(entity.title, { emitEvent: false });
      }

      this.f['subTitle'].setValue(entity.subTitle);
      this.f['dueDate'].setValue(entity.dueDate);
      this.f['dueTime'].setValue(this.utilityService.getTimeValue(entity.dueDate, this.timePickerMinutesGap));

      if (entity.comment) {
        this.f['comment'].setValue(entity.comment);
      }
      this.f['mHrAssigned'].setValue(entity.mHrAssigned);
    }

  }

  touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  private filterTitleOptions(property: string): any[] {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  onAddAttachmentTag(tags: string[], file: TodoAttachment) {
    file.searchTags = tags;
    this.attachmentService.update(file).subscribe(() => {
      file = Object.assign({}, file);
    });
  }

  onAssigneeSelect(item: Contact) {
    if (item && item.id) {
      this.selectedAssignee = item;
    }
  }

  onDeleteAttachment(item: any) {
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.uid !== item.uid);
  }

  getFilteredAttachments(attachments: TodoAttachment[], typeFlag: number, isMedia: boolean) {
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }

  agendaConfig: any;
  private setAgendaConfig() {
    this.agendaConfig = {
      isReadOnly: false,
      todo: this.currentEntity,
      agenda: this.currentEntity.agendas,
      updateDatabase: false,
      isCheckboxMode: false
    };
  }

  onAgendaUpdate(event: TodoAgenda[]) {
    this.currentEntity.agendas = event;
  }

  onSubmit() {
    if (!this.currentEntity.title || this.currentEntity.title.length === 0) {
      this.utilityService.showSweetDialog('title is blank!',
        'Please enter a valid title and try again!', 'error'
      );
      return;
    }

    if (this.f['titleType'].value == 'Project' && !this.selectedProject) {
      {
        this.utilityService.showSwalToast('Incomplete Data',
          'Please select project from the list.', 'error'
        );
        return
      }
    }

    if (!this.f['assignee'].value) {
      this.utilityService.showSweetDialog('Assignee not selected!',
        'Please select a contact from the list as assignee and try again!', 'error'
      );
      return;
    }

    if (this.authService.currentUserStore) {
      this.currentEntity.assignerContactID = this.authService.currentUserStore.contact.id;
    }

    this.currentEntity.subTitle = this.f['subTitle'].value;
    this.currentEntity.assigneeContactID = this.f['assignee'].value ? (this.f['assignee'].value as Contact).id : 0;
    if(this.selectedAssignee){
      this.currentEntity.assignee = this.selectedAssignee;
    }
    this.currentEntity.dueDate = this.utilityService.setTimeValue(this.f['dueDate'].value, this.f['dueTime'].value);
    this.currentEntity.comment = this.f['comment'].value;
    this.currentEntity.mHrAssigned = this.f['mHrAssigned'].value;
    this.currentEntity.priority = this.f['priority'].value;

    if(this.subTodoUpdate){
      this.dialog.close({todo: this.currentEntity, isUpdate:true});
      this.subTodoUpdate = false;
    }else{
      this.dialog.close(this.currentEntity);
    }
  }
}

