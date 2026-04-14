import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoApiService } from '../../services/todo-api.service';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppConfig } from 'src/app/app.config';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { Todo, TodoAnalysis } from '../../models/todo.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TodoDetailViewDialogComponent } from '../todo-detail-view-dialog/todo-detail-view-dialog.component';
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { McvActivityListItemComponent } from 'src/app/mcv-activity/components/mcv-activity-list-item/mcv-activity-list-item.component';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-todo-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    MatSelectModule,

    //Components
    FooterComponent,
    McvFilterSidenavComponent,
    McvActivityListItemComponent,
  ],
  templateUrl: './todo-analysis.component.html',
  styleUrls: ['./todo-analysis.component.scss']
})
export class TodoAnalysisComponent {

  config = inject(AppConfig);
  dialog = inject(MatDialog);
  authService = inject(AuthService);
  utilityService = inject(UtilityService);
  todoApiService = inject(TodoApiService);
  contactTeamService = inject(ContactTeamApiService);

  dataList: TodoAnalysis[] = [];
  dateFC!: FormGroup;
  searchFC!: FormControl;
  teamFC = new FormControl();
  statusFC: FormControl = new FormControl();

  statusOptions: any[] = [
    { key: 'Active', value: this.config.TODO_STATUS_FLAG_ACTIVE.toString() },
    { key: 'Completed', value: this.config.TODO_STATUS_FLAG_COMPLETED.toString() },
  ];

  TODO_AGENDA_STATUS_FLAG_PENDING = this.config.TODO_AGENDA_STATUS_FLAG_PENDING;
  TODO_AGENDA_STATUS_FLAG_COMPLETED = this.config.TODO_AGENDA_STATUS_FLAG_COMPLETED;

  searchKey?: string;
  showAll: boolean = false;
  sort: string = 'duedate desc';

  isExpanded: boolean[] = [];
  distinctTitle: string[] = [];
  distinctAssignedTo: string[] = [];
  distinctAssignedBy: string[] = [];

  filteredTitle: string[] = [];
  filteredAssignedTo: string[] = [];
  filteredAssignedBy: string[] = [];

  selectedTitle: string[] = [];
  selectedAssignedTo: string[] = [];
  selectedAssignedBy: string[] = [];

  assignedtitle: string = '';
  assignedToSearch: string = '';
  assignedBySearch: string = '';

  originalDataList: any[] = [];
  teamOptions: ContactTeam[] = [];
  showFilters: boolean = true;
  isLoading: boolean = false;
  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;

  filters: ApiFilter[] = [
    { key: 'statusFlag', value: this.config.TODO_STATUS_FLAG_ACTIVE.toString() },
    // { key: 'statusFlag', value: this.config.TODO_STATUS_FLAG_COMPLETED.toString() },
    { key: "RangeStart", value: this.utilityService.getMonthStart().toISOString() },
    { key: "RangeEnd", value: this.utilityService.getMonthEnd().toISOString() },
  ];

  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get isMaster() { return this.authService.currentUserStore ? this.authService.currentUserStore.roles.includes('MASTER') : false }

  async ngOnInit() {
    if (!this.dateFC) {
      this.buildForm();
    }

    if (this.authService.currentUserStore != null) {
      //User is a TeamLeader
      if (this.authService.isTeamLeader) {
        const _team = this.authService.currentUserStore.teams.find(x => x.leaderID == this.authService.currentUserStore?.contact.id);
        if (_team) {
          const _teamFilter = { key: 'teamID', value: _team.id.toString() };
          this.filters.push(_teamFilter);
        }
      }
      await this.getDataList();
    }
  }

  onOpenTodoDetails(todo: Todo) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.data = {
      todo: todo
    }

