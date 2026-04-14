import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { McvComponentDialogConfig } from 'src/app/shared/models/mcv-component-dialog-config';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import { Contact } from 'src/app/contact/models/contact';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { TodoDialogComponent } from 'src/app/todo/components/todo-dialog/todo-dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cockpit-active-task',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './cockpit-active-task.component.html',
  styleUrls: ['./cockpit-active-task.component.scss']
})
export class CockpitActiveTaskComponent implements OnInit, OnDestroy {

  get activeTask() { return this.wftaskService.activeTask }
  get WFTASK_STATUS_FLAG_PAUSED() { return this.config.WFTASK_STATUS_FLAG_PAUSED }
  get WFTASK_STATUS_FLAG_STARTED() { return this.config.WFTASK_STATUS_FLAG_STARTED }
  get currentUser() { return this.authService.currentUserStore }
  get currentContact(): Contact {
    return this.authService.currentUserStore ? this.authService.currentUserStore.contact : new Contact();
  }
  $refreshTrigger!: Subscription;
  consumed: any = 0
  constructor(
    private dialog: MatDialog,
    private config: AppConfig,
    private entityService: McvBaseApiService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private wftaskService: WFTaskApiService
  ) { }

  async ngOnInit() {
    this.$refreshTrigger = this.wftaskService.triggerListRefresh.subscribe((value) => {
      setTimeout(() => {
        this.refresh();
      });
    });
  }

  ngOnDestroy(): void {
    this.$refreshTrigger.unsubscribe();
    // this.$intervalSubscription.unsubscribe();
  }

  calculateMHr() {
    const currentTime = new Date();
    if (this.wftaskService.activeTask && this.wftaskService.activeTask.timeEntries.length > 0) {
      let totalConsumed = 0;

      const _consumedMHr = this.wftaskService.activeTask.mHrConsumed;
      const _teWithoutEndDate = this.wftaskService.activeTask.timeEntries.find(te => !te.endDate);

      if (_teWithoutEndDate) {
        const _timeDifference = currentTime.getTime() - new Date(_teWithoutEndDate.startDate).getTime();
        totalConsumed = _consumedMHr + (_timeDifference / (1000 * 60 * 60));
        this.consumed = parseFloat(totalConsumed.toFixed(2));
      }
    }
  }

  async refresh() {
    const _filter: ApiFilter[] = [
      { key: 'contactID', value: this.currentUser ? this.currentUser.contact.id.toString() : '' },
      { key: 'statusFlag', value: this.WFTASK_STATUS_FLAG_STARTED.toString() }
    ];
    const _task = await firstValueFrom(this.wftaskService.get(_filter));
    if (_task && _task.length > 0) {
      this.wftaskService.activeTask = _task[0];
      this.consumed = _task[0].mHrConsumed;
      this.calculateMHr();
      interval(60000).subscribe(() => this.calculateMHr())
    }
  }

  isDelayed(item: WFTask): boolean {
    const due = new Date(item.dueDate);
    const now = new Date();

    if (item && item.statusFlag != 1 && due <= now) {
      return true;
    }
    return false;
  }

  isForToday(item: WFTask): boolean {
    const _taskDue = new Date(item.dueDate);
    _taskDue.setHours(0, 0, 0, 0);
    const _today = new Date();
    _today.setHours(0, 0, 0, 0);
    const _tomorrow = new Date(_today);
    _tomorrow.setDate(_tomorrow.getDay() + 1);

    if (item && item.statusFlag != 1 && _taskDue.getTime() == _today.getTime()) {
      return true;
    }
    return false;
  }

  onPauseActiveTask() {
    if (this.activeTask) {
      this.activeTask.outcomeFlag = 1;
      this.activeTask.statusFlag = this.WFTASK_STATUS_FLAG_PAUSED;
      this.wftaskService.update(this.activeTask).subscribe(
        (data) => {
          this.wftaskService.activeTask = undefined;
          this.utilityService.showSwalToast('Success!',
            'Task paused.',
            'success');

          this.wftaskService.refreshList();
        });
    }
  }

  openTaskDialog(task: WFTask) {
    if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_TODO.toLowerCase()) {
      this.openEntityDialog(TodoDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    } 
    // else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_PACKAGE.toLowerCase()) {
    //   if (task.contactID != this.currentContact.id && task.stageIndex == 3) {
    //     this.onStudioTask(task);
    //   } else {
    //     this.openEntityDialog(PackageDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task)
    //   }
    // } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_PROJECT.toLowerCase()) {
    //   this.openEntityDialog(ProjectTaskComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    // } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_LEAVE.toLowerCase()) {
    //   this.openEntityDialog(LeaveDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    // } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_MEETING.toLowerCase()) {
    //   this.openEntityDialog(MeetingDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    // } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_REQUEST_TICKET.toLowerCase()) {
    //   this.openEntityDialog(RequestTicketDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    // } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_HABIT.toLowerCase()) {
    //   this.openEntityDialog(HabitDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    // } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_EXPENSE.toLowerCase()) {
    //   this.openEntityDialog(ExpenseDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    // }
    // else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_MEETING_AGENDA.toLowerCase()) {
    //   this.openEntityDialog(MeetingAgendaTaskDialogComponent, task.title, task.subtitle, task.entityID ? task.entityID : 0, 0, false, true, task);
    // }
  }

  onOpenActiveTask(task: WFTask) {
    if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_TODO.toLowerCase()) {
      let _dialogData = new McvComponentDialogConfig();
      _dialogData.dialogTitle = 'Task';
      _dialogData.entityID = task.entityID ?? 0;
      _dialogData.entityTypeFlag = 0;
      _dialogData.isCreateMode = false;
      _dialogData.isTaskMode = true;
      _dialogData.task = task;
      const _dialogRef = this.wftaskService.openDialog(TodoDialogComponent, _dialogData, true);
      _dialogRef.afterClosed().subscribe(res => {
        if (res) {
          console.log('onClose', res);
        }
      });
    }
  }

  openEntityDialog(componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>, dialogTitle: string, dialogSubTitle: string, entityID: number, entityTypeFlag: number, isCreateMode: boolean = false, isTaskmode: boolean = false, wfTask?: WFTask) {
    let _dialogData = new McvComponentDialogConfig();
    _dialogData.dialogTitle = dialogTitle;
    _dialogData.dialogSubTitle = dialogSubTitle;
    _dialogData.entityID = entityID;
    _dialogData.entityTypeFlag = entityTypeFlag;
    _dialogData.isCreateMode = isCreateMode;
    _dialogData.isTaskMode = isTaskmode;
    _dialogData.task = wfTask;
    const dialogRef = this.entityService.openDialog(componentOrTemplateRef, _dialogData, true);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('onClose', res);
      }
    });
  }
}
