import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { WFTask, WFTaskAttachment } from 'src/app/wf-task/models/wf-task.model';
import { WFStage } from 'src/app/shared/models/wf-stage';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, forkJoin, Subscription, take } from 'rxjs';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { WfTaskAttachmentApiService } from 'src/app/wf-task/services/wf-task-attachment-api.service';
import { WfStageApiService } from 'src/app/wf-task/services/wf-stage-api.service';
import { AppConfig } from 'src/app/app.config';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppPermissions } from 'src/app/app.permissions';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { WFStageAction } from 'src/app/shared/models/wf-stage-action';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { WfTaskAssessmentDialogComponent } from 'src/app/wf-task/components/wf-task-assessment-dialog/wf-task-assessment-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';

@Component({
  selector: 'app-request-ticket-task-action',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TextFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    DecimalPipe,

    //Components
    McvFileComponent,
    McvFileUploadComponent,
  ],
  templateUrl: './request-ticket-task-action.component.html',
  styleUrls: ['./request-ticket-task-action.component.scss']
})
export class RequestTicketTaskActionComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  task!: WFTask;
  @Input('task') set WFTask(task: WFTask) {
    if (task) {
      this.task = task;
      this.refresh();
    }
  }

  @Input() disableComplete: boolean = false;
  @Input() disableCompleteMessage: string = '';

  loading: boolean = false;
  stage!: WFStage;
  form!: FormGroup;
  previousTask!: WFTask;
  selectedActionFC: FormControl = new FormControl();
  blobConfig = {
    container: '',
    folderPath: `${this.config.NAMEOF_ENTITY_WFTASK}`
  }

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
    private appSettingService: AppSettingMasterApiService
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

  dateFilter = (d: Date): boolean => {
    if (d?.getDay() === 0 || d?.getDay() === 6) { return false; }
    if (d < new Date()) { return false; }
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
      this.f.comment.setValue(this.task.comment);
    }
  }

  getStage(task: WFTask) {
    if (task.wfStageCode) {

      this.wfstageService.get([{ key: 'Code', value: task.wfStageCode }]).subscribe(
        (data: WFStage[]) => {
          this.stage = data[0];
          this.buildForm();
          if (this.stage.showAssessment) {
            this.getPreviousTask(this.task.previousTaskID);
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

    this.utilityService.showConfirmationDialog(_messageText,
      () => {
        this.task.statusFlag = action.taskStatusFlag;
        this.task.outcomeFlag = action.taskOutcomeFlag;
        this.task.comment = this.f.comment.value;
        this.task.followUpDate = this.f.followUpDate.value ? this.utilityService.getLocalDate(this.f.followUpDate.value) : null;

        console.log(action.triggerEntityFormSubmit);
        if (action.triggerEntityFormSubmit) {
          console.log('calling Entity update');
          this.updateEntity.emit(this.task);
        } else {
          console.log('calling task update');
          this.updateTask(this.task);
        }
      });


  }

  getButtonAction(outcomeFlag: number) {
    return this.stage.actions.find(x => x.taskOutcomeFlag == outcomeFlag)
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

  onAssessmentClick(task: WFTask) {
    if (task) {
      const dialogRef = this.wftaskService.openTaskAssessmentDialog('Task Assessment',
        WfTaskAssessmentDialogComponent,
        task.previousTaskID);
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.f.comment.setValue(res.assessmentRemark);
          this.previousTask = res;
          // this.getPreviousTask(task.previousTaskID);
          this.onTaskAction(this.stage.actions.find(x => x.taskStatusFlag === this.config.WFTASK_STATUS_FLAG_COMPLETED) ?? this.stage.actions[0]);
        }
      });
    }
  }

  private getPreviousTask(id: number) {
    if (id) {
      this.wftaskService.getById(id).subscribe(data => {
        this.previousTask = data;
      });
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
}