    const _dialogRef = this.dialog.open(TodoDetailViewDialogComponent, _dialogConfig);
    // _dialogRef.afterClosed().subscribe
  }

  clearSearch(event: Event) {
    this.assignedToSearch = '';
    this.assignedBySearch = '';
    this.assignedtitle = '';
    this.filterDistinctAssignedTo();
    this.filterDistinctAssignedBy();
    this.filterDistinctTitle();
  }

  buildForm() {
    this.dateFC = new FormGroup({
      start: new FormControl(this.utilityService.getMonthStart()),
      end: new FormControl(this.utilityService.getMonthEnd()),
    });

    //Date Range Selection Change
    this.dateFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        if (value && value.start && value.end) {
          this.filters = this.filters.filter(
            (x) => x.key !== "RangeStart" && x.key != "RangeEnd"
          );
          this.filters.push({
            key: "RangeStart",
            value: value.start.toISOString(),
          });
          this.filters.push({
            key: "RangeEnd",
            value: value.end.toISOString(),
          });

          this.search();
          this.extractDistinctValues()
        }
      });

    //Search Value
    this.searchFC = new FormControl();
    this.searchFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.searchKey = value;
          this.search();
        }
      });


    //StatusFlag value
    this.statusFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.filters = this.filters.filter(i => i.key !== 'statusFlag');
            value.forEach((element: any) => {
              this.addFilter('statusFlag', element.value.toString());
            });
            this.search();
          }
        }
      );
    this.statusFC.setValue([this.statusOptions[0].value], { emitEvent: false });

    this.getTeamOptions();
    this.teamFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          console.log('Team filter changed:', value);
          this.filters = this.filters.filter(i => i.key !== "teamID");
          if (value && value.id) {
            this.addFilter('teamID', value.id.toString());
            this.search();
          }
        }
      );

  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
  }

  addFilter(key: string, value: string) {
    const _filter = this.filters.find((obj) => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.filters.push(new ApiFilter({ key: key, value: value }));
    }
  }

  search() {
    this.dataList = [];
    this.getDataList();
  }

  refreshFilters() {
    this.searchFC.reset();
  }

  onRefresh() {
    this.searchKey = undefined;
    this.searchFC.setValue(null);
    this.getDataList();
  }

  filterDistinctAssignedTo() {
    const searchLower = this.assignedToSearch.toLowerCase();
    this.filteredAssignedTo = this.distinctAssignedTo.filter(person =>
      person.toLowerCase().includes(searchLower)
    );
  }

  filterDistinctAssignedBy() {
    const searchLower = this.assignedBySearch.toLowerCase();
    this.filteredAssignedBy = this.distinctAssignedBy.filter(person =>
      person.toLowerCase().includes(searchLower)
    );
  }

  filterDistinctTitle() {
    const searchLower = this.assignedtitle.toLowerCase();
    this.filteredTitle = this.distinctTitle.filter(title =>
      title.toLowerCase().includes(searchLower)
    );
  }

  private async getDataList() {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.dataList = await firstValueFrom(this.todoApiService.getTodoAnalysis(
        this.filters,
        this.searchKey,
        this.sort,
      ));

      // this.total = new WFTaskAnalysis();
      // this.dataList.forEach(x => {

      //   this.total.delay += x.delay;
      //   this.total.mHrAssessed += x.mHrAssessed;
      //   this.total.mHrAssigned += x.mHrAssigned;
      //   this.total.mHrConsumed += x.mHrConsumed;

      // });
      // this.calculateTotal(this.dataList);
      this.extractDistinctValues();
      this.originalDataList = [...this.dataList];
    } catch (error) {
      console.error('Error fetching todo analysis data:', error);
      this.dataList = [];
      this.originalDataList = [];
    } finally {
      this.isLoading = false;
    }
  }

  extractDistinctValues() {
    this.distinctAssignedTo = [...new Set(this.dataList.map(item => item.assigner.name))];
    this.distinctAssignedBy = [...new Set(this.dataList.map(item => item.assignee.name))];
    this.distinctTitle = [...new Set(this.dataList.map(item => item.title))];
    this.filteredAssignedTo = [...this.distinctAssignedTo];
    this.filteredAssignedBy = [...this.distinctAssignedBy];
    this.filteredTitle = [...this.distinctTitle];
  }

  toggleSelectAll(filterType: 'assignedTo' | 'assignedBy' | 'task' | 'title'): void {
    const distinctValues = this.getDistinctValues(filterType);

    switch (filterType) {
      case 'assignedTo':
        this.selectedAssignedTo = this.isAllSelected(filterType) ? [] : [...distinctValues];
        break;
      case 'assignedBy':
        this.selectedAssignedBy = this.isAllSelected(filterType) ? [] : [...distinctValues];
        break;
      case 'title':
        this.selectedTitle = this.isAllSelected(filterType) ? [] : [...distinctValues];
        break;
    }

    this.applyFilters();
  }

  getDistinctValues(filterType: 'assignedTo' | 'assignedBy' | 'task' | 'title'): string[] {
    switch (filterType) {
      case 'assignedTo':
        return this.distinctAssignedTo;
      case 'assignedBy':
        return this.distinctAssignedBy;
      case 'title':
        return this.distinctTitle;
      default:
        return [];
    }
  }

  isAllSelected(filterType: 'assignedTo' | 'assignedBy' | 'task' | 'title'): boolean {
    const distinctValues = this.getDistinctValues(filterType);
    switch (filterType) {
      case 'assignedTo':
        return this.selectedAssignedTo.length === distinctValues.length && this.selectedAssignedTo.length > 0;
      case 'assignedBy':
        return this.selectedAssignedBy.length === distinctValues.length && this.selectedAssignedBy.length > 0;
      case 'title':
        return this.selectedTitle.length === distinctValues.length && this.selectedTitle.length > 0;
      default:
        return false;
    }
  }

  applyFilters() {
    let filteredList = [...this.originalDataList]; // Start with a copy of the original data
    if (this.searchKey) {

      const searchLower = this.searchKey.toLowerCase();

      filteredList = filteredList.filter(item =>
        (item.assigner.name?.toLowerCase().includes(searchLower) || '') ||
        (item.assignee.name?.toLowerCase().includes(searchLower) || '') ||
        (item.title?.toLowerCase().includes(searchLower) || '')
      );
    }
    // Apply the filter for Assigned To if selected
    if (this.selectedAssignedTo.length > 0) {
      filteredList = filteredList.filter(item => this.selectedAssignedTo.includes(item.assigner.name));
    }

    // Apply the filter for Assigned By if selected
    if (this.selectedAssignedBy.length > 0) {
      filteredList = filteredList.filter(item => this.selectedAssignedBy.includes(item.assignee.name));
    }

    // Apply the filter for Title if selected
    if (this.selectedTitle.length > 0) {
      filteredList = filteredList.filter(item => this.selectedTitle.includes(item.title));
    }
    // Update the data list with the filtered list
    this.dataList = filteredList;

  }



  toggleSelection(value: string, type: string) {
    if (type === 'assignedTo') {
      this.selectedAssignedTo.includes(value)
        ? this.selectedAssignedTo.splice(this.selectedAssignedTo.indexOf(value), 1)
        : this.selectedAssignedTo.push(value);
    } else if (type === 'assignedBy') {
      this.selectedAssignedBy.includes(value)
        ? this.selectedAssignedBy.splice(this.selectedAssignedBy.indexOf(value), 1)
        : this.selectedAssignedBy.push(value);
    } else if (type === 'title') {
      this.selectedTitle.includes(value)
        ? this.selectedTitle.splice(this.selectedTitle.indexOf(value), 1)
        : this.selectedTitle.push(value);
    }
    this.applyFilters();
  }

  toggleExpand(i: number) {
    this.isExpanded[i] = !this.isExpanded[i];
  }


  clearSelection(type: string) {
    if (type === 'assignedTo') {
      this.selectedAssignedTo = [];
    } else if (type === 'assignedBy') {
      this.selectedAssignedBy = [];
    } else if (type === 'title') {
      this.selectedTitle = [];
    }

    this.applyFilters(); // Apply filters after clearing the selection
  }

  resetFilter() {
    this.selectedAssignedTo = [];
    this.selectedAssignedBy = [];
    this.selectedTitle = [];
    this.dataList = [...this.originalDataList]; // Restore full list

  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
