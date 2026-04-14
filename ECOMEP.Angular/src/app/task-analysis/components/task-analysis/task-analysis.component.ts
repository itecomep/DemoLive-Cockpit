import { Component } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AppPermissions } from 'src/app/app.permissions';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Contact } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { McvSelectAllComponent } from 'src/app/mcv-select-all/components/mcv-select-all/mcv-select-all.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { BannerData } from 'src/app/shared/models/banner-data';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { WFTaskAnalysis } from '../../models/wf-task-analysis';
import { TaskAnalysisAssessmentComponent } from '../task-analysis-assessment/task-analysis-assessment.component';
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { DialogConfig } from '@angular/cdk/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TodoDetailViewDialogComponent } from 'src/app/todo/components/todo-detail-view-dialog/todo-detail-view-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'task-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatTooltipModule,
    DecimalPipe,
    DatePipe,
    MatMenuModule,
    MatCheckboxModule,
    //Components
    FooterComponent,
    McvSelectAllComponent,
    McvFilterSidenavComponent,
    TaskAnalysisAssessmentComponent,
    TodoDetailViewDialogComponent
  ],
  templateUrl: './task-analysis.component.html',
  styleUrls: ['./task-analysis.component.scss']
})
export class TaskAnalysisComponent {

  filters: ApiFilter[] = [
    { key: "StatusFlag", value: this.config.WFTASK_STATUS_FLAG_COMPLETED.toString() },
    // { key: "StatusFlag", value: this.config.WFTASK_STATUS_FLAG_PENDING.toString() },
    { key: "RangeStart", value: this.utility.getMonthStart().toISOString() },
    { key: "RangeEnd", value: this.utility.getMonthEnd().toISOString() },
  ];
  searchKey?: string;
  sort: string = 'completedDate desc';
  sortOptions: any[] = [  // { label: 'Code', sortKey: 'code', icon: 'north' },
    // { label: 'Code', sortKey: 'code desc', icon: 'south' },
    // { label: 'Modified', sortKey: 'modified', icon: 'north' },
    // { label: 'Modified', sortKey: 'modified desc', icon: 'south' },
    // { label: 'Created', sortKey: 'created', icon: 'north' },
    // { label: 'Created', sortKey: 'created desc', icon: 'south' },
    // { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate', icon: 'north' },
    // { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate desc', icon: 'south' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
  ];

  dataList: WFTaskAnalysis[] = [];
  total: WFTaskAnalysis = new WFTaskAnalysis();
  get isMobileView(): boolean { return this.utility.isMobileView; }
  isExpanded: boolean[] = [];
  isLeader: boolean = false;
  teamOptions: ContactTeam[] = [];
  teamFC = new FormControl();
  originalDataList: any[] = [];
  dateFC!: FormGroup;
  searchFC!: FormControl;
  userFC = new FormControl();
  showAll: boolean = false;
  userOptions: Contact[] = [];
  isSorted: boolean = false;
  distinctAssignedTo: string[] = [];
  distinctAssignedBy: string[] = [];
  distinctTask: string[] = [];
  distinctTitle: string[] = [];

  filteredAssignedTo: string[] = [];
  filteredAssignedBy: string[] = [];
  filteredTask: string[] = [];
  filteredTitle: string[] = [];

  selectedAssignedTo: string[] = [];
  selectedAssignedBy: string[] = [];
  selectedTask: string[] = [];
  selectedTitle: string[] = [];

  assignedToSearch: string = '';
  assignedBySearch: string = '';
  assignedtaskSearch: string = '';
  assignedtitle: string = '';
  sortState: { 
    activeColumn: string; // Active column should be a string
    [key: string]: '' | 'newFirst' | 'oldFirst' | string; // Allow any other property to be of type '' | 'newFirst' | 'oldFirst'
  } = {
    activeColumn: '', // No active column initially
    startDate: '', // Initial state (no sorting applied)
    dueDate: '',      // Initial state (no sorting applied)
    completedDate: '' // Initial state (no sorting applied)
  };

  get isPermissionShowAll() {
    return this.authService.isInAnyRole([
      this.permissions.TASK_ANALYSIS_SHOW_ALL,
    ]);
  }
  get isPermissionExcel() {
    return this.authService.isInAnyRole([
      this.permissions.TASK_ANALYSIS_EXCEL,
    ]);
  }

  remunerationData!: BannerData;
  amhrData!: BannerData;
  vhrData!: BannerData;
  expectedVhrData!: BannerData;

  get currentUser(): Contact | any {
    if (this.authService.currentUserStore) {
      return this.authService.currentUserStore.contact ? this.authService.currentUserStore.contact : null;
    }
  }

