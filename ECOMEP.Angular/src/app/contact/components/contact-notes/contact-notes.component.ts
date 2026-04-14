import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactNotes } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { firstValueFrom } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactNotesApiService } from '../../services/contact-note-api.service';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
    selector: 'app-contact-notes',
    templateUrl: './contact-notes.component.html',
    styleUrls: ['./contact-notes.component.scss'],
    standalone: true,
    imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule, NgFor, DatePipe]
})
export class ContactNotesComponent
{
  form!: FormGroup;
  contact!: Contact;
  notes: ContactNotes[] = [];
  isReadOnly: boolean = false;
  updateDatabase: boolean = false;
  @Input('config') set configValue(value: {
    isReadOnly: boolean,
    contact: Contact,
    notes: ContactNotes[],
    updateDatabase: boolean
  })
  {
    if (value)
    {
      this.isReadOnly = value.isReadOnly;
      this.contact = value.contact;
      this.notes = value.notes;
      this.updateDatabase = value.updateDatabase;
      this.refresh();
      console.log('notes', this.notes, value);
    }
  }

  get isPermissionEdit() { return true; }//return this.contactService.isPermissionEdit; }
  get f(): any { return this.form.controls; }
  @Output() update = new EventEmitter<ContactNotes[]>();

  constructor(
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private contactService: ContactApiService,
    private contactNoteService: ContactNotesApiService,
  )
  {
  }

  ngOnInit()
  {
    this.buildForm();
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  refresh()
  {
    if (this.notes.length == 0)
    {
      this.getContactNotes();
    }
  }
  async getContactNotes()
  {
    this.notes = await firstValueFrom(this.contactNoteService.get([{ key: 'ContactID', value: this.contact.id.toString() }], ''));
  }
  buildForm()
  {
    this.form = this.formBuilder.group({
      notes: new FormControl<any>("", { nonNullable: true, validators: [Validators.required] }),
    });
  }


  onCreate()
  {
    let obj = new ContactNotes();
    obj.notes = this.f['notes'].value;
    obj.contactID = this.contact.id;

    if (this.updateDatabase)
    {

      this.contactNoteService.create(obj).subscribe(
        (data: any) =>
        {
          if (data)
          {
            this.notes.push(data);
            this.notes.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
          }
          this.utilityService.showSwalToast(
            "Success!",
            "Save Successfull.",
          );
          this.form.reset();
          this.update.emit(this.notes);
        }
      );
    } else
    {
      this.notes.push(obj);
      this.notes.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      this.update.emit(this.notes);
    }
  }

  onDelete(obj: ContactNotes)
  {
    if (obj)
    {
      if (this.updateDatabase)
      {
        this.contactNoteService.delete(obj.id).subscribe(
          (data: any) =>
          {
            this.notes = this.notes.filter(x => x.id !== obj.id);
            this.utilityService.showSwalToast(
              "Success!",
              "Delete Successfull.",
            );
            this.update.emit(this.notes);
          }
        );
      } else
      {
        this.notes = this.notes.filter(x => x.id !== obj.id);
        this.update.emit(this.notes);
      }
    }
  }
}

