import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContactListDto } from '../../models/contact-list-dto';

@Component({
  selector: 'app-email-contact',
  templateUrl: './email-contact.component.html',
  styleUrls: ['./email-contact.component.scss']
})
export class EmailContactComponent implements OnInit {
  @Input() item!: ContactListDto;
  @Input() index: number = 0;
  @Input() showRemove: boolean = false;
  @Input() showPhoto: boolean = false;
  @Output() remove = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onRemove() {
    this.remove.emit({ item: this.item, index: this.index });
  }
}
