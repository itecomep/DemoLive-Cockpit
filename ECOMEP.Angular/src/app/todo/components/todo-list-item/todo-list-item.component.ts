import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../../../todo/models/todo.model';
import { NgIf, DatePipe, CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppConfig } from 'src/app/app.config';
import { MatDialog } from '@angular/material/dialog';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss'],
  standalone: true,
  imports: [
    MatTooltipModule,
    DatePipe,
    CommonModule
  ]
})
export class TodoListItemComponent implements OnInit {
  @Input() item!: Todo;
  @Input() index: number = 0;
  @Input() showRemove: boolean = false;
  @Input() showAll: boolean = false;
  @Output() remove = new EventEmitter<any>();

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;

  constructor(
    private config: AppConfig,
    private dialog: MatDialog
  ) { }

  ngOnInit() { }

  onRemove() {
    this.remove.emit({ item: this.item, index: this.index });
  }

}
