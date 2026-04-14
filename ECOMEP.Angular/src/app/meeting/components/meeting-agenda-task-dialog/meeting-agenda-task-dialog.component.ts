import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { Todo } from 'src/app/todo/models/todo.model';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { MeetingAgendaTaskComponent } from '../meeting-agenda-task/meeting-agenda-task.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-meeting-agenda-task-dialog',
    templateUrl: './meeting-agenda-task-dialog.component.html',
    styleUrls: ['./meeting-agenda-task-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, MeetingAgendaTaskComponent]
})
export class MeetingAgendaTaskDialogComponent implements OnInit, OnDestroy
{
  private listRoute: string = this.config.ROUTE_TODO_LIST;
  private $refreshTaskList!: Subscription;
  data: McvComponentConfig;
  constructor(
    private router: Router,
    private config: AppConfig,
    private wftaskService: WFTaskApiService,
    private dialog: MatDialogRef<MeetingAgendaTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: McvComponentConfig
  )
  {
    this.data = data;
  }

  ngOnInit()
  {
    // console.log('baseInit');
    this.$refreshTaskList = this.wftaskService.triggerListRefresh.subscribe(value =>
    {
      setTimeout(() =>
      {
        if (value === true)
        {
          // console.log('Task List refresh triggered!');
          this.dialog.close();
        }
      });
    });
  }

  ngOnDestroy()
  {
    // console.log('baseDestroy');
    this.$refreshTaskList.unsubscribe();
  }
  onCreate(obj: Todo)
  {
    const url = this.listRoute + '/' + obj.id;
    this.router.navigateByUrl(url);
    this.dialog.close(obj);
  }

  onClose()
  {
    this.dialog.close();
  }

  onTaskComplete(e: WFTask)
  {
    this.dialog.close(e);
  }

}

