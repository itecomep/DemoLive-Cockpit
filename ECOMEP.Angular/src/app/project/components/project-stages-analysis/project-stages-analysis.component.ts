import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectApiService } from '../../services/project-api.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { ProjectStagesAnalysis } from '../../models/project.model';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { AppConfig } from 'src/app/app.config';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { FilterToggleDirective } from 'src/app/shared/directives/filter-toggle.directive';

@Component({
  selector: 'app-project-stages-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FilterToggleDirective,

    //Component
    FooterComponent
  ],
  templateUrl: './project-stages-analysis.component.html',
  styleUrls: ['./project-stages-analysis.component.scss']
})
export class ProjectStagesAnalysisComponent implements OnInit {

  config = inject(AppConfig);
  projectApiService = inject(ProjectApiService);
  statusMasterService = inject(StatusMasterService);
  contactTeamService = inject(ContactTeamApiService);

  teamFC = new FormControl();
  statusFC = new FormControl();
  searchFC = new FormControl('');

  teamOptions: ContactTeam[] = [];
  statusOptions: StatusMaster[] = [];
  dataList: ProjectStagesAnalysis[] = [];
  projectStatusOptions: StatusMaster[] = [];
  expandedRows: Set<number> = new Set(); //which row is expanded

  searchKey?: string;
  sort: string = 'code desc';
  statusFlagFilterKey: string = "statusFlag";
  filters: ApiFilter[] = [
    { key: 'statusFlag', value: this.projectApiService.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'statusFlag', value: this.projectApiService.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() }
  ];

  async ngOnInit() {
    await this.getStatusOptions();
    await this.getStagesAnalysis();
    await this.getTeamOptions();

    this.teamFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.filters = this.filters.filter(i => i.key !== "teamID");
            // value.forEach((element: ContactTeam) => {
            this.addFilter('teamID', value.id.toString());
            // });
            this.getStagesAnalysis();
          }
        }
      );

    this.statusFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          console.log(value);
          this.filters = this.filters.filter(
            (i) => i.key !== this.statusFlagFilterKey
          );
          value.forEach((element: StatusMaster) => {
            this.addFilter(this.statusFlagFilterKey, element.value.toString());
          });
          this.getStagesAnalysis();
        }
      });

    this.searchFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.searchKey = value;
        this.getStagesAnalysis();
      }
    });
  }

  async getStagesAnalysis() {
    this.dataList = await firstValueFrom(this.projectApiService.getProjectStageAnalysis(
      this.filters,
      this.searchKey,
      this.sort,
    ));
  }

  private async getStatusOptions() {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECTSTAGE }]))
    this.projectStatusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECT }]))
    const filter = this.filters.filter(x => x.key == this.statusFlagFilterKey);
    if (filter) {
      const _setValues = this.projectStatusOptions.filter(x => filter.some(y => x.value.toString() == y.value));
      if (_setValues) {
        this.statusFC.setValue(_setValues, { emitEvent: false });
      }
    }
  }

  addFilter(key: string, value: string) {
    const _filter = this.filters.find((obj) => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.filters.push(
        new ApiFilter({ key: key, value: value })
      );
    }
  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
  }

  getStatusColor(value: number) {
    return this.projectApiService.getStatusColor(value);
  }

  onRefresh() {
    this.teamFC.setValue(null);
    this.searchFC.reset();
    this.searchKey = '';
    this.filters = this.filters.filter(x => x.key !== 'teamID');
    this.getStagesAnalysis();
  }

  toggleRow(index: number) {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  //use for icons and stage visible/hide
  isRowExpanded(index: number): boolean {
    return this.expandedRows.has(index);
  }
}
