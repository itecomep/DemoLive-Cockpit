import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { Project } from '../../models/project.model';
import { ContactTeam, ContactTeamMember } from 'src/app/contact/models/contact-team.model';
import { debounceTime, distinctUntilChanged, firstValueFrom, map, Observable, of, startWith, switchMap } from 'rxjs';
import { ProjectApiService } from '../../services/project-api.service';
import { ProjectTeamApiService } from '../../services/project-team-api.service';
import { ProjectTeam } from '../../models/project-team.model';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Contact } from 'src/app/contact/models/contact';
import { AppConfig } from 'src/app/app.config';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project-team',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.scss']
})
export class ProjectTeamComponent implements OnInit {

  private config = inject(AppConfig);
  private utilityService = inject(UtilityService);
  private projectService = inject(ProjectApiService);
  private contactApiService = inject(ContactApiService);
  private contactTeamService = inject(ContactTeamApiService);
  private projectTeamService = inject(ProjectTeamApiService);
  private dialog = inject(MatDialog);

  get isPermissionEdit() { return this.projectService.isPermissionTeamEdit; }
  get isPermissionView() { return this.projectService.isPermissionTeamView; }
  get isPermissionDelete() { return this.projectService.isPermissionTeamDelete; }

  TEAM_APPOINTMENT_STATUS_APPOINTED = this.config.TEAM_APPOINTMENT_STATUS_APPOINTED;

  project!: Project;
  teams: ProjectTeam[] = [];
  teamOptions: ContactTeam[] = [];
  teamFilter: ApiFilter[] = [];
  contactOptions: Contact[] = [];
  teamFC = new FormControl<any>(null);
  filteredTeams$!: Observable<ContactTeam[]>;

  filteredPMOptions$!: Observable<any[]>;
  filteredAPMOptions$!: Observable<any[]>;

  pmFC: FormControl = new FormControl<any>('');
  apmFC: FormControl = new FormControl<any>('');

  projectManagerContactFC = new FormControl<any>(null);
  assistantProjectManagerContactFC = new FormControl<any>(null);

  @Input() isEditMode: boolean = false;

  @Input('project') set projectValue(val: Project) {
    if (val) {
      this.project = val;
      this.getTeams();
      // this.getContactOptions();
    }
  }

  @Output() update = new EventEmitter();

  ngOnInit() {
    this.getTeamOptions();

    this.filteredPMOptions$ = this.pmFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );

