import { Injectable, signal } from "@angular/core";
import { Observable, of } from "rxjs";

import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

import { Todo } from "../models/todo.model";
import { DynamicInputBase } from "src/app/shared/models/dynamic-input-base";
import { McvComponentDialogConfig } from "src/app/shared/models/mcv-component-dialog-config";
import { TodoDuplicateDialogComponent } from "../components/todo-duplicate-dialog/todo-duplicate-dialog.component";
import { ProjectAttachment } from "src/app/project/models/project.model";
import { ApiFilter } from "src/app/shared/models/api-filters";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TodoApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiTodoes;
  constructor()
  {
    super();
  }

  get TODO_STATUS_FLAG_ACTIVE() { return this.config.TODO_STATUS_FLAG_ACTIVE; }
  get TODO_STATUS_FLAG_COMPLETED() { return this.config.TODO_STATUS_FLAG_COMPLETED; }
  get TODO_STATUS_FLAG_DROPPED() { return this.config.TODO_STATUS_FLAG_DROPPED; }

  startFlow(id: number): Observable<any>
  {
    return this.http.get<any>(this.apiRoute + '/startflow/' + id);
  }


  override get isPermissionList(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.TODO_LIST]);
  }

  override get isPermissionSpecialEdit(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.TODO_SPECIAL_EDIT]);
  }

  override get isPermissionSpecialDelete(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.TODO_SPECIAL_DELETE]);
  }

  override get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TODO_EDIT, this.permissions.TODO_SPECIAL_EDIT
    ]);
  }

  override get isPermissionDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TODO_DELETE, this.permissions.TODO_SPECIAL_DELETE
    ]);
  }
  override get isPermissionSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TODO_SPECIAL_SHOW_ALL
    ]);
  }

  get isPermissionTodoMediaUpload(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TODO_MEDIA_UPLOAD
    ]);
  }

  get isPermissionTodoAnalysis(){
    return this.authService.isInAnyRole([
      this.permissions.TODO_ANALYSIS
    ])
  }

  // TODO: get from a remote source of question metadata
  sampleInputData = [
    {
      label: 'Name',
      placeHolder: 'Enter your name here',
      hint: 'Enter your full name. eg. Amey Keni. Min 3 characters.',
      value: '',
      validators: ['required', 'minLength(3)', 'maxLength(50)'],
      order: 1
    },
    {
      label: 'Email',
      placeHolder: 'Enter your email here',
      hint: 'Enter a valid email address',
      controlType: 'email',
      validators: ['required', 'email'],
      order: 2
    },
    {
      label: 'Color',
      placeHolder: 'Select a color',
      hint: 'Click and select a color of your choice. Only one color can be selected.',
      options: ['Red', 'Green', 'Blue', 'Yellow'],
      order: 3,
      controlType: 'select',
      validators: 'required',
      required: true,
    },
    {
      label: 'Shape',
      placeHolder: 'Select Shapes',
      hint: 'Click and select one or more shapes of your choice.',
      options: ['Circle', 'Square', 'Hexagon', 'Triangle'],
      order: 4,
      controlType: 'multi-select',
      validators: 'required',
      required: true,
    },
    {
      label: 'Address',
      placeHolder: 'Enter your address here',
      controlType: 'multi-text',
      order: 5
    },
    {
      label: 'Age',
      placeHolder: 'Enter your age here',
      hint: 'Enter a valid age',
      controlType: 'number',
      required: true,
      validators: ['required', 'min(18)'],
      order: 2
    },

  ];

  getTodoResponseInputs()
  {
    const _formTemplate = this.sampleInputData.map(x => new DynamicInputBase({
      label: x.label,
      placeHolder: x.placeHolder,
      hint: x.hint,
      options: x.options,
      order: x.order,
      controlType: x.controlType,
      required: x.required,
    }));
    console.log('_formTemplate', _formTemplate);
    return of(_formTemplate
      .sort((a, b) => a.order - b.order));
  }

  getTodoAnalysis(filters?: ApiFilter[], search?: string, sort?: string) {
    let params = new HttpParams();
    if (filters && filters.length !== 0) {
      params = params.append('filters', JSON.stringify({ filters: filters }));
    }

    if (search) {
      params = params.append('search', search);
    }
    if (sort) {
      params = params.append('sort', sort);
    }
    return this.http.get<any>(this.apiRoute + '/Analysis', { headers: { 'no-loader': 'true' }, params });
  }

  openCreateDialog(entity: Todo)
  {
    let _dialogData = new McvComponentDialogConfig();
    _dialogData.dialogTitle = "New Todo";
    _dialogData.entityID = -1;
    _dialogData.entityTypeFlag = entity.typeFlag;
    _dialogData.isCreateMode = true;
    _dialogData.currentEntity = entity;
    // _dialogData.currentEntity = this.currentEntity;
    return this.openDialog(TodoDuplicateDialogComponent, _dialogData, true);
  }

  //Todo Create copy and paste file from DMS
  private copiedFiles = signal<ProjectAttachment[]>([]);

  get copied() {
    return this.copiedFiles();
  }

  toggleCopy(file: ProjectAttachment) {
    const currentFiles = this.copiedFiles();

    if (currentFiles.some((f) => f.id === file.id)) {
      this.copiedFiles.set(currentFiles.filter((f) => f.id !== file.id));
      this.utilityService.showSwalToast('','File Removed Successfully','success');
    } else {
      this.copiedFiles.set([...currentFiles, file]);
      this.utilityService.showSwalToast('','File Copied Successfully','success');
    }
  }

  clearCopied() {
    this.copiedFiles.set([]);
  }

  mapToMcvFullCalendarEvent(obj: Todo, showAll: boolean) {
    return {
      id: obj.uid,
      groupId: obj.uid,
      title: `Todo | ${obj.title} | ${obj.subTitle} | ${obj.assignee.fullName} | ${this.formatToIST(obj.startDate.toString())} - ${this.formatToIST(obj.dueDate.toString())}`,
      extendedProps: {
        ...obj,
        actualStartDate: obj.startDate,
        actualEndDate: obj.dueDate
      },
      start: new Date(obj.dueDate),
      end: new Date(obj.dueDate),
      color: '#04a82a',
      allDay: true,
    };
  }

  formatToIST(dateString: string): string {
    const utcDate = new Date(dateString);
    // Convert UTC → IST (+5:30)
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
    // Format nicely
    return istDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getStageTree(): Observable<any[]> {
      return this.http.get<any[]>(this.apiRoute + '/StageTree');
  }
}
