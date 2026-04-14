import { Component, Input } from '@angular/core';
import { Meeting } from '../../models/meeting.model';
import { NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-meeting-list-item',
    templateUrl: './meeting-list-item.component.html',
    styleUrls: ['./meeting-list-item.component.scss'],
    standalone: true,
    imports: [MatTooltipModule, NgIf, DecimalPipe, DatePipe]
})
export class MeetingListItemComponent {
  @Input('item') item!: Meeting;
  @Input('showAll') showAll!: boolean;
  constructor() { }

  ngOnInit() {
    // console.log('item',this.item);
  }
}
