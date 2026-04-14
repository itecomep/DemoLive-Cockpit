import { Component, inject, Input } from '@angular/core';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { NgIf, NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { AppConfig } from 'src/app/app.config';

@Component({
    selector: 'app-wftask-title-bar',
    templateUrl: './wftask-title-bar.component.html',
    styleUrls: ['./wftask-title-bar.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass, DecimalPipe, DatePipe]
})
export class WftaskTitleBarComponent
{
  config = inject(AppConfig);

  NAMEOF_ENTITY_REQUEST_TICKET = this.config.NAMEOF_ENTITY_REQUEST_TICKET;

  @Input() task?: WFTask;
  constructor() { }

  ngOnInit(): void
  {
  }
}
