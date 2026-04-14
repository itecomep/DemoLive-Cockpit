import { Component, EventEmitter, inject, OnInit, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MeetingAttendee } from '../../models/meeting-attendee.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, map } from 'rxjs';
import { EmailContact } from 'src/app/shared/models/email-contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';

@Component({
  selector: 'app-meeting-external-attendees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  templateUrl: './meeting-external-attendees.component.html',
  styleUrls: ['./meeting-external-attendees.component.scss']
})
export class MeetingExternalAttendeesComponent implements OnInit {

  readonly formBuilder = inject(FormBuilder);
  readonly utilityService = inject(UtilityService);

  @Input() typeFlag!: number;

  private readonly contactService = inject(ContactApiService);
  @Output() create: EventEmitter<any> = new EventEmitter<any>();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  form!: FormGroup;
  filteredContactsForExternal$!: Observable<EmailContact[]>;
  emailContactOptions: EmailContact[] = [];

  get f(): any { return this.form.controls }

  ngOnInit() {
    this.getAttendeeOptions()
    if (!this.form) {
      this.buildForm();
    }
    
    this.filteredContactsForExternal$ = this.form.get('name')!.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? (typeof value === 'string' ? value : (value as EmailContact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.emailContactOptions.slice()),
    );
  }

   async getAttendeeOptions() {
      this.emailContactOptions = await firstValueFrom(this.contactService.getEmailOptions());
    }

  buildForm() {
    this.form = this.formBuilder.group({
      name: new FormControl<any>(null, { validators: [Validators.required] }),
      phone: new FormControl<any>(null),
      email: new FormControl<any>(null, { validators: [Validators.required] }),
    });
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  private touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  displayFnContact(option?: EmailContact): string {
    return option ? (`${option.name} | ${option.email}`) : '';
  }

  private filterContacts(property: string): any[] {
    return this.emailContactOptions.filter(option => {
      return option ?
        (option.name.toLowerCase().includes(property.toLowerCase())
          || option.email.toLowerCase().includes(property.toLowerCase())
        )
        : false;
    });
  }

  displayFnContactName(option?: EmailContact): string {
    return option ? option.name : '';
  }

  onSelectExternalContact(contact: EmailContact) {
    if (contact) {
      this.form.patchValue({
        // name: contact.name,
        email: contact.email
      });
    }
  }

  onCreate() {
    if (this.form.invalid) {
      this.touchForm();
      return;
    }
    const _attendee = new MeetingAttendee();
    const formValue = this.form.getRawValue();
    _attendee.name = typeof formValue.name === 'string' ? formValue.name : (formValue.name?.name || '');
    _attendee.phone = formValue.phone;
    _attendee.email = formValue.email;
    _attendee.typeFlag = this.typeFlag;
    this.form.reset();
    this.create.emit(_attendee);
  }

}
