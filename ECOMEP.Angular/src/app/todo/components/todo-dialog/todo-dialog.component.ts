import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TodoCreateComponent } from '../todo-create/todo-create.component';
import { TodoComponent } from '../todo/todo.component';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-todo-dialog',
    templateUrl: './todo-dialog.component.html',
    styleUrls: ['./todo-dialog.component.scss'],
    standalone: true,
    imports: [
      MatButtonModule, 
      MatIconModule, 
      MatDialogModule, 
      CommonModule, 

      //Components
      TodoComponent, 
    ]
})
export class TodoDialogComponent
{
  data: any;
  constructor(
    private dialog: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  )
  {
    this.data = data;
  }

  onClose(e: any)
  {
    this.dialog.close(e);
  }
}
