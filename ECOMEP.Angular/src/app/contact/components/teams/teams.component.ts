import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TeamUpdateComponent } from '../team-update/team-update.component';
import { TeamCreateComponent } from '../team-create/team-create.component';
import { ContactTeamApiService } from '../../services/contact-team-api.service';
import { ContactTeam } from '../../models/contact-team.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {
  teams: ContactTeam[] = [];

  constructor(
    private dialog: MatDialog,
    private teamService: ContactTeamApiService,
    private utilityService: UtilityService,
    private dialogRef: MatDialogRef<TeamsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data) {
    }
  }

  get selectedTeam() { return this.teamService.selectedTeam }

  async ngOnInit() {
    await this.getTeams();
  }

  async getTeams() {
    this.teams = await firstValueFrom(this.teamService.get());
    this.teamService.selectedTeam = this.teams[0];
    // console.log(this.teams);
  }

  onClose() {
    this.dialogRef.close();
  }

  onAddNewTeam() {
    const dialogConfig = new MatDialogConfig();
    
    // dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    dialogConfig.autoFocus = true;


    const _dialogRef = this.dialog.open(TeamCreateComponent, dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.teams.push(res);
        this.teamService.selectedTeam =res;
        this.onEditTeam();
      }
    });
  }

  onEditTeam() {
    const dialogConfig = new MatDialogConfig();
    
    // dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      team: this.selectedTeam
    }

    const _dialogRef = this.dialog.open(TeamUpdateComponent, dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let _team = this.teams.find(x => x.id == res.id);
        if (_team) {
          _team = Object.assign(_team, res);
        }
      }
    });
  }

  onDeleteTeam() {
    if (this.selectedTeam) {
      this.utilityService.showConfirmationDialog(`Do you want to delete ${this.selectedTeam.title}`, async () => {     
          await firstValueFrom(this.teamService.delete(this.selectedTeam.id));
          this.teams = this.teams.filter(x => x.id != this.selectedTeam.id);
          this.teamService.selectedTeam = this.teams[0];
      })
    }
  }

  onSelectTeam(team: ContactTeam) {
    this.teamService.selectedTeam = team;
  }

  openPhotoDialog(member: any ) {
        this.dialog.open(ContactPhotoNameDialogComponent, {
          data: member
        });
      }
}
