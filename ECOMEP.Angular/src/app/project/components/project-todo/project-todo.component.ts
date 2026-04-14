import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { AppConfig } from 'src/app/app.config';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectTodoViewComponent } from '../project-todo-view/project-todo-view.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { MatIconModule } from '@angular/material/icon';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

@Component({
  selector: 'app-project-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,

    //Components
    ProjectTodoViewComponent
  ],
  templateUrl: './project-todo.component.html',
  styleUrls: ['./project-todo.component.scss']
})
export class ProjectTodoComponent implements OnInit {

  config = inject(AppConfig);
  dialog = inject(MatDialog);
  utilityService = inject(UtilityService);
  todoApiService = inject(TodoApiService);
  statusMasterService = inject(StatusMasterService);

  totalPages!: number;
  dataList: any[] = [];
  totalRecordsCount!: number;
  statusFC = new FormControl();
  searchFC = new FormControl('');
  statusOptions: StatusMaster[] = [];

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;
  readonly nameOfEntity = this.config.NAMEOF_ENTITY_TODO;
  readonly defaultRoute = this.config.ROUTE_TODO_LIST;
  readonly defaultSort = 'duedate';
  readonly defaultPageSize: number = 30;

  project!: Project;
  pagedListConfig = new PagedListConfig({
    searchKey: null,
    sort: this.defaultSort,
    showAll: false,
    showAssigned: false,
    filters: [],
    route: this.defaultRoute,
    pageSize: this.defaultPageSize,
    pageIndex: 0,
    groupBy: [],
    keyPropertyName: "id",
  });

  @Input() isEditMode: boolean = false;

  @Input('project') set projectValue(val: Project) {
    if (val) {
      this.project = val;
      this.pagedListConfig.filters = [];
      this.pagedListConfig.filters.push(
        { key: 'statusFlag', value: this.config.WFTASK_STATUS_FLAG_PENDING.toString() },
        { key: 'statusFlag', value: this.config.WFTASK_STATUS_FLAG_COMPLETED.toString() },
        { key: 'projectID', value: this.project.id.toString() }
      );
      this.getDataList();
    }
  }

  async ngOnInit() {
    await this.getStatusOptions();
    this.statusFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== 'statusFlag');
            value.forEach((element: StatusMaster) => {
              this.addFilter('statusFlag', element.value.toString());
            });
            this.getDataList();
          }
        }
      );

    this.searchFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(x => {
      this.pagedListConfig.searchKey = x;
      this.getDataList();
    });
  }

  private async getStatusOptions() {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
    const filter = this.pagedListConfig.filters.filter(x => x.key == 'statusFlag');
    if (filter && this.statusOptions.length != 0) {
      const _filter = this.statusOptions.filter(x => filter.some(y => y.value == x.value.toString()));
      this.statusFC.setValue(_filter, { emitEvent: false });
    }
  }

  addFilter(key: string, value: string) {
    const _filter = this.pagedListConfig.filters.find((obj) => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.pagedListConfig.filters.push(new ApiFilter({ key: key, value: value }));
    }
  }

  async getDataList() {
    this.dataList = [];
    const data = await firstValueFrom(this.todoApiService.getPages(
      this.pagedListConfig.pageIndex,
      this.pagedListConfig.pageSize,
      this.pagedListConfig.filters,
      this.pagedListConfig.searchKey,
      this.pagedListConfig.sort,
    ));
    this.totalRecordsCount = data.total;
    this.totalPages = data.pages;
    this.dataList = this.utilityService.updatePagedList<any>(data.list, this.dataList, this.pagedListConfig.keyPropertyName);
  }

  onViewTodo(todo: any) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      todo: todo
    }

    const _dialogRef = this.dialog.open(ProjectTodoViewComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {

      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pagedListConfig.pageSize = e.pageSize;
    this.pagedListConfig.pageIndex = e.pageIndex;
    if (this.pagedListConfig) {
      this.refresh();
    }
  }

  refresh() {
    this.dataList = [];
    this.getDataList();
  }

  openPhotoDialog(member: any) {
    this.dialog.open(ContactPhotoNameDialogComponent, {
      data: member
    });
  }
}
