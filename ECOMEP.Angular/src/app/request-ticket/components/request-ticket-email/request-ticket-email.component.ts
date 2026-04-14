import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestTicketAssignee } from '../../models/request-ticket-assignee';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-request-ticket-email',
    templateUrl: './request-ticket-email.component.html',
    styleUrls: ['./request-ticket-email.component.scss'],
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, MatIconModule]
})
export class RequestTicketEmailComponent implements OnInit
{

  @Input() item!: RequestTicketAssignee;
  @Input() index: number = 0;
  @Input() showRemove: boolean = false;
  @Input() showPhoto: boolean = false;
  @Output() remove = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onRemove()
  {
    this.remove.emit({ item: this.item, index: this.index });
  }

}
