import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AppPermissions } from 'src/app/app.permissions';
import { AuthService } from 'src/app/auth/services/auth.service';

import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf, DatePipe } from '@angular/common';

@Component({
    selector: 'wf-task-list-item',
    templateUrl: './wf-task-list-item.component.html',
    styleUrls: ['./wf-task-list-item.component.scss'],
    standalone: true,
    imports: [NgIf, MatTooltipModule, MatButtonModule, MatIconModule, DatePipe]
})
export class WfTaskListItemComponent implements OnInit
{
  @Input() item!: WFTask;
  @Input() showAll: boolean = false;

  get WFTASK_STATUS_FLAG_PENDING() { return this.config.WFTASK_STATUS_FLAG_PENDING }
  get WFTASK_STATUS_FLAG_PAUSED() { return this.config.WFTASK_STATUS_FLAG_PAUSED }
  get WFTASK_STATUS_FLAG_STARTED() { return this.config.WFTASK_STATUS_FLAG_STARTED }
  get WFTASK_STATUS_FLAG_COMPLETED() { return this.config.WFTASK_STATUS_FLAG_COMPLETED }

  get isActionAllowed()
  {
    if (this.authService.currentUserStore != null)
    {
      return this.item.contactID == this.authService.currentUserStore.contact.id || this.authService.isInAnyRole([this.permissions.MASTER]);
    }
    return false;
  }

  readonly BRAIN_STROMINDEX = 1;
  @Output() open = new EventEmitter<WFTask>();

  constructor(
    private config: AppConfig,
    private authService: AuthService,
    private permissions: AppPermissions,
    private entityService: WFTaskApiService,
    private utilityService: UtilityService
  ) { }

  ngOnInit()
  {
  }

  onClick()
  {
    this.open.emit(this.item);
  }

  onTaskStart()
  {
    this.item.outcomeFlag = 0;
    this.item.statusFlag = this.WFTASK_STATUS_FLAG_STARTED;
    this.entityService.update(this.item).subscribe(
      (data) =>
      {
        this.utilityService.showSwalToast('Success!',
          'Task started.',
          'success');

        this.entityService.resetTriggers();
        this.entityService.refreshList();
      });
  }

  onTaskPause()
  {
    this.item.outcomeFlag = 1;
    this.item.statusFlag = this.WFTASK_STATUS_FLAG_PAUSED;
    this.entityService.update(this.item).subscribe(
      (data) =>
      {
        this.utilityService.showSwalToast('Success!',
          'Task paused.',
          'success');

        this.entityService.resetTriggers();
        this.entityService.refreshList();
      });
  }
}
