import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';
import { TodoAgenda } from '../../models/todo-agendaas';
import { TodoApiService } from '../../services/todo-api.service';
import { TodoAgendaApiService } from '../../services/todo-agenda-api.service';
import { firstValueFrom } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'todo-agenda',
  templateUrl: './todo-agenda.component.html',
  styleUrls: ['./todo-agenda.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class TodoAgendaComponent {
    @Input() checklistSearch: string = '';
  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;
  form: any;

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get isPermissionEdit() { return this.todoService.isPermissionEdit; }

  todo!: Todo;
  agenda: TodoAgenda[] = [];
  isReadOnly: boolean = false;
  updateDatabase: boolean = false;
  isCheckboxMode: boolean = false;
  @Input('config') set configValue(value: {
    isReadOnly: boolean,
    todo: Todo,
    agenda: TodoAgenda[],
    updateDatabase: boolean,
    isCheckboxMode: boolean
  }) {
    if (value) {
      this.isReadOnly = value.isReadOnly;
      this.todo = value.todo;
      this.agenda = value.agenda;
      this.updateDatabase = value.updateDatabase;
      this.isCheckboxMode = value.isCheckboxMode;
      this.refresh();
    }
  }

  @Output() update = new EventEmitter<TodoAgenda[]>();
  constructor(
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private todoService: TodoApiService,
    private agendaService: TodoAgendaApiService
  ) {

  }

  buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] })
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  refresh() {
    if (this.todo && this.agenda.length == 0) {
      this.getAgenda();
    }
  }

  async getAgenda() {
    this.agenda = await firstValueFrom(this.agendaService.get([{ key: 'TodoID', value: this.todo.id.toString() }]));
  }


 get filteredAgenda(): TodoAgenda[] {
  let data = this.agenda;

  if (this.checklistSearch) {
    const search = this.checklistSearch.toLowerCase();

    data = data.filter(item =>
      this.getItemOnly(item.title).toLowerCase().includes(search) ||
      this.getCategory(item.title).toLowerCase().includes(search)
    );
  }

  // ✅ SORT BY STAGE + CATEGORY
  return data.sort((a, b) => {
    const aStage = this.getStage(a.title);
    const bStage = this.getStage(b.title);

    const aCat = this.getCategoryOnly(a.title);
    const bCat = this.getCategoryOnly(b.title);

    if (aStage !== bStage) return aStage.localeCompare(bStage);
    return aCat.localeCompare(bCat);
  });
}

getCategory(fullTitle: string): string {
  if (!fullTitle) return 'General';
  return fullTitle.split(':')[0].trim(); // Stage -> Category
}

getStage(fullTitle: string): string {
  if (fullTitle && fullTitle.includes('->')) {
    return fullTitle.split('->')[0].trim();
  }
  return '';
}

getCategoryOnly(fullTitle: string): string {
  if (fullTitle && fullTitle.includes('->')) {
    const afterStage = fullTitle.split('->')[1];
    return afterStage.split(':')[0].trim();
  }
  return 'General';
}

// getItemOnly(fullTitle: string): string {
//   if (!fullTitle) return '';
//   const parts = fullTitle.split(':');
//   if (parts.length > 1) {
//     return parts.slice(1).join(':').trim();
//   }
//   return fullTitle;
// }



getItemOnly(fullTitle: string): string {
  if (!fullTitle) return '';

  // ✅ simply return full value (no cutting)
  return fullTitle.trim();
}



getCategoryTotalCount(category: string): number {
  return this.filteredAgenda.filter(item =>
    this.getCategory(item.title) === category
  ).length;
}

// numbering of the checklist 

getItemNumber(index: number): number {
  const list = this.filteredAgenda; // ✅ cache once
  let count = 1;

  for (let j = 0; j < index; j++) {
    if (
      this.getGroupKey(list[j].title) ===
      this.getGroupKey(list[index].title)
    ) {
      count++;
    }
  }

  return count;
}

  onCreate() {
    let obj = new TodoAgenda();

    if (this.f['title'].value == null || this.f['title'].value == '') {
      this.utilityService.showSwalToast('', 'Please enter data.', 'error');
      return;
    }
    obj.title = this.f['title'].value;
    obj.todoID = this.todo ? this.todo.id : 0;

    if (this.updateDatabase) {

      this.agendaService.create(obj).subscribe(
        (data: any) => {
          if (data) {
            this.agenda.push(data);
            // this.agenda.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
          }
          this.utilityService.showSwalToast(
            "Success!",
            "Save Successfull.",
          );
          this.form.reset();
          this.update.emit(this.agenda);
        }
      );
    } else {
      this.agenda.push(obj);
      this.form.reset();
      // this.agenda.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      this.update.emit(this.agenda);
    }
  }

  onChecked(item: any) {
    if (item.statusFlag === 0) {
      item.statusFlag = 1;
    } else {
      item.statusFlag = 0;
    }

    this.agendaService.update(item).subscribe(
      () => {
        this.utilityService.showSwalToast(
          'Success!',
          'Save successful.',
        );
        this.update.emit(this.agenda);
      }
    );
  }

  onDelete(obj: TodoAgenda) {
    if (obj) {
      if (this.updateDatabase) {
        this.agendaService.delete(obj.id).subscribe(
          (data: any) => {
            this.agenda = this.agenda.filter(x => x.id !== obj.id);
            this.utilityService.showSwalToast(
              "Success!",
              "Delete Successfull.",
            );
            this.update.emit(this.agenda);
          }
        );
      } else {
        this.agenda = this.agenda.filter(x => x.title !== obj.title);
        this.update.emit(this.agenda);
      }
    }
  }

  // stored in single folder 
  getGroupKey(fullTitle: string): string {
    const stage = this.getStage(fullTitle);
    const category = this.getCategoryOnly(fullTitle);
    return `${stage}__${category}`;
  }
}