  constructor(
    public authService: AuthService,
    private service: WFTaskApiService,
    private utility: UtilityService,
    private permissions: AppPermissions,
    private config: AppConfig,
    private contactService: ContactApiService,
    private contactTeamService: ContactTeamApiService,
    private dialog: MatDialog,
  ) {

    if (this.authService.currentUserStore) {
      this.filters.push(
        {
          key: "ContactID",
          value: this.authService.currentUserStore.contact.id.toString()
        }
      )
    }
  }

  async ngOnInit() {
    if(!this.dateFC){
      this.buildForm();
    }
    await this.getTeamOptions();

    if (this.authService.currentUserStore)
      this.getVHrData(
        this.authService.currentUserStore.contact.id,
        this.utility.getMonthStart(),
        this.utility.getMonthEnd()
      );

    this.getDataList();

  }

  private addFilter(key: string, value: string) {
    const _filter = this.filters.find(obj => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.filters.push({ key: key, value: value });
    }
  }


  buildForm() {
    this.dateFC = new FormGroup({
      start: new FormControl(this.utility.getMonthStart()),
      end: new FormControl(this.utility.getMonthEnd()),
    });

    this.dateFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
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

    this.searchFC = new FormControl();
    this.searchFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.searchKey = value;
          this.search();
        }
      });

    this.userFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.filters = this.filters.filter(i => i.key !== "ContactID");
            value.forEach((contact: Contact) => {
              this.filters = this.filters.filter(
                (x) => x.key !== "ContactID"
              );
              this.filters.push({
                key: "ContactID",
                value: contact.id.toString(),
              });
            });
            this.search();
          }
        }
      );

    this.teamFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.filters = this.filters.filter(i => i.key !== "teamID");
            value.forEach((element: ContactTeam) => {
              this.addFilter('teamID', element.id.toString());
            });
            this.search();
          }
        }
      );
  }

  checkIsTeamLeader(){
    if (this.authService.currentUserStore) {
      const _contact = this.authService.currentUserStore.contact;
      if (_contact) {
        // console.log('this.teamOptions',this.teamOptions);
        this.teamOptions.forEach((team: ContactTeam) => {
          if (_contact.id == team.leaderID) {
           this.isLeader = true;
          //  this.teamFC.setValue([team]);
           this.filters = this.filters.filter(i => i.key !== "teamID");
           [team].forEach((element: ContactTeam) => {
             this.addFilter('teamID', element.id.toString());
             this.filters = this.filters.filter(obj => !(obj.key === "ContactID" ));
           });
           this.search();
     
          }
        });
      }
    }
  }

  getVHrData(contactID: number, start: Date, end: Date) {
    const _filters = [
      { key: "ContactID", value: contactID },
      { key: "RangeStart", value: start.toISOString() },
      { key: "RangeEnd", value: end.toISOString() },
    ];
  }

  private async getUserOptions() {
    this.userOptions = await firstValueFrom(this.contactService.get([{ key: "usersOnly", value: 'true' }, { key: "AppointmentstatusFlag", value: this.config.TEAM_APPOINTMENT_STATUS_APPOINTED.toString() }]));
  }
  private async getDataList() {

    this.dataList = await firstValueFrom(this.service
      .getAnalysis('full',
        this.filters,
        this.searchKey,
        this.sort,
      ))

    this.total = new WFTaskAnalysis();
    this.dataList.forEach(x => {

      this.total.delay += x.delay;
      this.total.mHrAssessed += x.mHrAssessed;
      this.total.mHrAssigned += x.mHrAssigned;
      this.total.mHrConsumed += x.mHrConsumed;

    });
    this.calculateTotal(this.dataList);
    this.extractDistinctValues();
    this.originalDataList = [...this.dataList];
  }

  extractDistinctValues() {
    this.distinctAssignedTo = [...new Set(this.dataList.map(item => item.person))];
    this.distinctAssignedBy = [...new Set(this.dataList.map(item => item.assignedBy))];
    this.distinctTask = [...new Set(this.dataList.map(item => item.taskTitle))];
    this.distinctTitle = [...new Set(this.dataList.map(item => item.entityTitle))];
    this.filteredAssignedTo = [...this.distinctAssignedTo]; 
    this.filteredAssignedBy = [...this.distinctAssignedBy]; 
    this.filteredTask = [...this.distinctTask]; 
    this.filteredTitle = [...this.distinctTitle]; 
  }

  calculateTotal(dataList: WFTaskAnalysis[]) {
    this.total = new WFTaskAnalysis();
    dataList.forEach(x => {

      this.total.delay += x.delay;
      this.total.mHrAssessed += x.mHrAssessed;
      this.total.mHrAssigned += x.mHrAssigned;
      this.total.mHrConsumed += x.mHrConsumed;

    });
  }


  search() {
    this.dataList = [];
    this.getDataList();
  }
  
  onRefresh() {
    this.searchKey = undefined;
    this.searchFC.setValue(null);
    this.getDataList();
  }

  onToggleShowAll() {
    this.showAll = !this.showAll;
    this.showAll = this.showAll;
    if (this.showAll) {
      this.filters = this.filters.filter(
        (x) => x.key !== "ContactID"
      );
      if (this.userOptions.length == 0) {
        this.getUserOptions();
      }
    } else {
      if (this.authService.currentUserStore)
        this.filters.push({
          key: "ContactID",
          value: this.authService.currentUserStore.contact.id.toString(),
        });
    }
    this.search();
  }

  onExportExcel() {
    this.service.exportAnalysisExcel(
      'full',
      this.filters,
      this.searchKey,
      this.sort
    );
  }

  toggleExpand(i: number) {
    this.isExpanded[i] = !this.isExpanded[i];
  }

  refreshFilters() {
    this.searchFC.reset();
  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
    this.checkIsTeamLeader()  
  }

  onOpenTodoDetails(wfTask:WFTaskAnalysis){
    console.log(wfTask);
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.data = {
      todo: wfTask
    }

    const _dialogRef = this.dialog.open(TodoDetailViewDialogComponent,_dialogConfig);
    // _dialogRef.afterClosed().subscribe
  }


  sortData(column: keyof WFTaskAnalysis | '') {
    if (column === '') {
      // Reset to default (original data) but apply the filters again
      const dataToFilter = this.originalDataList;
  
      // Apply filters to the original data list
      this.dataList = dataToFilter.filter(item => {
        return (
          (this.selectedAssignedTo.length === 0 || this.selectedAssignedTo.includes(item.person)) &&
          (this.selectedAssignedBy.length === 0 || this.selectedAssignedBy.includes(item.assignedBy)) &&
          (this.selectedTask.length === 0 || this.selectedTask.includes(item.taskTitle)) &&
          (this.selectedTitle.length === 0 || this.selectedTitle.includes(item.entityTitle))
        );
      });
  
      // Reset the sort state to default
      this.sortState = { 
        activeColumn: '',
        startDate: '',
        dueDate: '',
        completedDate: ''
      };
      this.isSorted = false; // Set isSorted to false when sorting is reset
      return; // Exit the function if no sorting is selected
    }
  
    // If the clicked column is already the active column, cycle through the three states
    const currentSort = this.sortState[column];
  
    if (currentSort === 'newFirst') {
      // If it's 'newFirst', change to 'oldFirst'
      this.sortState[column] = 'oldFirst';
    } else if (currentSort === 'oldFirst') {
      // If it's 'oldFirst', reset to default (no sorting)
      this.sortState[column] = '';
      this.sortState.activeColumn = '';
      const dataToFilter = this.originalDataList;
  
      // Apply filters to the original data list
      this.dataList = dataToFilter.filter(item => {
        return (
          (this.selectedAssignedTo.length === 0 || this.selectedAssignedTo.includes(item.person)) &&
          (this.selectedAssignedBy.length === 0 || this.selectedAssignedBy.includes(item.assignedBy)) &&
          (this.selectedTask.length === 0 || this.selectedTask.includes(item.taskTitle)) &&
          (this.selectedTitle.length === 0 || this.selectedTitle.includes(item.entityTitle))
        );
      });
  
      this.isSorted = false; // Set isSorted to false when sorting is reset
      return; // Exit the function if reset is selected
    } else {
      // If no sorting is applied, set it to 'newFirst' (ascending order)
      this.sortState[column] = 'newFirst';
    }
  
    // Set the active column
    this.sortState['activeColumn'] = column;
  
    // Reset other columns' sort state to '' (no sort)
    for (let key in this.sortState) {
      if (key !== column && key !== 'activeColumn') {
        this.sortState[key] = ''; // Reset other columns' sort state to no sort
      }
    }
  
    // Sorting logic: Compare dates for the active column
    const sortedData = [...this.dataList].sort((a, b) => {
      const dateA = new Date(a[column] as string);
      const dateB = new Date(b[column] as string);
  
      if (this.sortState[column] === 'newFirst') {
        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0; // Ascending order
      } else if (this.sortState[column] === 'oldFirst') {
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0; // Descending order
      }
      return 0; // If no sorting, return unchanged order
    });
  
    // Update the dataList with the sorted data
    this.dataList = sortedData;
    this.isSorted = true; // Set isSorted to true when sorting is applied
  }


  searchFromList(){
    console.log('this.searchKey',this.searchKey);
    if (!this.searchKey || this.searchKey === '') {
      this.dataList = [...this.originalDataList]; // Reset to original data when search is cleared
      if (
        this.selectedAssignedTo.length>0 ||
        this.selectedAssignedBy.length >0 ||
        this.selectedTask.length>0  ||
        this.selectedTitle.length>0 
      ) {
        this.applyFilters();
      }
      return;
    }
   
    const searchLower = this.searchKey.toLowerCase();
  
    this.dataList = this.dataList.filter(item =>
      (item.assignedBy?.toLowerCase().includes(searchLower) || '') ||
      (item.person?.toLowerCase().includes(searchLower) || '') ||
      (item.taskTitle?.toLowerCase().includes(searchLower) || '') ||
      (item.entityTitle?.toLowerCase().includes(searchLower) || '')
    );

  
  }

  applyFilters() {
    
    let filteredList = [...this.originalDataList]; // Start with a copy of the original data
    if(this.searchKey){

      const searchLower = this.searchKey.toLowerCase();
  
     filteredList = filteredList.filter(item =>
        (item.assignedBy?.toLowerCase().includes(searchLower) || '') ||
        (item.person?.toLowerCase().includes(searchLower) || '') ||
        (item.taskTitle?.toLowerCase().includes(searchLower) || '') ||
        (item.entityTitle?.toLowerCase().includes(searchLower) || '')
      );
    }
    // Apply the filter for Assigned To if selected
    if (this.selectedAssignedTo.length > 0) {
      filteredList = filteredList.filter(item => this.selectedAssignedTo.includes(item.person));
    }
  
    // Apply the filter for Assigned By if selected
    if (this.selectedAssignedBy.length > 0) {
      filteredList = filteredList.filter(item => this.selectedAssignedBy.includes(item.assignedBy));
    }
  
    // Apply the filter for Task if selected
    if (this.selectedTask.length > 0) {
      filteredList = filteredList.filter(item => this.selectedTask.includes(item.taskTitle));
    }
  
    // Apply the filter for Title if selected
    if (this.selectedTitle.length > 0) {
      filteredList = filteredList.filter(item => this.selectedTitle.includes(item.entityTitle));
    }
    console.log('this.selectedAssignedTo',this.selectedAssignedTo);
    console.log('this.selectedAssignedBy',this.selectedAssignedBy);
    console.log('this.selectedTask',this.selectedTask);
    console.log('this.selectedTitle',this.selectedTitle);
    // Update the data list with the filtered list
    this.dataList = filteredList;
    this.calculateTotal(this.dataList);
  }
  
 
  // Reset all filters
  resetFilter() {
    this.selectedAssignedTo = [];
    this.selectedAssignedBy = [];
    this.selectedTask = [];
    this.selectedTitle = [];
    this.dataList = [...this.originalDataList]; // Restore full list
    this.calculateTotal(this.dataList);
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
      case 'task':
        this.selectedTask = this.isAllSelected(filterType) ? [] : [...distinctValues];
        break;
      case 'title':
        this.selectedTitle = this.isAllSelected(filterType) ? [] : [...distinctValues];
        break;
    }
    
    this.applyFilters(); // Ensure filters update when selecting/deselecting all
  }

  getDistinctValues(filterType: 'assignedTo' | 'assignedBy' | 'task' | 'title'): string[] {
    switch (filterType) {
      case 'assignedTo':
        return this.distinctAssignedTo;
      case 'assignedBy':
        return this.distinctAssignedBy;
      case 'task':
        return this.distinctTask;
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
      case 'task':
        return this.selectedTask.length === distinctValues.length && this.selectedTask.length > 0;
      case 'title':
        return this.selectedTitle.length === distinctValues.length && this.selectedTitle.length > 0;
      default:
        return false;
    }
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
  
  filterDistinctTask() {
    const searchLower = this.assignedtaskSearch.toLowerCase();
    this.filteredTask = this.distinctTask.filter(person =>
      person.toLowerCase().includes(searchLower)
    );
  }
  
  filterDistinctTitle() {
    const searchLower = this.assignedtitle.toLowerCase();
    this.filteredTitle = this.distinctTitle.filter(person =>
      person.toLowerCase().includes(searchLower)
    );
  }

  clearSearch(event: Event) {
    this.assignedToSearch = '';
    this.assignedBySearch = '';
    this.assignedtaskSearch = '';
    this.assignedtitle = '';
    this.filterDistinctAssignedTo(); // Reset options
    this.filterDistinctAssignedBy(); // Reset options
    this.filterDistinctTask(); // Reset options
    this.filterDistinctTitle(); // Reset options
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
    } else if (type === 'task') {
      this.selectedTask.includes(value)
        ? this.selectedTask.splice(this.selectedTask.indexOf(value), 1)
        : this.selectedTask.push(value);
    } else if (type === 'title') {
      this.selectedTitle.includes(value)
        ? this.selectedTitle.splice(this.selectedTitle.indexOf(value), 1)
        : this.selectedTitle.push(value);
    }
  
    this.applyFilters();
  }
}

