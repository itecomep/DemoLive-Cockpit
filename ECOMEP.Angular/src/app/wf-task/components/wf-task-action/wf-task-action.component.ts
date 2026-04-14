import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, ObservableInput, Subscription, firstValueFrom, forkJoin } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { WFTaskApiService } from '../../services/wf-task-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WfStageApiService } from 'src/app/wf-task/services/wf-stage-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';

import { WFTaskAttachment, WFTask } from 'src/app/wf-task/models/wf-task.model';
import { take } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { AppPermissions } from 'src/app/app.permissions';
import { WFStage } from 'src/app/shared/models/wf-stage';
import { WFStageAction } from 'src/app/shared/models/wf-stage-action';
import { WfTaskAttachmentApiService } from '../../services/wf-task-attachment-api.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { DecimalPipe, CommonModule } from '@angular/common';
import { WfTaskAssessmentComponent } from '../wf-task-assessment/wf-task-assessment.component';
import { AssessmentDto } from 'src/app/shared/models/assessment-dto';
import { AssessmentApiService } from '../../services/assessment-api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WfTaskTodoRequestTicketActionComponent } from '../wf-task-todo-request-ticket-action/wf-task-todo-request-ticket-action.component';
import { RequestTicket, RequestTicketAttachment } from 'src/app/request-ticket/models/request-ticket';
import { RequestTicketApiService } from 'src/app/request-ticket/services/request-ticket-api.service';
import { RequestTicketAssignee } from 'src/app/request-ticket/models/request-ticket-assignee';
import { RequestTicketAssigneeApiService } from 'src/app/request-ticket/services/request-ticket-assignee-api.service';
import { RequestTicketAttachmentApiService } from 'src/app/request-ticket/services/request-ticket-attachment-api.service';


