import { Component, effect, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo, TodoAttachment } from '../../models/todo.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { Contact } from 'src/app/contact/models/contact';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, ObservableInput, of, switchMap } from 'rxjs';
import { Project, ProjectAttachment } from 'src/app/project/models/project.model';
import { TodoAgenda } from '../../models/todo-agendaas';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { TodoAgendaApiService } from '../../services/todo-agenda-api.service';
import { TodoApiService } from '../../services/todo-api.service';
import { TodoAttachmentApiService } from '../../services/todo-attachment-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { TodoAgendaComponent } from '../todo-agenda/todo-agenda.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubTodoDialogComponent } from '../sub-todo-dialog/sub-todo-dialog.component';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectAttachmentApiService } from 'src/app/project/services/project-attachment-api.service';
import { TodoDmsFolderNavigatorComponent } from '../todo-dms-folder-navigator/todo-dms-folder-navigator.component';
import { FilterPipe } from "src/app/shared/pipes/filter.pipe";


@Component({
  selector: 'app-todo-create-dialog',
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
    MatTooltipModule,
      FilterPipe,  

    //Components
    McvFileComponent,
    McvFileUploadComponent,
    TodoAgendaComponent,
    SubTodoDialogComponent,
    TodoDmsFolderNavigatorComponent
  ],
  templateUrl: './todo-create-dialog.component.html',
  styleUrls: ['./todo-create-dialog.component.scss']
})
export class TodoCreateDialogComponent implements OnInit {

  form!: FormGroup;
  teams: ContactTeam[] = [];
  selectedProject!: any;
  currentEntity: Todo = new Todo();
  subTodos: Todo[] = [];
  isSubtodos: boolean = false;
  blobConfig!: McvFileUploadConfig;
  minutesGap = 5;
  timePickerMinutesGap = 5;
  treeData: ProjectAttachment[] = [];
  subjectOptions: any[] = [];
  projectOptions: any[] = [];
  contactOptions: Contact[] = [];
  projectFiles: ProjectAttachment[] = [];
  stageTree: any[] = [];
expandedCategory: string | null = null;
checklistSearch: string = '';


  selectedAssignee: Contact | null = null;
  nameOfEntity = this.config.NAMEOF_ENTITY_TODO;
  project!: Project;
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
  filesToUpload: UploadResult[] = [];

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialogRef<TodoCreateDialogComponent>,
    private formBuilder: FormBuilder,
    private config: AppConfig,
    private authService: AuthService,
    private wfTaskService: WFTaskApiService,
    private utilityService: UtilityService,
    private todoApiService: TodoApiService,
    private projectService: ProjectApiService,
    private projectAttachmentService: ProjectAttachmentApiService,
    private contactService: ContactApiService,
    private agendaService: TodoAgendaApiService,
    private attachmentService: TodoAttachmentApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private appSettingService: AppSettingMasterApiService,
    private matDialog: MatDialog,
    private teamService: ContactTeamApiService,
  ) {
    if (data) {
      console.log(data);
      this.currentEntity = data.todo;
      if (!this.form) {
        this.buildForm();
      }

      this.bindForm(this.currentEntity);
    } else {
      if (!this.form) {
        this.buildForm();
      }
    }


    //Detects if there are any copied files from DMS
    effect(() => {
      console.log("Copied Files Updated:", this.todoApiService.copied);
      if (this.todoApiService.copied.length > 0) {
        const _newFile: any = this.todoApiService.copied[this.todoApiService.copied.length - 1];
        const fileExists = this.filesToUpload.some(file => file.url === _newFile.url);

        if (!fileExists) {
          this.filesToUpload.push(new UploadResult(_newFile.url, _newFile.filename, _newFile.size, _newFile.contentType, _newFile.blobPath));
        }
      }
    });
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }

    this.teams = await firstValueFrom(this.teamService.get());
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

    this.loadStageTree();


  }



            //changes from here //

  loadStageTree() {
  this.todoApiService.getStageTree().subscribe((res: any) => {
    this.stageTree = res;
  });
}

toggleCategory(category: any) {
  this.expandedCategory =
    this.expandedCategory === category.title ? null : category.title;
}

onChecklistSelect(event: any, item: any, category: any, stage: any) {
  const combinedTitle = `${stage.title} -> ${category.title}: ${item.title}`;

  if (event.target.checked) {
    const obj = new TodoAgenda();
    obj.title = combinedTitle;

    if (!this.currentEntity.agendas.some(x => x.title === combinedTitle)) {
      this.currentEntity.agendas.push(obj);
    }
  } else {
    this.currentEntity.agendas =
      this.currentEntity.agendas.filter(x => x.title !== combinedTitle);
  }

  this.setAgendaConfig();
}

