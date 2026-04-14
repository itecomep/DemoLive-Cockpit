import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { McvTimeLineEvent } from '../../model/mcv-time-line-events';
import { NgClass, NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
    selector: 'mcv-time-line-event-detail',
    templateUrl: './mcv-time-line-event-detail.component.html',
    styleUrls: ['./mcv-time-line-event-detail.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, NgFor, DatePipe]
})
export class McvTimeLineEventDetailComponent implements OnInit {
  @Input() event!: McvTimeLineEvent;

  @Output() afterCancel = new EventEmitter<any>();
  @Output() afterSelect = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelect() {
    this.afterSelect.emit(this.event);
  }

  onCancel() {
    this.afterSelect.emit(null);
  }
}
