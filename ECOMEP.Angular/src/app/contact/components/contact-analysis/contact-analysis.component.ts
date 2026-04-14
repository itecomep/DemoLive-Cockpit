import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactAnalysis } from '../../models/contact-analysis.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Company } from 'src/app/shared/models/company.model';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { FilterToggleDirective } from '../../../shared/directives/filter-toggle.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NgFor, NgClass, DatePipe } from '@angular/common';

@Component({
    selector: 'app-contact-analysis',
    templateUrl: './contact-analysis.component.html',
    styleUrls: ['./contact-analysis.component.scss'],
    animations: [
        // First we add the trigger, which we added to the element in square brackets in the template
        trigger('toggleTrigger', [
            // We define the 'off' state with a style -- translateX(0%), which does nothing
            state('off', style({ transform: 'translateX(100%)' })),
            // We define the 'on' state with a style -- move right (on x-axis) by 70%
            state('on', style({ transform: 'translateX(0%)' })),
            // We define a transition of on to off (and vice versa) using `<=>`
            transition('on <=> off', [
                // We add the time (in milliseconds) and style of movement with `animate()`
                animate('120ms ease-in-out')
            ])
        ])
    ],
    standalone: true,
    imports: [NgFor, NgClass, FooterComponent, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatTooltipModule, FilterToggleDirective, DatePipe]
})
export class ContactAnalysisComponent implements OnInit
{


  dataList: ContactAnalysis[] = [];
  total = new ContactAnalysis();
  companyFC = new FormControl();
  clientFC = new FormControl();
  statusFC = new FormControl();
  typeFC = new FormControl();
  sortFC = new FormControl();
  searchFC = new FormControl();
  stagePercentageStartFC = new FormControl(0, [Validators.min(0), Validators.max(99)]);
  stagePercentageEndFC = new FormControl(100, [Validators.min(1), Validators.max(100)]);
  companyOptions: Company[] = [];
  statusOptions: StatusMaster[] = [];
  typeOptions: TypeMaster[] = [];
  dateFC = new FormGroup({
    start: new FormControl(this.utilityService.getFYearStart()),
    end: new FormControl(this.utilityService.getFYearEnd()),
  });
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  // partnerFilter = [
  //   { key: 'usersOnly', value: 'true' },
  //   { key: 'projectPartnersOnly', value: 'true' }
  // ];

  filters: ApiFilter[] = [
    { key: "RangeStart", value: this.utilityService.getFYearStart().toISOString() },
    { key: "RangeEnd", value: this.utilityService.getFYearEnd().toISOString() },
    // { key: 'TypeFlag', value: this.projectService.CONTACT_TYPE_FLAG_ARCHITECTURE.toString() },
    // { key: 'TypeFlag', value: this.projectService.CONTACT_TYPE_FLAG_INTERIOR.toString() },
  ];
  searchKey?: string;
  sort: string = 'ActionOn-desc';
  sortOptions: any[] = [  // { label: 'Code', sortKey: 'code', icon: 'north' },
    // { label: 'Code', sortKey: 'code desc', icon: 'south' },
    // { label: 'Modified', sortKey: 'modified', icon: 'north' },
    // { label: 'Modified', sortKey: 'modified desc', icon: 'south' },
    // { label: 'Created', sortKey: 'created', icon: 'north' },
    // { label: 'Created', sortKey: 'created desc', icon: 'south' },
    { label: 'ActionOn', sortKey: 'ActionOn', icon: 'north' },
    { label: 'ActionOn', sortKey: 'ActionOn-desc', icon: 'south' },
  ];
  get isPermissionShowAll()
  {
    return this.contacService.isPermissionAnalysisShowAll;
  }
  get isPermissionExcel()
  {
    return this.contacService.isPermissionAnalysisExcel;
  }

  constructor(
    // private companyAccountService: CompanyApiService,
    private contacService: ContactApiService,
    private config: AppConfig,
    private statusMasterService: StatusMasterService,
    private typeMasterService: TypeMasterService,
    private utilityService: UtilityService,
  ) { }

