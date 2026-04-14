import { Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { Todo } from 'src/app/todo/models/todo.model';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { firstValueFrom, take } from 'rxjs';

import { SitevisitAgendaFormComponent } from '../site-visit-agenda-form/site-visit-agenda-form.component';
import { SitevisitAgenda } from 'src/app/site-visit/models/site-visit-agenda.model';
import { SiteVisit } from '../../models/site-visit.model';
import { SiteVisitAgendaApiService } from '../../services/site-visit-agenda-api.service';
import { SiteVisitApiService } from '../../services/site-visit-api.service';

import { AbstractControl, FormBuilder } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvTimeEntryTimeLineComponent } from 'src/app/mcv-time-entry/components/mcv-time-entry-time-line/mcv-time-entry-time-line.component';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';
import { SitevisitAgendaComponent } from '../site-visit-agenda/site-visit-agenda.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { WftaskTitleBarComponent } from '../../../wf-task/components/wftask-title-bar/wftask-title-bar.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-site-visit-agenda-task',
    templateUrl: './site-visit-agenda-task.component.html',
    styleUrls: ['./site-visit-agenda-task.component.scss'],
    standalone: true,
    imports: [NgIf, WftaskTitleBarComponent, MatExpansionModule, MatButtonModule, SitevisitAgendaComponent]
})
export class SitevisitAgendaTaskComponent 
{
  //Common component properties-------------------------
  currentEntity: SitevisitAgenda = new SitevisitAgenda();
  nameOfEntity = this.config.NAMEOF_ENTITY_SITE_VISIT_AGENDA;
  entityID!: number;
  task: WFTask | any;
  isCreateMode: boolean = false;
  isTaskMode: boolean = false;
  entityTypeFlag: number = 0;
  configData: any;
  isDuplicated: boolean = false;
  blobConfig!: McvFileUploadConfig;

  @ViewChild(McvTimeEntryTimeLineComponent) timeline!: McvTimeEntryTimeLineComponent;
  @ViewChild(McvActivityListComponent) activity!: McvActivityListComponent;

  @Input('config') set configValue(value: McvComponentConfig)
  {
    // console.log('McvComponentConfig', value);
    if (value)
    {
      this.configData = value;
      this.entityID = value.entityID;
      this.task = value.task;
      this.isCreateMode = value.isCreateMode;
      this.isTaskMode = value.isTaskMode;
      this.entityTypeFlag = value.entityTypeFlag;
      this.currentEntity = value.currentEntity;
      this.isDuplicated = value.isCreateMode && value.currentEntity;
      this.refresh();
    }
  }

  @Output() create = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() taskComplete = new EventEmitter<WFTask>();
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  form: any;
  get f(): any { return this.form.controls; }

  get isMobileView(): boolean { return this.utilityService.isMobileView; }



  constructor(private entityService: SiteVisitAgendaApiService,
    private todoService: TodoApiService,
    private sitevisitService: SiteVisitApiService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private config: AppConfig,
  )
  { }

  refresh()
  {
    if (!this.isCreateMode)
    {
      this.getCurrent(this.entityID);
    }
  };
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

  buildForm()
  {
    this.form = this.formBuilder.group({});
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
  async getCurrent(id: number)
  {
    this.currentEntity = await firstValueFrom(this.entityService.getById(id));
    this.sitevisit = await firstValueFrom(this.sitevisitService.getById(this.currentEntity.sitevisitID));
  }

  sitevisit!: SiteVisit;
  async onEditClick()
  {

    // this.editClick.emit();
    const _agendaFormConfig = {
      autoUpdate: true,
      isSitevisitCreateMode: false,
      isCreatemode: false,
      sitevisitID: this.currentEntity.sitevisitID,
      sitevisit: this.sitevisit,
      agenda: this.currentEntity,
      dialogTitle: `Update Agenda | ${this.currentEntity.title}-${this.currentEntity.subtitle}`
    };
    const dialogRef = this.entityService.openDialog(SitevisitAgendaFormComponent, _agendaFormConfig);
    dialogRef.afterClosed().subscribe(res =>
    {
      console.log('onClose', res);
      if (res)
      {
        // this.task.comment = `Communication Note Sent | ${res.title}-${res.subTitle}`;
        // this.task.statusFlag = 1;
        // this.wftaskService.update(this.task).subscribe(res => this.taskComplete.emit(res));
        // this.currentEntity = Object.assign({}, res);
        // this.afterUpdate.emit(res);
      }
    });
  }

  onCreateTodo()
  {
    var _due = this.currentEntity.dueDate || new Date();
    let _todo = new Todo({
      projectID: this.currentEntity.projectID,
      title: this.currentEntity.sitevisitTitle + '-' + this.currentEntity.title,
      subTitle: this.currentEntity.subtitle,
      description: this.currentEntity.comment,
      dueDate: (new Date(_due)).getTime() > (new Date()).getTime() ? _due : new Date(),
      assignee: this.task.contact,
      assigneeContactID: this.task.contactID,
      comment: this.currentEntity.comment,
      mHrAssigned: 1,
    });

    const dialogRef = this.todoService.openCreateDialog(_todo);
    dialogRef.afterClosed().subscribe((createdTodo: Todo) =>
    {
      if (createdTodo)
      {
        console.log('onClose', createdTodo);

        this.currentEntity.dueDate = createdTodo.dueDate;
        this.currentEntity.comment = `Todo assigned to ${createdTodo.assignee.name}`;
        this.currentEntity.todoID = createdTodo.id;
        this.entityService.update(this.currentEntity).subscribe((agenda) =>
        {
          console.log('agenda updated', agenda);
          this.taskComplete.emit(this.task);
          // this.task.comment = `Todo created | ${createdTodo.title}-${createdTodo.subTitle}`;
          // this.task.statusFlag = 1;
          // this.wftaskService.update(this.task).subscribe(res => this.taskComplete.emit(res));
        });
      }
    });
  }

  onCancel()
  {
    this.cancel.emit();
  }



  onTaskCompleted(e: any)
  {
    this.taskComplete.emit(e);
  }

  onTaskUpdated(e: any)
  {
    this.task = Object.assign({}, e);
    if (this.timeline)
    {
      this.timeline.refresh();
    }
  }

  onRefresh(event: any)
  {
    this.currentEntity = event;
  }

  onCreate(event: any)
  {
    this.create.emit(event);
  }

  onUpdate(event: any)
  {

    this.update.emit(event);
  }

  onDelete(event: any)
  {
    this.delete.emit(event);
  }

  onRemoveTimeEntry(obj: TimeEntryDto)
  {
    if (this.task)
    {
      this.task.timeEntries = this.task.timeEntries.filter((x: any) => x.id !== obj.id);
    }
    if (this.timeline)
    {
      this.timeline.refresh();
    }
  }

  onUpdateTimeEntries(task: WFTask)
  {
    if (this.task)
    {
      this.task = Object.assign({}, task);
    }
  }

}
