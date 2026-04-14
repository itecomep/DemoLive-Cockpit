import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestTicket } from 'src/app/request-ticket/models/request-ticket';
import { NgIf, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-request-ticket-list-item',
    templateUrl: './request-ticket-list-item.component.html',
    styleUrls: ['./request-ticket-list-item.component.scss'],
    standalone: true,
    imports: [MatTooltipModule, NgIf, DatePipe]
})
export class RequestTicketListItemComponent implements OnInit
{
  @Input() item!: RequestTicket;
  @Input() index: number = 0;
  @Input() showRemove: boolean = false;
  @Input() showAll: boolean = false;
  @Output() remove = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onRemove()
  {
    this.remove.emit({ item: this.item, index: this.index });
  }
}
