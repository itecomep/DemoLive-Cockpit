import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, debounceTime, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact, ContactAssociation } from '../../models/contact';
import { ContactAssociationApiService } from '../../services/contact-association-api.service';
import { ContactApiService } from '../../services/contact-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-contact-association-form',
    templateUrl: './contact-association-form.component.html',
    styleUrls: ['./contact-association-form.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgFor, MatOptionModule, NgIf, MatButtonModule, MatIconModule, AsyncPipe]
})
export class ContactAssociationFormComponent implements OnInit
{
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);

  form!: FormGroup;
  contact!: Contact;

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  private touchForm()
  {
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }
  getErrorMessage(control?: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  currentEntity: ContactAssociation = new ContactAssociation();
  private readonly contactAssociationApiService = inject(ContactAssociationApiService);
  private readonly contactService = inject(ContactApiService);
  autoUpdate: boolean = false;
  isCreateMode: boolean = false;
  filteredContacts$!: Observable<any[]>;
  @Input('config') set configValue(value: {
    autoUpdate: boolean,
    isCreateMode: boolean,
    contactOptions: Contact[],
    contact?: Contact,
    association?: ContactAssociation,
  })
  {
    if (value)
    {
      this.isCreateMode = value.isCreateMode;
      this.autoUpdate = value.autoUpdate;
      this.currentEntity = value.association ? value.association : new ContactAssociation();
   
      if (value.contact)
      {
        this.contact = value.contact;
        if (this.contact.isCompany)
        {
          this.currentEntity.companyContactID = this.contact.id;
        }
        else
        {
          this.currentEntity.personContactID = this.contact.id;
        }
      }
      // this.contactOptions = value.contactOptions.filter(x => x.isCompany != this.contact.isCompany);
      this.buildForm();
    }
  }
  
  @Output() createOrUpdate = new EventEmitter<ContactAssociation>();
  @Output() delete = new EventEmitter<ContactAssociation>();

  async ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }
  }

  private buildForm()
  {
    this.form = this.formBuilder.group({
      contact: new FormControl<any>(this.contact?.isCompany ? this.currentEntity.person : this.currentEntity.company, { nonNullable: true, validators: [Validators.required] }),
      designation: new FormControl<any>(this.currentEntity.designation),
      department: new FormControl<any>(this.currentEntity.department)
    });

    this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getFilteredContacts(name as string) : of([])),
      // map(value => typeof value === "string" ? value : (value as Contact)?.name),
      // map((value: string) =>
      //   value ? this.filterContact(value) : this.filterContact()
      // )
    );

    // this.form.valueChanges
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //   )
    //   .subscribe((value) =>
    //   {
    //     this.onSubmit();
    //   });
  }
  displayFnContact(option?: Contact): string
  {
    return option ? option.fullName : '';
  }
  private getFilteredContacts(search: string): Observable<Contact[]>
  {
    return this.contactService.getOptions([
      { key: 'IsCompany', value: !this.contact?.isCompany ? 'true' : 'false' },
    ], search);
  }
  // private filterContact(value?: string)
  // {
  //   if (!value)
  //   {
  //     return this.contactOptions;
  //   }
  //   return this.contactOptions.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
  // }
  // contactOptions: Contact[] = [];
  // private async getContactOptions()
  // {
  //   this.contactOptions = await firstValueFrom(this.contactService.getOptions([
  //     { key: 'IsCompany', value: this.contact?.isCompany ? 'true' : 'false' },
  //   ]));
  // }
  async onSubmit()
  {
    if (this.form.invalid)
    {
      this.touchForm();
      // this.utilityService.showSweetDialog('Invalid Form',
      //   'Please fill all required fields with valid data and try again.', 'error'
      // );
      return;
    }
    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    const selected = this.f['contact'].value as Contact;
    if (!selected)
    {
      return;
    }
    if (this.contact.isCompany)
    {
      this.currentEntity.personContactID = selected.id;
      this.currentEntity.person = selected;
    }
    else
    {
      this.currentEntity.companyContactID = selected.id;
      this.currentEntity.company = selected;
    }
    if (this.isCreateMode)
    {
      if (!this.contactAssociationApiService.createdItems.find(x => x.personContactID == this.currentEntity.personContactID && x.companyContactID == this.currentEntity.companyContactID))
        this.contactAssociationApiService.createdItems.push(this.currentEntity);
      if (this.autoUpdate)
      {
        this.currentEntity = await firstValueFrom(this.contactAssociationApiService.create(this.currentEntity, true));
      }


      this.form.reset();
    }
    else
    {
      if (!this.contactAssociationApiService.updatedItems.find(x => x.personContactID == this.currentEntity.personContactID && x.companyContactID == this.currentEntity.companyContactID))
        this.contactAssociationApiService.updatedItems.push(this.currentEntity);
      if (this.autoUpdate)
      {
        this.currentEntity = await firstValueFrom(this.contactAssociationApiService.update(this.currentEntity, true));
      }

    }

    this.createOrUpdate.emit(this.currentEntity);
  }

  async onDelete()
  {
    if (!this.contactAssociationApiService.deletedItems.find(x => x.personContactID == this.currentEntity.personContactID && x.companyContactID == this.currentEntity.companyContactID))
      this.contactAssociationApiService.deletedItems.push(this.currentEntity);

    if (this.autoUpdate)
    {
      await firstValueFrom(this.contactAssociationApiService.delete(this.currentEntity.id));

    }
    this.delete.emit(this.currentEntity);
  }
}



