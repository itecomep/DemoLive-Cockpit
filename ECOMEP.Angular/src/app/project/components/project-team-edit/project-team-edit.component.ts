import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom, map, Observable } from 'rxjs';
import { ContactTeam, ContactTeamMember } from 'src/app/contact/models/contact-team.model';
import { Project } from '../../models/project.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { ProjectApiService } from '../../services/project-api.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Contact } from 'src/app/contact/models/contact';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-project-team-edit',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './project-team-edit.component.html',
  styleUrls: ['./project-team-edit.component.scss']
})
export class ProjectTeamEditComponent implements OnInit {

    private contactTeamService = inject(ContactTeamApiService);
    private projectService = inject(ProjectApiService);
    private utilityService = inject(UtilityService);
  
   @Input() project!: Project;
  team!:ContactTeam;
  @Input('team') set teamValue(val: ContactTeam | undefined) {
    if (val) {
      this.team = val;
      this.teamFC.setValue(val);
    }
  }

  ngOnInit(): void {
    this.getTeamOptions();
  }

  teamFC = new FormControl<any>(null);
    teamOptions: ContactTeam[] = [];
    filteredTeams$!: Observable<ContactTeam[]>;
    teamFilter = [];
  private async getTeamOptions(){
    this.teamOptions= await firstValueFrom(this.contactTeamService.get(this.teamFilter));
    this.filteredTeams$ = this.teamFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as ContactTeam).title) : null),
      map(name => name ? this.filterTeams(name as string) : this.teamOptions.slice()),

    );
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }
  filterTeams(property: string): any[] {
    return this.teamOptions.filter(option => option ? option.title.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnTeam(option?: ContactTeam): string {
    return option ? option.title : '';
  }
  async onSelectTeam(event: MatAutocompleteSelectedEvent) {
    if (event) {
        this.team = event.option.value;
        this.project.teamID= this.team.id;
        await firstValueFrom(this.projectService.update(this.project));
       this.update.emit({project:this.project,team:this.team});
    }
  }

  @Output() update = new EventEmitter();

   


}
