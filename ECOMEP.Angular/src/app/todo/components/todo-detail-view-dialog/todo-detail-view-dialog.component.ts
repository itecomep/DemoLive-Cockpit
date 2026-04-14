import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Todo, TodoAttachment } from '../../models/todo.model';
import { firstValueFrom } from 'rxjs';
import { TodoApiService } from '../../services/todo-api.service';
import { WFTaskAnalysis } from 'src/app/task-analysis/models/wf-task-analysis';
import { AppConfig } from 'src/app/app.config';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { TodoAgendaComponent } from '../todo-agenda/todo-agenda.component';
import { McvTimeEntryListComponent } from 'src/app/mcv-time-entry/components/mcv-time-entry-list/mcv-time-entry-list.component';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { McvTagEditorComponent } from 'src/app/mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';

@Component({
  selector: 'app-todo-detail-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    //COmponents
    McvTagEditorComponent,
    TodoAgendaComponent,
    McvFileComponent,
    McvTimeEntryListComponent,
    McvActivityListComponent,
  ],
  templateUrl: './todo-detail-view-dialog.component.html',
  styleUrls: ['./todo-detail-view-dialog.component.scss']
})
export class TodoDetailViewDialogComponent {

  // todo!: Todo;

  // readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  // readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  // readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;

  // constructor(
  //   @Inject(MAT_DIALOG_DATA) data: any,
  //   private config: AppConfig,
  //   private todoService: TodoApiService,
  //   private dialog: MatDialogRef<TodoDetailViewDialogComponent>,
  // ) {
  //   if (data) {
  //     this.getTodo(data.todo);
  //   }
  // }

  // async getTodo(todo: WFTaskAnalysis) {
  //   if (todo.entityID) {
  //     const _todo = await firstValueFrom(this.todoService.getById(todo.entityID));
  //     console.log(_todo);
  //     this.todo = _todo;
  //   }
  // }

  // onClose() {
  //   this.dialog.close();
  // }
  
  agendaConfig: any;
  wfTask!: WFTask;
  currentEntity!: Todo;
  nameOfEntity = this.config.NAMEOF_ENTITY_TODO;

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private config: AppConfig,
    private todoService: TodoApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private dialog: MatDialogRef<TodoDetailViewDialogComponent>,
  ) {
    if (data) {
      this.wfTask = data.todo;
      this.getTodo(data.todo);
    }
  }

  async getTodo(todo: WFTaskAnalysis) {
    if (todo.entityID) {
      const _todo = await firstValueFrom(this.todoService.getById(todo.entityID));
      this.currentEntity = _todo;
      this.setAgendaConfig();
    }
  }

  private setAgendaConfig() {
    this.agendaConfig = {
      isReadOnly: true,
      todo: this.currentEntity,
      agenda: this.currentEntity.agendas,
      updateDatabase: false,
      isCheckboxMode: false
    };
  }

  getFilteredAttachments(attachments: TodoAttachment[], typeFlag: number, isMedia: boolean) {
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }

  onClose() {
    this.dialog.close();
  }
}
