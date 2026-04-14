import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { NgIf } from '@angular/common';import { SitevisitMinutesComponent } from "src/app/site-visit/component/site-visit-minutes/site-visit-minutes.component";

@Component({
    selector: 'app-site-vist-minutes-view',
    templateUrl: './site-visit-minutes-view.component.html',
    styleUrls: ['./site-visit-minutes-view.component.scss'],
    standalone: true,
    imports: [NgIf, SitevisitMinutesComponent]
})
export class SitevisitMinutesViewComponent implements OnInit
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
