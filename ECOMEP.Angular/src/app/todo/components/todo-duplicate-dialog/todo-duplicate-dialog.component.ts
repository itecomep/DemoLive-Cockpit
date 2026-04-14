import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TodoCreateComponent } from '../todo-create/todo-create.component';
import { AppConfig } from 'src/app/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-duplicate-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,

    //Components
    TodoCreateComponent
  ],
  templateUrl: './todo-duplicate-dialog.component.html',
  styleUrls: ['./todo-duplicate-dialog.component.scss']
})
export class TodoDuplicateDialogComponent {
  data: any
  listRoute: string = this.config.ROUTE_TODO_LIST;

  constructor(
    private router: Router,
    private config: AppConfig,
    private dialog: MatDialogRef<TodoDuplicateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data;
    // console.log(this.data);
    // console.log('childDialogData', data);
  }

  onClose(e: any) {
    this.dialog.close(e);
  }

  onCreate(obj: any) {
    const url = this.listRoute + '/' + obj.id;
    this.router.navigateByUrl(url);
    this.dialog.close(obj);
  }
}