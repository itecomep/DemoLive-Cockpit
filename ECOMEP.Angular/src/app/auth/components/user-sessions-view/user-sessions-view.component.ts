import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { UserSession } from '../../models/user-session';
import { UserSessionService } from '../../services/user-session.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponent } from 'src/app/mcv-header/components/header/header.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';

@Component({
  selector: 'app-user-sessions-view',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTooltipModule,
    DatePipe,

    //Components
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './user-sessions-view.component.html',
  styleUrls: ['./user-sessions-view.component.scss']
})
export class UserSessionsViewComponent {
  pagedListConfig = new PagedListConfig({
    pageSize: 100,
    filters: [],
    searchKey: null,
    sort: 'loginDate desc',
    route: '',
    showAll: false,
    showAssigned: false,
  });


  dataList: UserSession[] = [];
  isLoading: boolean = false;
  totalRecordsCount = 0;
  totalPages = 0;
  // pageSize = 50;
  currentPage = 0;
  isMobileView: boolean = false;

  dateFilters!: FormGroup;
  searchFilter!: FormControl;
  showAll: boolean = false;
  isPermissionSpecialShowAll: boolean = false;
  headerTitle: string = '';
  constructor(
    private appService: AppService,
    private activatedRoute: ActivatedRoute,
    private service: UserSessionService,
    private utility: UtilityService,
    private authService: AuthService,
  ) { }
  ngOnDestroy(): void {
    this.appService.resetHeader();
  }

  async ngOnInit() {
    this.headerTitle = this.activatedRoute.snapshot.data['title'];
    this.isMobileView = this.utility.isMobileView;
    this.buildForm();
    this.refresh()
  }

  buildForm() {
    this.dateFilters = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    });

    this.dateFilters.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== 'rangeStart' && x.key != 'rangeEnd');

        if (value && value.start && value.end) {
          this.pagedListConfig.filters.push({ key: 'rangeStart', value: this.utility.convertToUTCDate(value.start).toISOString() });
          this.pagedListConfig.filters.push({ key: 'rangeEnd', value: this.utility.convertToUTCDate(value.end).toISOString() });

          this.search();
        }
      });

    this.searchFilter = new FormControl();
    this.searchFilter.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        if (value) {
          this.pagedListConfig.searchKey = value;
          this.search();
        }
      })

  }

  getDataList(currentPage: number, pageSize: number) {
    this.isLoading = true;
    this.service.getPages(currentPage, pageSize, this.pagedListConfig.filters, this.pagedListConfig.searchKey,
      this.pagedListConfig.sort)
      .subscribe(
        data => {
          this.totalRecordsCount = data.total;
          this.totalPages = data.pages;
          // this.listLoad.emit({ totalRecordsCount: this.totalRecordsCount });
          this.dataList = this.utility.updatePagedList<UserSession>(data.list, this.dataList, 'id');
            this.dataList.forEach(x => {
            if (x.geoLocation && x.geoLocation !== '') {
              x.geoLocation = JSON.parse(x.geoLocation);
            }
            });
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
        }
      );
  }



  loadMoreRecords() {
    if (this.currentPage * this.pagedListConfig.pageSize < this.totalRecordsCount) {
      this.currentPage++;
      this.getDataList(this.currentPage, this.pagedListConfig.pageSize);
    }
  }

  search() {
    this.currentPage = 0;
    this.dataList = [];
    this.getDataList(this.currentPage, this.pagedListConfig.pageSize);
  }
  refresh() {
    this.pagedListConfig.searchKey = null;
    this.searchFilter.setValue(null);
    // this.dateFilters.get('start').setValue(null);
    // this.dateFilters.get('end').setValue(null);
    this.pagedListConfig.filters = [];
    this.dataList = [];
    this.getDataList(0, (this.currentPage + 1) * this.pagedListConfig.pageSize);
  }

  onToggleShowAll() {
    this.showAll = !this.showAll;
    this.pagedListConfig.showAll = this.showAll;
    // if(this.showAll){
    //   this.pagedListConfig.filters=this.pagedListConfig.filters.filter(x=>x.key!=='PartnerOrAssociateContactID')
    // }else{
    //   this.pagedListConfig.filters.push({ key: 'PartnerOrAssociateContactID', value: this.authService.currentUserStore.entity.id.toString() });
    // }
    this.refresh();
  }

  logoutUser(username: string, token: string) {
    this.authService.logoutSession(username, token).subscribe(data => {
      this.getDataList(this.currentPage, this.pagedListConfig.pageSize);
    });
  }

  onGetReport(reportType: string) {
    this.service.getReport(this.pagedListConfig.filters, this.pagedListConfig.searchKey,
      this.pagedListConfig.sort, reportType)
  }
}


