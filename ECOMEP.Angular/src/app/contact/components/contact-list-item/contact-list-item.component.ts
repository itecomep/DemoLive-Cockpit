import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact, ContactAssociation } from 'src/app/contact/models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-contact-list-item',
  templateUrl: './contact-list-item.component.html',
  styleUrls: ['./contact-list-item.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor]
})
export class ContactListItemComponent implements OnInit
{

  get isSelected(): boolean { return this.entityService.selectedItems.includes(this.item); }

  item!: Contact;
  @Input('item') set itemValue(value: Contact)
  {
    if (value)
    {
      // console.log(value);
      this.item = value;
    }
  }
  @Input() association!: ContactAssociation;
  @Input() index: number = 0;
  @Input() showRemove: boolean = false;
  @Input() showPhoto: boolean = false;
  @Input() showCheckBox: boolean = false;
  @Output() remove = new EventEmitter<any>();

  constructor(
    private entityService: ContactApiService
  )
  {

  }

  ngOnInit()
  {
  }

  onRemove()
  {
    this.remove.emit({ item: this.item, index: this.index });
  }

  onCheckboxChange(event: MatCheckboxChange)
  {
    if (event.checked)
    {
      this.onSelect(this.item);
    } else
    {
      this.onRemoveFromSelection(this.item);
    }

  }

  onSelect(item: Contact)
  {
    this.entityService.selectedItems.push(item);
  }

  onRemoveFromSelection(item: Contact)
  {
    this.entityService.selectedItems = this.entityService.selectedItems.filter(x => x.id != item.id);
  }
}
