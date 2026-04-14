import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ContactAssociation, Contact } from '../../models/contact';
import { ContactAssociationApiService } from '../../services/contact-association-api.service';
import { ContactApiService } from '../../services/contact-api.service';
import { FormControl, Validators, AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContactListItemComponent } from '../contact-list-item/contact-list-item.component';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { ContactAssociationFormComponent } from '../contact-association-form/contact-association-form.component';

@Component({
  selector: 'app-contact-association',
  templateUrl: './contact-association.component.html',
  styleUrls: ['./contact-association.component.scss'],
  standalone: true,
  imports: [
    McvActivityListComponent,
    MatExpansionModule,
    ContactListItemComponent,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgFor,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AsyncPipe,
    ContactAssociationFormComponent
]
})
export class ContactAssociationComponent implements OnInit {
  form!: FormGroup;
  parentForm!: FormGroup;
  get f(): any { return this.form.controls; }
  get pf(): any { return this.parentForm.controls; }
  get isActiveAppointment() { return this.contact.appointments.filter(x => x.statusFlag == this.config.TEAM_APPOINTMENT_STATUS_APPOINTED).length > 0; }

  // contactOptions: Contact[] = [];
  // contactFilter = [];
  filteredContacts$!: Observable<any[]>;
  filteredParents$!: Observable<any[]>;
  contact!: Contact;
  associations: ContactAssociation[] = [];
  groupOptions: string[] = [];
  updateDatabase: boolean = false;

  @Input('config') set configValue(value: {
    contact: Contact,
    associations: ContactAssociation[],
    contactOptions?: Contact[],
    updateDatabase: boolean
  }) {
    if (value) {
      this.contact = value.contact;
      this.associations = value.associations;
      this.updateDatabase = value.updateDatabase;
      // if (value.contactOptions != null) {
      //   this.contactOptions = value.contactOptions;
      // }
      this.refresh();
    }
  }
  
  get isPermissionAssocationEdit() { return this.contactService.isPermissionAssocationEdit; }
  get isPermissionAssocationDelete() { return this.contactService.isPermissionAssocationDelete; }
  @Output() update = new EventEmitter<ContactAssociation[]>();

  constructor(
    private formBuilder: FormBuilder,
    private associationService: ContactAssociationApiService,
    private contactService: ContactApiService,
    private utilityService: UtilityService,
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig
  ) { }

  async ngOnInit() {
    this.buildForm();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    const _groupOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_ASSOCIATION_GROUPS);
    if (_groupOptions) {
      this.groupOptions = _groupOptions.presetValue.split(',').map(x => x.toUpperCase());
      // this.f.title.setValue(this.groupOptions[0],{emitEvent: false});
    }
  }

  async refresh() {
    // if (this.contactOptions.length == 0) {
    //   await this.getContactOptions();
    // }
    if(this.contact.parentID && !this.contact.parent){
      this.contact.parent = await firstValueFrom(this.contactService.getById(this.contact.parentID));
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      contact: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      designation: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      department: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
    });

    this.parentForm = this.formBuilder.group({
      parentCompany: new FormControl<any>(null, { validators: Validators.required })
    });

    this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getFilteredContacts(name as string) : of([])),
      // map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      // map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),
    );

    this.filteredParents$ = this.pf['parentCompany'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getFilteredContacts(name as string) : of([])),
      // map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      // map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),
    );
  }

  private getFilteredContacts(search: string): Observable<Contact[]>
  {
    // console.log('getFilteredContacts', search);
    return this.contactService.getOptions([
      { key: 'IsCompany', value: !this.contact?.isCompany ? 'true' : 'false' },
    ], search).pipe(map(data => data ? data.map((x: Contact) => x) : []));
  }
  // async getContactOptions() {
  //   const _contactOptions = await firstValueFrom(this.contactService.getOptions([{ key: 'isCompany', value: this.contact?.isCompany ? 'false' : 'true' }], '', 'fullName'));
  //   if (_contactOptions) {
  //     this.contactOptions = _contactOptions;
  //   }
  // }

  // filterContacts(property: string): any[] {
  //   return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  // }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  async onCreate() {

    if (!this.f['contact'].value || !this.f['contact'].value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a valid contact and try again!', 'error');
      return;
    }

    let _associate = new ContactAssociation();

    _associate.department = this.f['department'].value;
    _associate.designation = this.f['designation'].value;
    if (this.contact && this.contact.isCompany) {
      _associate.personContactID = this.f['contact'].value.id;
      _associate.person = this.f['contact'].value;
      _associate.companyContactID = this.contact.id;
    } else {
      _associate.personContactID = this.contact.id;
      _associate.companyContactID = this.f['contact'].value.id;
      _associate.company = this.f['contact'].value;
    }

    if (this.associations.find(x => x.personContactID == _associate.personContactID && x.companyContactID == _associate.companyContactID)) {
      this.utilityService.showSwalToast('Duplicate Contact!', 'This contact is already associated with this contact!', 'error');
      return;
    }
    if (this.updateDatabase) {

      const data = await firstValueFrom(this.associationService.create(_associate));

      if (data) {
        this.associations.push(data);
        this.associations = this.associations.map(x => Object.assign({}, x));
      }
      this.utilityService.showSwalToast("Success!",
        "Save Successfull.",
      );

      this.update.emit(this.associations);
    } else {
      this.associations.push(_associate);
      this.update.emit(this.associations);
    }
    this.form.reset();
  }

  async onDeleteAssociate(associate: ContactAssociation) {
    if (associate) {
      if (this.updateDatabase) {
        await firstValueFrom(this.associationService.delete(associate.id))
        this.associations = this.associations.filter(x => x.id !== associate.id);
        this.utilityService.showSwalToast(
          "Success!",
          "Delete Successfull.",
        );
        this.update.emit(this.associations);

      } else {
        this.associations = this.associations.filter(x => x.id !== associate.id);
        this.update.emit(this.associations);
      }
    }
  }

  async onDeletParent() {
    this.utilityService.showConfirmationDialog('Do you want to remove Parent Company?', async () => {
      this.contact.parentID = undefined;
      this.contact.parent = undefined;
      const _udpated = await firstValueFrom(this.contactService.update(this.contact));
      this.pf['parentCompany'].setValue('');
      this.utilityService.showSwalToast('Parent Company removed successfully!!!', 'success');
      if (_udpated) {
        this.contact = Object.assign(this.contact, _udpated);
      }
    });
  }

  onOpenContactDialog(contact: Contact) {
    this.associationService.openDialog(ContactDialogComponent, contact);
  }

  async onSelectParentCompany(contact: any) {
    this.utilityService.showConfirmationDialog(`Do you want to set ${contact.fullName} as Parent Company?`, async () => {
      this.contact.parentID = contact.id;
      this.contact.parent = contact;
      const _udpated = await firstValueFrom(this.contactService.update(this.contact));
      this.utilityService.showSwalToast('Parent Company set successfully!!!', 'success');
    });
  }
}