@Component({
  selector: 'app-wf-task-action',
  templateUrl: './wf-task-action.component.html',
  styleUrls: ['./wf-task-action.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TextFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    DecimalPipe,
    MatAutocompleteModule,

    //Components
    McvFileComponent,
    McvFileUploadComponent,
    WfTaskAssessmentComponent,
    WfTaskTodoRequestTicketActionComponent
  ]
})
export class WfTaskActionComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  task!: WFTask;

  @Input('task') set WFTask(task: WFTask) {
    if (task) {
      this.task = task;
      this.refresh();
    }
  }

  @Input() disableArray: any[] = [];
  @Input() disableComplete: boolean = false;
  @Input() disablePause: boolean = false;
  @Input() disableCompleteMessage: string = '';
  @Input() disablePauseMessage: string = '';


  @Input() isAgendaLength !: number;
  @Input() isCheckedAgendaLength !: number;
  @Input() isAttachmentLength !: number;

  pauseDisableTime: Date | null = null;
  requestTicket: RequestTicket = new RequestTicket();
  selectedAssignees: RequestTicketAssignee[] = [];
  selectedAttachments: RequestTicketAttachment[] = [];
  loading: boolean = false;
  totalPoints: number = 0;
  stage!: WFStage;
  form!: FormGroup;
  previousTask!: WFTask;
  assessments: AssessmentDto[] = [];
  selectedActionFC: FormControl = new FormControl();
  blobConfig = {
    container: '',
    folderPath: `${this.config.NAMEOF_ENTITY_WFTASK}`
  }

  readonly WFTASK_DISABLE_PAUSE_TIMER = this.config.WFTASK_DISABLE_PAUSE_TIMER;
  readonly REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO = this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO;
  readonly TASK_STAGE_TODO_WORK = this.config.TASK_STAGE_TODO_WORK;

  get f(): any { return this.form.controls; }

  get isReadonly() {
    if (this.authService.currentUserStore != null) {
      return !(this.authService.isInRole(this.permissions.WFTASK_SPECIAL_SHOW_ALL) ||
        (this.task && this.task.contactID == this.authService.currentUserStore.contact.id)
      );
    }
    return false;
  }

  @Output() complete = new EventEmitter<WFTask>();
  @Output() updated = new EventEmitter<WFTask>();
  @Output() updateEntity = new EventEmitter();

  $completeTask!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private wftaskService: WFTaskApiService,
    private wftaskAttachmentService: WfTaskAttachmentApiService,
    private wfstageService: WfStageApiService,
    private config: AppConfig,
    private utilityService: UtilityService,
    private authService: AuthService,
    private permissions: AppPermissions,
    private appSettingService: AppSettingMasterApiService,
    private assessmentService: AssessmentApiService,
    private requestTicketService: RequestTicketApiService,
    private assigneeService: RequestTicketAssigneeApiService,
    private requstTicketAttachmentService: RequestTicketAttachmentApiService,
  ) {

    if (this.appSettingService.presets) {
      const _blobContainerPreset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)
      if (_blobContainerPreset) {
        this.blobConfig.container = _blobContainerPreset.presetValue;
      }
    }
  }

  ngOnInit() {
    this.buildForm();
    // this.uploader.queue = [];
    this.$completeTask = this.wftaskService.triggerTaskComplete.subscribe(task => {
      setTimeout(() => {
        if (task) {
          console.log('After Entity update');
          this.updateTask(task);
        }
      });
    });
  }

  ngOnDestroy() {
    this.$completeTask.unsubscribe();
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  refresh() {
    this.getStage(this.task);
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
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

  touchForm() {
    Object.keys(this.form.controls).forEach(field => {
      // {1}
      const control = this.form.get(field); // {2}
      if (control != null) {
        control.markAsTouched({ onlySelf: true }); // {3}
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      comment: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
      followUpDate: new FormControl<any>(null),
    });

    if (this.stage && !this.stage.isCommentRequired) {
      this.f.comment.setValidators([]);
    }

    this.touchForm();
    this.bindForm();
  }

  bindForm() {
    if (this.task) {
      // this.f.comment.setValue(this.task.comment);
    }
  }

  getStage(task: WFTask) {
    if (task.wfStageCode) {

      this.wfstageService.get([{ key: 'Code', value: task.wfStageCode }]).subscribe(
        async (data: WFStage[]) => {
          this.stage = data[0];
          this.buildForm();
          if (this.stage.showAssessment) {
            await this.getPreviousTask(this.task.previousTaskID);
          }
          const actions = new Array<WFStageAction>();
          if (this.stage && this.stage.actions && this.stage.actions.length > 0) {
            this.stage.actions.forEach(action => {
              if (!action.showOnStatusFlag || action.showOnStatusFlag.toLowerCase() === 'any') {
                actions.push(action);
              } else {
                const statusArr = action.showOnStatusFlag.split(',');
                statusArr.forEach(status => {
                  if (status && !isNaN(parseInt(status)) && task.statusFlag === parseInt(status)) {
                    actions.push(action);
                  }
                });
              }

            });
            this.stage.actions = actions;
          }
        }
      );
    }
  }

  onTaskAction(action: WFStageAction) {
    if (this.form.invalid) {
      this.touchForm();
      return;
    }

    const _previousStatus = this.task.statusFlag;
    let title = 'Submit';

    if (this.stage && this.stage.actions) {
      title = 'You want to ' + (action ? action.buttonText : 'Submit') + '? \n';
    }

    let _messageText = title;
    if (action && action.description) {
      _messageText = _messageText + '\n' + action.description;
    }
    console.log(this.requestTicket);
    //If the task is in Todo Submission and 
    if (this.stage.code == 'TODO_SUBMISSION' && action.taskOutcomeFlag == 0 && action.taskStatusFlag == 1) {
      //To member in recipients list
      const _to = this.requestTicket.assignees.find(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO);
      if (!_to || (this.requestTicket.stageTitle == null || this.requestTicket.stageTitle == '') || (this.requestTicket.purpose == null || this.requestTicket.purpose == '')) {
        this.utilityService.showSwalToast('Error!',
          'Request Ticket Data Incomplete.',
          'error');
        return;
      }
    }

    this.utilityService.showConfirmationDialog(_messageText,
      async () => {

        //The below if() code only executes when the task is in assessment and stage.isShowAssessment is true
        //also checks for activityText and buttonText to be 'Assessed' and 'Assess & Submit' respectively
        if (this.stage.showAssessment) {
          const requests: ObservableInput<any>[] = [];
          this.assessments.forEach((item: AssessmentDto) => {
            item.wfTaskID = this.previousTask.id;
            item.scoredPoints = item.scoredPoints / 2.0;
            requests.push(this.assessmentService.create(item));
          });
          await firstValueFrom(forkJoin(requests));
          this.previousTask.assessmentRemark = this.f['comment'].value;
          await firstValueFrom(this.wftaskService.update(this.previousTask));
        }
        // console.log(action);

        this.task.statusFlag = action.taskStatusFlag;
        this.task.outcomeFlag = action.taskOutcomeFlag;
        this.task.comment = this.f.comment.value;
        this.task.followUpDate = this.f.followUpDate.value ? this.utilityService.getLocalDate(this.f.followUpDate.value) : null;

        if (action.triggerEntityFormSubmit) {
          console.log('calling Entity update');
          this.updateEntity.emit(this.task);
        } else {
          console.log('calling task update');
          this.updateTask(this.task);
        }

        if (this.stage.code == 'TODO_SUBMISSION' && action.taskOutcomeFlag == 0 && action.taskStatusFlag == 1) {
          this.selectedAssignees = Object.assign(this.selectedAssignees, this.requestTicket.assignees);
          this.selectedAttachments = Object.assign(this.selectedAttachments, this.requestTicket.attachments);
          this.requestTicket.projectID = this.task.projectID;
          this.requestTicket = await firstValueFrom(this.requestTicketService.create(this.requestTicket));
          await this.uploadAssignee();
          await this.uploadAttachments();
        }
      });
  }

  async updateTask(task: WFTask) {
    var data = await firstValueFrom(this.wftaskService.update(task, true))
    this.utilityService.showSwalToast('Success!',
      'Your Task action was successfull.',
      'success');
    if (task.statusFlag === 1) {
      this.complete.emit(data);
    } else {
      this.updated.emit(data);
      this.refresh();
    }
    this.wftaskService.resetTriggers();
    this.wftaskService.refreshList();
  }

  deleteAttachment(file: any) {
    this.wftaskAttachmentService.delete(file.id).subscribe(
      () => {
        this.task.attachments = this.task.attachments.filter(obj => {
          return obj.id === file.id;
        });
      }
    );
  }

  async onAssessmentClick(task: WFTask) {
    if (task) {
      if (this.f['comment'].invalid) {
        this.touchForm();
        return;
      } else {
        const requests: ObservableInput<any>[] = [];
        this.assessments.forEach((item: AssessmentDto) => {
          item.wfTaskID = this.previousTask.id;
          item.scoredPoints = item.scoredPoints / 2.0;
          requests.push(this.assessmentService.create(item));
        });
        await firstValueFrom(forkJoin(requests));
        this.previousTask.assessmentRemark = this.f['comment'].value;
        await firstValueFrom(this.wftaskService.update(this.previousTask));
        this.onTaskAction(this.stage.actions.find(x => x.taskStatusFlag === this.config.WFTASK_STATUS_FLAG_COMPLETED) ?? this.stage.actions[0]);
      }
    }
  }

  private async getPreviousTask(id: number) {
    if (id) {
      this.previousTask = await firstValueFrom(this.wftaskService.getById(id));
      this.calculateTotalScoredPoints();
    }
  }

  get isMobileView(): boolean {
    return this.utilityService.isMobileView;
  }

  onUpload(uploads: UploadResult[]) {
    console.log('meetingAttachments', uploads);
    let _createRequests: any[] = [];
    uploads.forEach(x => {
      let obj = new WFTaskAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.wfTaskID = this.task.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.wftaskAttachmentService.create(obj));

    });

    forkJoin(_createRequests).subscribe(results => {
      console.log('createdAttachments', results);
      results.forEach(x => {
        this.task.attachments.push(x as WFTaskAttachment);
      })
      // this.uploadComplete.emit(this.task.attachments);
      this.updated.emit(this.task);
    })
  }

  onDownloadAttachment(item: any) {
    window.open(item.url);
  }
  onDeleteAttachment(file: any) {
    this.wftaskAttachmentService.delete(file.id).subscribe(
      () => {

        this.task.attachments = this.task.attachments.filter(obj => {
          return obj.id !== file.id;
        });
      }
    );
  }

  private calculateTotalScoredPoints() {
    let totalScoredPoints = 0;
    if (this.previousTask.assessments.length == 0) {
      this.previousTask.assessmentPoints = 10;
      this.previousTask.mHrAssessed = this.previousTask.mHrAssigned;
    }
  }

  onUpdatedAssessment(data: { assessments: AssessmentDto[], task: WFTask }) {
    // console.log(data);
    Object.assign(this.previousTask, data.task);
    this.assessments = data.assessments;
  }

  onUpdateTask(requestTicket: RequestTicket) {
    this.requestTicket = Object.assign(this.requestTicket, requestTicket);
    this.requestTicket.assignerContactID = this.authService.currentUserStore ? this.authService.currentUserStore.contact.id : 0;
  }

  async uploadAssignee() {
    let _assignees: Observable<RequestTicketAssignee>[] = [];
    this.selectedAssignees.forEach(x => {
      x.requestTicketID = this.requestTicket.id
      _assignees.push(this.assigneeService.create(x));
    })
    // const result = await firstValueFrom(forkJoin(_assignees));
    // this.currentEntity.assignees.push(...result);

    const results = await firstValueFrom(forkJoin(_assignees));
    this.requestTicket.assignees.push(...results);
  }

  async uploadAttachments() {
    let _attachments: Observable<RequestTicketAttachment>[] = [];
    this.selectedAttachments.forEach(x => {
      x.requestTicketID = this.requestTicket.id
      _attachments.push(this.requstTicketAttachmentService.create(x));
    })
    // const result = await firstValueFrom(forkJoin(_assignees));
    // this.currentEntity.assignees.push(...result);

    const results = await firstValueFrom(forkJoin(_attachments));
    this.requestTicket.attachments.push(...results);
  }

  disableButton(taskStatusFlag: number, taskOutcomeFlag: number): boolean {
    //This is for complete button
    if (taskStatusFlag === 1 && taskOutcomeFlag === 2) {
      const noAgendasChecked = this.isCheckedAgendaLength === 0;
      const notAllAgendasChecked = this.isCheckedAgendaLength !== this.isAgendaLength;
      const noAttachments = this.isAttachmentLength === 0;

      return noAgendasChecked || notAllAgendasChecked || noAttachments;
    }

    // This is for pause button
    if (taskStatusFlag === 3 && taskOutcomeFlag === 1) {
      const noAgendasChecked = this.isCheckedAgendaLength === 0;
      const noAttachments = this.isAttachmentLength === 0;

      let isOldAttachment = false;

      if (!noAttachments && this.task.attachments.length > 0) {
        const latestAttachment = this.task.attachments.reduce((latest, current) => {
          return new Date(current.created) > new Date(latest.created) ? current : latest;
        });

        const now = new Date();
        const createdTime = new Date(latestAttachment.created);
        const diffInMinutes = (now.getTime() - createdTime.getTime()) / (1000 * 60);

        isOldAttachment = diffInMinutes > this.WFTASK_DISABLE_PAUSE_TIMER;
        const pauseDisableTime = new Date(createdTime.getTime() + this.WFTASK_DISABLE_PAUSE_TIMER * 60000);

        this.pauseDisableTime = pauseDisableTime > now ? pauseDisableTime : null;
      } else {
        this.pauseDisableTime = null;
      }

      return noAgendasChecked || noAttachments || isOldAttachment;
    }
    return false;
  }
}
