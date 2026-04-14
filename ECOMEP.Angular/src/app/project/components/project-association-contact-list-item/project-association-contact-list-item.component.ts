import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactAssociation } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ProjectAssociation, ProjectAssociationListItem } from '../../models/project-association.model';

@Component({
  selector: 'app-project-association-contact-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-association-contact-list-item.component.html',
  styleUrls: ['./project-association-contact-list-item.component.scss']
})
export class ProjectAssociationContactListItemComponent implements OnInit
{
   get isSelected(): boolean { return this.entityService.selectedItems.includes(this.item); }
  
    item!: ProjectAssociationListItem;
    @Input('item') set itemValue(value: ProjectAssociationListItem)
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
  
    onSelect(item: ProjectAssociationListItem)
    {
      this.entityService.selectedItems.push(item);
    }
  
    onRemoveFromSelection(item: ProjectAssociationListItem)
    {
      this.entityService.selectedItems = this.entityService.selectedItems.filter(x => x.id != item.id);
    }

}
