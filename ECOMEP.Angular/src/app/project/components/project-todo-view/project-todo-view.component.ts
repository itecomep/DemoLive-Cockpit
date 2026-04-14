import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { Todo } from 'src/app/todo/models/todo.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppConfig } from 'src/app/app.config';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-project-todo-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,

    //Components
    McvFileComponent
  ],
  templateUrl: './project-todo-view.component.html',
  styleUrls: ['./project-todo-view.component.scss']
})
export class ProjectTodoViewComponent implements OnInit {

  todo!: Todo;

  config = inject(AppConfig);
  data = inject(MAT_DIALOG_DATA);
  todoApiService = inject(TodoApiService);
  dialogRef = inject(MatDialogRef<ProjectTodoViewComponent>);

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;

  ngOnInit() {
    this.getTodo(this.data.todo);
  }

  onClose() {
    this.dialogRef.close();
  }

  async getTodo(todo: any) {
    this.todo = await firstValueFrom(this.todoApiService.getById(todo.id));
  }
}
