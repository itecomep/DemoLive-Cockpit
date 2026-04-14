import { Component, Input } from '@angular/core';

import { ObservableInput, Subscription, forkJoin } from 'rxjs';

import { ActivityDto } from 'src/app/shared/models/activity-dto';
import { ActivityApiService } from '../../services/activity-api.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { AppConfig } from 'src/app/app.config';
import { McvActivityListItemComponent } from '../mcv-activity-list-item/mcv-activity-list-item.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'mcv-activity-list',
    templateUrl: './mcv-activity-list.component.html',
    styleUrls: ['./mcv-activity-list.component.scss'],
    standalone: true,
    imports: [NgFor, McvActivityListItemComponent, NgIf]
})
export class McvActivityListComponent
{
  activeEntityID!: number;
  @Input() set entityID(id: number)
  {
    if (id)
    {
      this.activeEntityID = id;
      this.refresh();
    }
  }

  @Input() entity!: string;

  dataList: ActivityDto[] = [];
  attachmentList: any[] = [];
  $refreshTrigger!: Subscription;
  constructor(
    private service: ActivityApiService,
    private wftaskService: WFTaskApiService,
    private config: AppConfig
  ) { }

  ngOnInit()
  {
    this.dataList = [];
    this.$refreshTrigger = this.service.triggerListRefresh.subscribe((value) =>
    {

      setTimeout(() =>
      {
        this.refresh();
      });

    });
  }

  ngOnDestroy()
  {
    this.$refreshTrigger.unsubscribe();
  }


  refresh()
  {
    if (this.activeEntityID && this.activeEntityID !== -1)
    {
      this.getDataListByEntity(this.activeEntityID, this.entity);
    }
  }

  getDataListByEntity(entityID: number, entity: string)
  {
    this.dataList = [];
    const requests: ObservableInput<any>[] = [];
    requests.push(this.service.get([{ key: 'Entity', value: entity }, { key: 'EntityID', value: entityID.toString() }]));
    requests.push(this.wftaskService.get([{ key: 'Entity', value: entity }, { key: 'EntityID', value: entityID.toString() }, { key: 'StatusFlag', value: this.config.WFTASK_STATUS_FLAG_PENDING.toString() },
    { key: 'StatusFlag', value: this.config.WFTASK_STATUS_FLAG_STARTED.toString() },
    { key: 'StatusFlag', value: this.config.WFTASK_STATUS_FLAG_PAUSED.toString() }]));

    forkJoin(requests).subscribe(results =>
    {


      this.dataList = results[0];

      this.dataList.push(...results[1].map((task: WFTask) =>
      {
        var activity = new ActivityDto();

        activity.contactID = task.contactID;
        activity.entity = task.entity;
        activity.entityID = task.entityID;
        activity.action = `${task.title} R${task.stageRevision}`;
        activity.created = task.dueDate > new Date() ? task.dueDate : new Date();
        activity.status = `Task ${task.statusFlag == this.config.WFTASK_STATUS_FLAG_PENDING ? "Pending" : (task.statusFlag == this.config.WFTASK_STATUS_FLAG_STARTED ? "Started" : "Paused")}`,
          activity.wfTaskID = task.id;
        activity.contactName = task.contact.name;
        activity.contactPhotoUrl = task.contact.photoUrl;
        activity.contactUID = task.contact.uid;
        activity.statusFlag = task.dueDate < new Date() ? 2 : 0;
        activity.typeFlag = 1;

        return activity;
      }));


      this.dataList.sort((b, a) => new Date(a.created).getTime() - new Date(b.created).getTime());
    });
  }
}

