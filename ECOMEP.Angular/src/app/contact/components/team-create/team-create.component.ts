import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { firstValueFrom } from 'rxjs';
import { ContactTeam } from '../../models/contact-team.model';
import { ContactTeamApiService } from '../../services/contact-team-api.service';

@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent {

  team: ContactTeam = new ContactTeam();
  titleFC = new FormControl<any>(null, { validators: [Validators.required] });

  constructor(
    private teamService: ContactTeamApiService,
    private utilityService: UtilityService,
    private dialog: MatDialogRef<TeamCreateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data) {
    }
  }

  async onSubmit() {
    if (!this.titleFC.value || this.titleFC.value == '') {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    this.team.title = this.titleFC.value;
    const _team = await firstValueFrom(this.teamService.create(this.team));
    if (_team) {
      this.team = Object.assign(this.team, _team);
      this.dialog.close(this.team);
    }
  }
  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }
  onClose(e: any) {
    this.dialog.close();
  }
}
