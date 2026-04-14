import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Company } from 'src/app/shared/models/company.model';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { WFTaskAnalysis, WFTaskAnalysisGroup } from '../../../wf-task/models/wf-task-analysis';
import { McvGroupByPipe } from 'src/app/shared/pipes/mcv-group-by.pipe';
import { Contact } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { TeamTaskProgressDialogComponent } from '../team-task-progress-dialog/team-task-progress-dialog.component';
import { DecimalPipe, CommonModule } from '@angular/common';
import { McvPopoverContentComponent } from '../../../mcv-popover/component/mcv-popover-content/mcv-popover-content.component';
import { McvPopoverDirective } from '../../../mcv-popover/directives/mcv-popover.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'team-task-progress-chart',
  templateUrl: './team-task-progress-chart.component.html',
  styleUrls: ['./team-task-progress-chart.component.scss'],
  standalone: true,
  providers: [
    McvGroupByPipe
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTooltipModule,
    McvPopoverDirective,
    DecimalPipe,
    MatSelectModule,
    MatOptionModule,

    //Components
    FooterComponent,
    McvPopoverContentComponent,
    McvFilterSidenavComponent
  ]
})
export class TeamTaskProgressChartComponent implements OnInit {

  // getProjectData;
  xCostFactor = 1;
  totalBillAmount = 0;
  totalProformaAmount = 0;
  totalVHrCost = 0;
  total5xCost = 0;
  totalreceivedByCops = 0;

  dataList: WFTaskAnalysisGroup[] = [];
  companyFC = new FormControl();
  statusFC = new FormControl();
  sortFC = new FormControl();
  searchFC = new FormControl();
  dateFC!: FormGroup;

  teamOptions: ContactTeam[] = [];
  teamFC = new FormControl();

  readonly COLOR_WHITE = '#ffffff';
  readonly COLOR_BLACK = '#000000';
  readonly COLOR_BLUE_100 = '#d6ebff';
  readonly COLOR_BLUE_500 = '#6eb8ff';
  readonly COLOR_BLUE_900 = '#0070b7';
  readonly COLOR_RED = '#da0202';
  readonly COLOR_YELLOW = '#ffc107';
  readonly COLOR_GRAY = '#495057';
  readonly COLOR_LIGHT_GREEN = '#04a82a';
  readonly COLOR_DARK_GREEN = '#118700';

  readonly COLOR_ORANGE = '#fd7e14';
  readonly PROGRESS_PROPOSED = '#003a5f';

  companyOptions: Company[] = [];
  statusOptions: StatusMaster[] = [];
  userOptions: Contact[] = [];

  filters: ApiFilter[] = [
    { key: "StatusFlag", value: this.config.WFTASK_STATUS_FLAG_COMPLETED.toString() },
    { key: "RangeStart", value: this.utility.getMonthStart().toISOString() },
    { key: "RangeEnd", value: this.utility.getMonthEnd().toISOString() },
  ];
  searchKey?: string;
  sort: string = 'created desc';
  sortOptions: any[] = [  // { label: 'Code', sortKey: 'code', icon: 'north' },
    // { label: 'Code', sortKey: 'code desc', icon: 'south' },
    { label: 'Modified', sortKey: 'modified', icon: 'north' },
    { label: 'Modified', sortKey: 'modified desc', icon: 'south' },
    { label: 'Created', sortKey: 'created', icon: 'north' },
    { label: 'Created', sortKey: 'created desc', icon: 'south' },
    { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate', icon: 'north' },
    { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate desc', icon: 'south' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
  ];
  get isMobileView(): boolean { return this.utility.isMobileView; }
  get isMaster() { return this.authService.currentUserStore ? this.authService.currentUserStore.roles.includes('MASTER') : false }

  monthlyExpectedMHR = 200;

  constructor(
    private companyAccountService: CompanyApiService,
    private taskService: WFTaskApiService,
    private config: AppConfig,
    private groupByPipe: McvGroupByPipe,
    private contactService: ContactApiService,
    private utility: UtilityService,
    private appSettingService: AppSettingMasterApiService,
    private contactTeamService: ContactTeamApiService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    if (!this.dateFC) {
      this.buildForm();
    }
    this.refresh();
    this.sortFC.setValue(this.sortOptions.find(x => x.sortKey == this.sort), { emitEvent: false });
    await this.getAppSettings();
    await this.getUserOptions();
    await this.getTeamOptions();

    this.statusFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.filters = this.filters.filter(i => i.key !== "StatusFlag");
            value.forEach((element: StatusMaster) => {
              this.addFilter('StatusFlag', element.value.toString());
            });
            this.refresh();
          }
        }
      );