  async ngOnInit()
  {
    await this.getCompanyOptions();
    // await this.getStatusOptions();
    await this.getTypeOptions();

    this.getData();

    this.sortFC.setValue(this.sortOptions.find(x => x.sortKey == this.sort), { emitEvent: false });

    // this.statusFC.valueChanges
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(
    //     (value) =>
    //     {
    //       if (value)
    //       {
    //         this.filters = this.filters.filter(i => i.key !== "StatusFlag");
    //         value.forEach((element: StatusMaster) =>
    //         {
    //           this.addFilter('StatusFlag', element.value.toString());
    //         });
    //         this.getData();
    //       }
    //     }
    //   );

    this.typeFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.filters = this.filters.filter(i => i.key !== "TypeFlag");
            value.forEach((element: TypeMaster) =>
            {
              this.addFilter('TypeFlag', element.value.toString());
            });
            this.getData();
          }
        }
      );

    this.sortFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.sort = value.sortKey;
            this.getData();
          }
        }
      );

    this.searchFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) =>
      {
        this.searchKey = value;
        this.getData();
      });

    // this.clientFC.valueChanges
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(
    //     (value) =>
    //     {
    //       if (value)
    //       {
    //         this.filters = this.filters.filter(i => i.key !== "ClientContactID");
    //         value.forEach((contact: Contact) =>
    //         {
    //           this.addFilter('ClientContactID', contact.id.toString());

    //         });
    //         this.getData();
    //       }
    //     }
    //   );

    // this.companyFC.valueChanges
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(
    //     (value) =>
    //     {
    //       // console.log(value);
    //       if (value)
    //       {
    //         this.filters = this.filters.filter(i => i.key !== "CompanyID");
    //         value.forEach((element: Company) =>
    //         {
    //           this.addFilter('CompanyID', element.id.toString())
    //         });

    //         this.getData();
    //       }
    //     }
    //   );

    this.dateFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value && value.start && value.end)
        {
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

          this.getData();
        }
      });
  }

  private async getCompanyOptions()
  {
    // this.companyOptions = await firstValueFrom(this.companyAccountService.get())
    // this.companyFC.setValue(this.companyOptions, { emitEvent: false });
    // this.filters.push(...this.companyOptions.map(x => { return { key: 'CompanyID', value: x.id.toString() } }));
  }

  private async getData()
  {
    this.dataList = await firstValueFrom(this.contacService.getAnalysis('full', this.filters, this.searchKey,
      this.sort));

    // this.total = new ContactAnalysis();
    // this.dataList.forEach(x =>
    // {
    //   this.total.totalFees += x.totalFees;
    //   this.total.receivedFees += x.receivedFees;
    //   this.total.balanceFees += x.balanceFees;
    //   this.total.workCompletionFees += x.workCompletionFees;
    //   this.total.proformaAmount += x.proformaAmount;
    // });
  }

  private async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT }]))

    this.statusFC.setValue(this.statusOptions.filter(x => this.filters.find(f => f.key == 'StatusFlag' && f.value == x.value.toString())), { emitEvent: false })

    //    this.statusFC.setValue(this.statusOptions, { emitEvent: false })
    // this.filters.push(...this.statusOptions.map(x => { return { key: 'StatusFlag', value: x.value.toString() } }));
  }

  private async getTypeOptions()
  {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT }]))

    this.typeFC.setValue(this.typeOptions.filter(x => this.filters.find(f => f.key == 'TypeFlag' && f.value == x.value.toString())), { emitEvent: false })

    //    this.statusFC.setValue(this.statusOptions, { emitEvent: false })
    // this.filters.push(...this.statusOptions.map(x => { return { key: 'StatusFlag', value: x.value.toString() } }));
  }

  refresh()
  {
    this.searchKey = undefined;
    this.searchFC.setValue(null);
    this.getData();
  }

  private addFilter(key: string, value: string)
  {
    const _filter = this.filters.find(obj =>
    {
      return obj.key === key && obj.value === value;
    });
    if (!_filter)
    {
      this.filters.push({ key: key, value: value });
    }
  }

  onExportExcel()
  {
    this.contacService.exportAnalysisExcel('full', this.filters, this.searchKey,
      this.sort);
  }

  // onExportReport(reportName: string, size: string = 'a4', output: 'PDF' | 'EXCELOPENXML' = 'PDF')
  // {
  //   this.contacService.exportReport(reportName, size, output, this.filters, this.searchKey, this.sort);
  // }

  async onExportExcelFromData(filename: string, data: any[])
  {
    // var response = await firstValueFrom(this.projectService.exportDataToExcel(filename, data));
    // saveAs(response, filename);
  }

  getPercentage(value: number, total: number, minValue: number = 0): number
  {
    return (total > 0 ? (value < total ? value / total * 100 : 100) : minValue);
  }

  isShowReports: boolean = false;
  openReports()
  {
    this.isShowReports = !this.isShowReports;
  }
}

