import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppPermissions } from 'src/app/app.permissions';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cockpit-task-list-item',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './cockpit-task-list-item.component.html',
  styleUrls: ['./cockpit-task-list-item.component.scss']
})
export class CockpitTaskListItemComponent implements OnInit {
  @Input() item!: WFTask;
  @Input() showTaskStatus: boolean = false;
  @Input() showAll: boolean = false;

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL; 
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH; 
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW; 

  get WFTASK_STATUS_FLAG_PENDING() { return this.config.WFTASK_STATUS_FLAG_PENDING }
  get WFTASK_STATUS_FLAG_PAUSED() { return this.config.WFTASK_STATUS_FLAG_PAUSED }
  get WFTASK_STATUS_FLAG_STARTED() { return this.config.WFTASK_STATUS_FLAG_STARTED }
  get WFTASK_STATUS_FLAG_COMPLETED() { return this.config.WFTASK_STATUS_FLAG_COMPLETED }

  get isActionAllowed() {
    if (this.authService.currentUserStore != null) {
      return this.item.contactID == this.authService.currentUserStore.contact.id || this.authService.isInAnyRole([this.permissions.MASTER]);
    }
    return false;
  }

  readonly BRAIN_STROMINDEX = 1;
  @Output() open = new EventEmitter<WFTask>();

  constructor(
    public config: AppConfig,
    private authService: AuthService,
    private permissions: AppPermissions,
    private entityService: WFTaskApiService,
    private utilityService: UtilityService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onClick() {
    this.open.emit(this.item);
  }

  onTaskStart() {
    this.item.outcomeFlag = 0;
    this.item.statusFlag = this.WFTASK_STATUS_FLAG_STARTED;
    this.entityService.update(this.item).subscribe(
      (data) => {
        this.utilityService.showSwalToast('Success!',
          'Task started.',
          'success');
        this.entityService.activeTask = this.item;
        this.entityService.resetTriggers();
        this.entityService.refreshList();
      });
  }

  onTaskPause() {
    this.item.outcomeFlag = 1;
    this.item.statusFlag = this.WFTASK_STATUS_FLAG_PAUSED;
    this.entityService.update(this.item).subscribe(
      (data) => {
        this.utilityService.showSwalToast('Success!',
          'Task paused.',
          'success');
        this.entityService.activeTask = undefined;
        this.entityService.resetTriggers();
        this.entityService.refreshList();
      });
  }

  openPhotoDialog(member: any ) {
        this.dialog.open(ContactPhotoNameDialogComponent, {
          data: member
        });
      }
}