    this.sortFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.sort = value.sortKey;
            this.refresh();
          }
        }
      );

    this.searchFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.searchKey = value;
        this.refresh();
      });

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
            this.refresh();
          }
        }
      );

    this.companyFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          // console.log(value);
          if (value) {
            this.filters = this.filters.filter(i => i.key !== "CompanyID");
            value.forEach((element: Company) => {
              this.addFilter('CompanyID', element.id.toString())
            });

            this.refresh();
          }
        }
      );

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

          this.refresh();
        }
      });
  }

  buildForm() {
    this.dateFC = new FormGroup({
      start: new FormControl(this.utility.getMonthStart()),
      end: new FormControl(this.utility.getMonthEnd()),
    });

  }

  private async getAppSettings() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.TEAM_MONTHLY_EXPECTED_MHR);
    if (_setting) {
      this.monthlyExpectedMHR = Number(_setting.presetValue);
    }
  }
  private async getUserOptions() {
    this.userOptions = await firstValueFrom(this.contactService.get([{ key: "usersOnly", value: 'true' }, { key: "AppointmentstatusFlag", value: this.config.TEAM_APPOINTMENT_STATUS_APPOINTED.toString() }], '', 'fullname'));
  }

  private refresh() {
    this.taskService.getAnalysis('full', this.filters, this.searchKey,
      this.sort)
      .subscribe((data: WFTaskAnalysis[]) => {
        const groupByContactID = this.groupByPipe.transform(data, ['contactID']);
        this.dataList = groupByContactID.map((x: any) => new WFTaskAnalysisGroup(Number(x.key), x.values as WFTaskAnalysis[]));
        // console.log('groups', this.dataList);
      });
  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
    if (this.authService.currentUserStore && !this.authService.currentUserStore.roles.includes('MASTER')) {
      const _isTeamLeader = this.teamOptions.find(x => x.leaderID == this.authService.currentUserStore?.contact.id);
      if (_isTeamLeader) {
        this.addFilter('teamID', _isTeamLeader.id.toString());
        this.userOptions = this.userOptions.filter(x => _isTeamLeader.members.some(y => x.id == y.contactID));
      }
    } 
  }

  onRefresh() {
    // console.log('filters', this.filters);
    this.searchKey = undefined;
    this.searchFC.setValue(null);
    this.refresh();
  }

  private addFilter(key: string, value: string) {
    const _filter = this.filters.find(obj => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.filters.push({ key: key, value: value });
    }
  }


  getPercentage(value: number, total: number, minValue: number = 0): number {
    return (total > 0 ? (value < total ? value / total * 100 : 100) : minValue);
  }

  onClick(item: Contact) {
    this.taskService.openDialog(TeamTaskProgressDialogComponent, {
      dialogTitle: `Team Progress | ${item.name}`,
      config: { group: this.getContactData(item.id), contact: item, filters: this.filters }
    }, true);
  }

  getContactData(contactID: number): WFTaskAnalysisGroup {
    return this.dataList.find(x => x.contactID == contactID) ?? new WFTaskAnalysisGroup(contactID, []);
  }

  get totalMHr(): number {
    if (this.dateFC) {
      const start = new Date(this.dateFC.controls['start'].value);
      const end = new Date(this.dateFC.controls['end'].value);
      const monthsBetween = (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      return (monthsBetween + 1) * this.monthlyExpectedMHR;
    } else {
      return 0;
    }
  }

  refreshFilters() {
    this.searchFC.reset();
    this.refresh();
  }

  openPhotoDialog(member: any ) {
        this.dialog.open(ContactPhotoNameDialogComponent, {
          data: member
        });
      }
}

