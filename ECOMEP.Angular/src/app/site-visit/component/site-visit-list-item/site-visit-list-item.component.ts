import { Component, Input } from '@angular/core';

import { SiteVisit } from '../../models/site-visit.model';
import { NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-site-visit-list-item',
    templateUrl: './site-visit-list-item.component.html',
    styleUrls: ['./site-visit-list-item.component.scss'],
    standalone: true,
    imports: [MatTooltipModule, NgIf, DecimalPipe, DatePipe]
})
export class SitevisitListItemComponent {
  @Input('item') item!: SiteVisit;
  @Input('showAll') showAll!: boolean;
  constructor() { }

  ngOnInit() {
    // console.log('item',this.item);
  }
}
