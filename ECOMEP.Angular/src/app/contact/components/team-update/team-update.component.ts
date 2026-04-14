import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact } from 'src/app/contact/models/contact';
import { ContactTeam, ContactTeamMember } from '../../models/contact-team.model';
import { ContactTeamApiService } from '../../services/contact-team-api.service';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactTeamMemberApiService } from '../../services/contact-team-member-api.service';

@Component({
  selector: 'app-team-update',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './team-update.component.html',
  styleUrls: ['./team-update.component.scss']
})
export class TeamUpdateComponent {

  team!: ContactTeam;
  contactFC = new FormControl<any>(null);
  titleFC = new FormControl<any>(null, { validators: [Validators.required] });
  contactOptions: Contact[] = [];
  filteredContacts$!: Observable<Contact[]>;
  contactFilter = [{ key: 'usersOnly', value: 'true' }];

  constructor(
    private teamService: ContactTeamApiService,
    private utilityService: UtilityService,
    private contactService: ContactApiService,
    private contactTeamMemberService: ContactTeamMemberApiService,
    private dialog: MatDialogRef<TeamUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data) {
      this.team = data.team;
      this.titleFC.setValue(this.team.title);
    }
  }

  ngOnInit() {
    this.getContactOptions();
    this.filteredContacts$ = this.contactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),

    );
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  getContactOptions() {
    this.contactService.get(this.contactFilter, '', 'fullName').subscribe(data => this.contactOptions = data);
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }
  onSelectContact(event: MatAutocompleteSelectedEvent) {
    if (event) {
      this.utilityService.showConfirmationDialog(`Do you want to add ${event.option.value.fullName}`, async () => {
        const _contact = event.option.value;
        let member=new ContactTeamMember({
          contactID: _contact.id,
          contactTeamID: this.team.id,
        });
        member=await firstValueFrom(this.contactTeamMemberService.create(member));
        this.team.members.push(member);
        if(this.team.members.length==1){
          this.team.leaderID = member.contactID;
          await firstValueFrom(this.teamService.update(this.team));
        }
      });
      this.contactFC.reset();
    }
  }

  onClose(e: any) {
    this.dialog.close(this.team);
  }

  async setMemberAs(setAs: string, member: ContactTeamMember) {
    if (setAs == 'Leader') {
      this.team.leaderID = member.contactID;
     await firstValueFrom(this.teamService.update(this.team));
    } else if (setAs == 'Assisstant') {
      this.team.assistantID = member.contactID;
      await firstValueFrom(this.teamService.update(this.team));
    } 
  }

  onRemoveMember(member: ContactTeamMember) {
    this.utilityService.showConfirmationDialog(`Do you want to remove ${member.contact?.fullName}`, async () => {
     await firstValueFrom(this.contactTeamMemberService.delete(member.id));
      this.team.members = this.team.members.filter(x => x.id !== member.id);
    });
  }

  async onSubmit() {
    if (!this.titleFC.value || this.titleFC.value == '') {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill fields with valid data and try again.', 'error'
      );
      return;
    }

    this.team.title = this.titleFC.value;
    this.team= await firstValueFrom(this.teamService.update(this.team));

  }
}