isChecklistSelected(item: any, category: any, stage: any): boolean {
  const combinedTitle = `${stage.title} -> ${category.title}: ${item.title}`;
  return this.currentEntity.agendas.some(x => x.title === combinedTitle);
}

onSelectAllCategory(event: any, category: any, stage: any) {
  if (event.target.checked) {
    category.checklists.forEach((item: any) => {
      const combinedTitle = `${stage.title} -> ${category.title}: ${item.title}`;

      if (!this.currentEntity.agendas.some(x => x.title === combinedTitle)) {
        const obj = new TodoAgenda();
        obj.title = combinedTitle;
        this.currentEntity.agendas.push(obj);
      }
    });
  } else {
    const prefix = `${stage.title} -> ${category.title}: `;
    this.currentEntity.agendas =
      this.currentEntity.agendas.filter(x => !x.title.startsWith(prefix));
  }

  this.setAgendaConfig();
}



                    //till here //








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

  async onProjectSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedProject = event;
    this.todoApiService.clearCopied();
    this.buildTodoDMS();
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
    console.log(this.currentEntity.attachments, this.uploadQueue);

  }

  private uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new TodoAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.todoID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.attachmentService.create(obj));
    });
    this.uploadQueue = [];

    forkJoin(_createRequests).subscribe((results: any) => {
      results.forEach((x: any) => {
        this.currentEntity.attachments.push(x as TodoAttachment);
      })
      this.todoApiService.refreshList();
    });
  }

  onClose() {
    if (this.subTodos.length > 0) {
      this.utilityService.showConfirmationDialog('Are you sure you want to close this dialog? All SubTodos will be deleted.', () => {
        this.dialog.close();
      });
    } else {
      this.dialog.close();
    }
    this.todoApiService.clearCopied();
  }

  async getContactOptions() {
    if (!this.authService.isRoleMaster
      && this.authService.currentUserStore?.teams
      && this.authService.currentUserStore?.teams.length > 0) {
      if (!this.todoApiService.isPermissionSpecialShowAll) {
        //Checks for current team only
        this.contactFilter.push(...this.authService.currentUserStore?.teams.map(x => new ApiFilter({ key: 'teamID', value: x.id.toString() })));
      }
    }
    this.contactOptions = await firstValueFrom(this.contactService.get(this.contactFilter, '', 'fullName'));

    const _isTeamLeader = this.teams.find(x => x.leaderID == this.authService.currentUserStore?.contact.id);
    if (_isTeamLeader) {

      const leaders: Contact[] = this.teams
        .map(team => team.members.find(member => member.contactID === team.leaderID)?.contact)
        .filter((contact): contact is Contact => contact !== undefined);

      if (leaders.length > 0) {
        this.contactOptions.push(...leaders);
      }
      // console.log(this.contactOptions);
    }
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
            // console.log('get project', data, this.projectOptions);
            this.f['title'].setValue(data);
          });
        } else {
          // console.log('from options', _project);
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
    this.attachmentService.update(file).subscribe((data: any) => {
      file = Object.assign({}, file);
    });
  }

  onAssigneeSelect(item: Contact) {
    if (item && item.id) {
      this.selectedAssignee = item;
    }
  }

  onDeleteAttachment(item: any, index: number) {
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.uid !== item.uid);
    this.uploadQueue.splice(index, 1);
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
    // console.log(event);
    this.currentEntity.agendas = event;
  }

  onSubmit(task?: WFTask) {
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
    this.currentEntity.dueDate = this.utilityService.setTimeValue(this.f['dueDate'].value, this.f['dueTime'].value);
    this.currentEntity.comment = this.f['comment'].value;
    this.currentEntity.mHrAssigned = this.f['mHrAssigned'].value;
    this.currentEntity.priority = this.f['priority'].value;

    this.todoApiService.create(this.currentEntity).subscribe(
      (data: any) => {
        if (data) {
          this.utilityService.showSwalToast(
            'Success!',
            'Save successful.',
          );
          if (this.currentEntity.agendas.length) {
            const requests: ObservableInput<any>[] = [];
            this.currentEntity.agendas.forEach(agenda => {
              agenda.todoID = data.id;
              requests.push(this.agendaService.create(agenda))
            });
            forkJoin(requests).subscribe(console.log);
          }

          this.currentEntity = data;
          if (this.uploadQueue.length) {
            this.uploadFiles();
          } else {
            // this.entityService.refreshList();
          }

          if (this.subTodos.length > 0) {
            this.createSubTodos(this.currentEntity.id);
          }
          this.wfTaskService.refreshList();
          this.todoApiService.clearCopied();
          this.dialog.close(this.currentEntity);
        }
      }
    );

    if (this.subTodos.length > 0) {
      this.subTodos.forEach(x => {

      });
    }
  }

  //The below code is for sub-todos

  onCreateSubTodo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'mcv-fullscreen-dialog';

    const _dialogRef = this.matDialog.open(SubTodoDialogComponent, dialogConfig);
    _dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.subTodos.push(result);
        console.log(this.subTodos);
        this.utilityService.showSwalToast('Success!', 'Sub-todo added successfully.');
      }
    });
  }

  onDeleteSubTodoAttachment(index: number, file: TodoAttachment) {
    this.subTodos[index].attachments = this.subTodos[index].attachments.filter(x => x.uid !== file.uid);
  }

  onEditSubTodo(todo: Todo, index: number) {
    if (index > -1) {
      let _todo = this.subTodos[index];
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        todo: _todo
      };

      const _dialogRef = this.matDialog.open(SubTodoDialogComponent, dialogConfig);
      _dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          if (result && result.isUpdate) {
            let _index = this.subTodos.findIndex(x => x.id == result.id);
            if (_index > -1) {
              this.subTodos[_index] = result;
              this.utilityService.showSwalToast('Success!', 'Update successful.');
            }
          } else {
            this.subTodos.push(result);
          }
        }
      });
    }
  }

  onDeleteSubTodo(todo: Todo, index: number) {
    this.utilityService.showConfirmationDialog('Are you sure you want to delete this sub-todo?', () => {
      if (index > - 1) {
        this.subTodos.splice(index, 1);
      }
    });
  }

  async createSubTodos(parentID: number) {
    for (const subTodo of this.subTodos) {
      const todoID = await this.createSubTodo(parentID, subTodo);

      const attachmentObservables = subTodo.attachments.map(attachment => {
        attachment.todoID = todoID;
        return this.attachmentService.create(attachment);
      });
      subTodo.attachments = await firstValueFrom(forkJoin(attachmentObservables));

      const agendaObservables = subTodo.agendas.map(agenda => {
        agenda.todoID = todoID;
        return this.agendaService.create(agenda);
      });
      subTodo.agendas = await firstValueFrom(forkJoin(agendaObservables));
    }
  }

  async createSubTodo(parentID: number, todo: Todo): Promise<number> {
    // try {
    todo.parentID = parentID;
    const createdTodo = await firstValueFrom(this.todoApiService.create(todo));
    return createdTodo.id;
    // } catch (error) {
    //   console.error('Error creating sub-todo:', todo, error);
    //   throw error;
    // }
  }

  assigneToContact(contactID: number) {
    const _contact = this.contactOptions.find(x => x.id == contactID);
    if (_contact) {
      return _contact;
    } return new Contact;
  }

  getTreeMapFromList(data: ProjectAttachment[]): ProjectAttachment[] {
    // Create a map to store references to each item by ID
    const idMapping = data.reduce((acc: Record<number, number>, el, i) => {
      acc[el.id] = i;
      return acc;
    }, {});

    // Clone the data to avoid mutating the original array
    const _list = data.map(item => ({ ...item, children: [] as ProjectAttachment[], level: 0 }));

    const roots: ProjectAttachment[] = [];

    _list.forEach(el => {
      // Check if it's a root element
      if (el.parentID === null || el.parentID === undefined) {
        el.level = 0; // Root level
        roots.push(new ProjectAttachment(el));
        return;
      }

      // Locate the parent element
      const parentIndex = idMapping[el.parentID];
      if (parentIndex !== undefined) {
        const parentEl = _list[parentIndex];
        el.level = parentEl.level + 1; // Increment level based on parent
        parentEl.children!.push(new ProjectAttachment(el));
      }
    });

    return roots;
  }

  async buildTodoDMS() {
    this.projectFiles = await firstValueFrom(this.projectAttachmentService.get([{ key: 'projectid', value: this.selectedProject.id.toString() }]))
    this.projectFiles.sort((a, b) => a.filename.localeCompare(b.filename));
    this.treeData = this.getTreeMapFromList(this.projectFiles);
  }

  onOpenTodoDMS() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      treeData: this.treeData,
      projectID: this.selectedProject
    }

    const _dialogRef = this.matDialog.open(TodoDmsFolderNavigatorComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res == undefined) {
        this.onUpload(this.filesToUpload);
        this.filesToUpload = [];
      }
    });
  }
}