    this.filteredAPMOptions$ = this.apmFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get(this.teamFilter));
    this.filteredTeams$ = this.teamFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? (typeof value === 'string' ? value : (value as ContactTeam).title) : null),
      map(name => name ? this.filterTeams(name as string) : this.teamOptions.slice()),
    );
  }

  private async getTeams() {
    const _filter: ApiFilter[] = [{ key: 'projectID', value: this.project.id.toString() }];
    this.teams = await firstValueFrom(this.projectTeamService.get(_filter));
    if (this.teams && this.teams.length > 0) {
      this.contactOptions = this.teams?.flatMap(team =>
        team.contactTeam.members
          .map(member => member.contact)
          .filter((contact): contact is Contact => contact !== undefined)
      ) || [];
    }
  }

  // private async getContactOptions() {
  //   const _filter: ApiFilter[] = [
  //     { key: 'IsAppointed', value: 'true' },
  //     { key: 'AppointmentStatusFlag', value: this.TEAM_APPOINTMENT_STATUS_APPOINTED.toString() }
  //   ];
  //   this.contactOptions = await firstValueFrom(this.contactApiService.get(_filter));
  // }

  displayFnTeam(option?: ContactTeam): string {
    return option ? option.title : '';
  }

  async onSelectTeam(event: MatAutocompleteSelectedEvent) {
    if (event) {
      const _team = event.option.value;
      if (_team) {
        const _exist = this.teams.find(x => x.contactTeamID == _team.id);
        if (_exist) {
          this.utilityService.showSwalToast('', `Team ${_exist.contactTeam.title} already exist!!`, 'warning');
        } else {
          this.utilityService.showConfirmationDialog(`Do you want to add ${_team.title} team to ${this.project.title}?`, async () => {
            const _projectTeam = new ProjectTeam();
            _projectTeam.projectID = this.project.id;
            _projectTeam.contactTeamID = _team.id;
            const _newTeam = await firstValueFrom(this.projectTeamService.create(_projectTeam));
            this.teams.unshift(_newTeam);
            this.getTeams();
          });
        }
      }
      this.teamFC.reset();
    }
  }

  filterTeams(property: string): any[] {
    return this.teamOptions.filter(option => option ? option.title.toLowerCase().includes(property.toLowerCase()) : false);
  }

  async onDeleteTeam(team: ProjectTeam) {
    this.utilityService.showConfirmationDialog(`Do you want to remove the team '${team.contactTeam.title}' from the project '${this.project.title}'? If this team includes the selected Team Leader or Junior Team Leader, they will also be removed from the project.`, async () => {
      await firstValueFrom(this.projectTeamService.delete(team.id));
      this.teams = this.teams.filter(x => x.id !== team.id);

      team.contactTeam.members.forEach(async (member) => {
        //Check for team Leader using id from team which we are deleting
        if (this.project.projectManagerContactID && member.contactID == this.project.projectManagerContactID) {
          this.project.projectManagerContactID = undefined;
          this.project.projectManagerContact = undefined;
          this.project = await firstValueFrom(this.projectService.update(this.project));
          this.update.emit(this.project);
        }

        //Check for Junior Team Leader using id from team which we are deleting
        if (this.project.assistantProjectManagerContactID && member.contactID == this.project.assistantProjectManagerContactID) {
          this.project.assistantProjectManagerContactID = undefined;
          this.project.assistantProjectManagerContact = undefined;
          this.project = await firstValueFrom(this.projectService.update(this.project));
          this.update.emit(this.project);
        }
      });

      //GetTeams method is called to get the updated team to fetch all contacts
      // this.getTeams();
    });
  }

  async onPMSelected(event: MatSelectChange) {
    if (event && event.value) {
      this.project.projectManagerContactID = event.value.id;
      this.project.projectManagerContact = event.value;
      this.project = await firstValueFrom(this.projectService.update(this.project));
      this.update.emit(this.project);
    }
  }

  async onAPMSelected(event: MatSelectChange) {
    if (event && event.value) {
      this.project.assistantProjectManagerContactID = event.value.id;
      this.project.assistantProjectManagerContact = event.value;
      this.project = await firstValueFrom(this.projectService.update(this.project));
      this.update.emit(this.project);
    }
  }

  onDeleteProjectManager() {
    this.utilityService.showConfirmationDialog(`Do you want to remove Team Leader ${this.project.projectManagerContact?.fullName} from ${this.project.title} project?`, async () => {
      this.project.projectManagerContactID = undefined;
      this.project.projectManagerContact = undefined;
      this.project = await firstValueFrom(this.projectService.update(this.project));
      this.update.emit(this.project);
      this.utilityService.showSwalToast('', 'Team Leader removed successfully!!', 'success');
    });
  }

  onDeleteAssistantProjectManager() {
    this.utilityService.showConfirmationDialog(`Do you want to remove Assistant Team Leader ${this.project.assistantProjectManagerContact?.fullName} from ${this.project.title} project?`, async () => {
      this.project.assistantProjectManagerContactID = undefined;
      this.project.assistantProjectManagerContact = undefined;
      this.project = await firstValueFrom(this.projectService.update(this.project));
      this.update.emit(this.project);
      this.utilityService.showSwalToast('', 'Assistant Team Leader removed successfully!!', 'success');
    });
  }

  openPhotoDialog(member: any ) {
      this.dialog.open(ContactPhotoNameDialogComponent, {
        data: member.contact
      });
    }
}
