import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { MinutesComponent } from '../../../meeting/components/minutes/minutes.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-meeting-minutes-view',
    templateUrl: './meeting-minutes-view.component.html',
    styleUrls: ['./meeting-minutes-view.component.scss'],
    standalone: true,
    imports: [NgIf, MinutesComponent]
})
export class MeetingMinutesViewComponent implements OnInit
{

  uid!: string;

  constructor(
    private route: ActivatedRoute,
    private swUpdate: SwUpdate,
  ) { }

  ngOnInit(): void
  {
    this.route.params.subscribe((params: Params) =>
    {
      this.uid = params["uid"];
    });

    const updatesAvailable = this.swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      })));

    updatesAvailable.subscribe((e) =>
    {
      console.log('version ready ', e);

      this.swUpdate.activateUpdate().then(() =>
      {
        window.location.reload()
      });


    });
  }
}
