import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, map } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { ProjectAssociationApiService } from '../../services/project-association-api.service';

import { Project } from '../../models/project.model';
import { Contact } from 'src/app/contact/models/contact';
import { ProjectAssociation, ProjectAssociationListItem } from 'src/app/project/models/project-association.model';
import { ProjectApiService } from '../../services/project-api.service';
import { McvActivityListComponent } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContactDialogComponent } from 'src/app/contact/components/contact-dialog/contact-dialog.component';
import { McvGroupByPipe } from 'src/app/shared/pipes/mcv-group-by.pipe';
import { ContactListItemComponent } from 'src/app/contact/components/contact-list-item/contact-list-item.component';
import { MatSelectModule } from '@angular/material/select';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { ProjectAssociationContactListItemComponent } from "../project-association-contact-list-item/project-association-contact-list-item.component";

@Component({
    selector: 'app-project-association',
    templateUrl: './project-association.component.html',
    styleUrls: ['./project-association.component.scss'],
    standalone: true,
    providers: [
      McvGroupByPipe
    ],
    imports: [MatExpansionModule,
    NgFor, NgIf, MatTooltipModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatOptionModule, McvActivityListComponent, AsyncPipe,
    McvGroupByPipe, ContactListItemComponent, MatSelectModule, ProjectAssociationContactListItemComponent]
})
export class ProjectAssociationComponent implements OnInit
{
  form!: FormGroup;
  get f(): any
  { return this.form.controls; }

  contactOptions: Contact[] = [];
  contactFilter = [];
  filteredContacts$!: Observable<any[]>;

  project!: Project;
  associations: ProjectAssociation[] = [];
  groupOptions: string[] = [];
  updateDatabase: boolean = false;

  @Input('config') set configValue(value: {
    project: Project,
    associations: ProjectAssociation[],
    contactOptions?: Contact[],
    updateDatabase: boolean
  })
  {
    if (value)
    {
      this.project = value.project;
      this.associations = value.associations;
      this.updateDatabase = value.updateDatabase;
      if (value.contactOptions != null)
      {
        this.contactOptions = value.contactOptions;
      }
      this.refresh();
    }
  }

  get isPermissionAssociationsEdit() { return this.projectService.isPermissionAssociationsEdit; }
  get isPermissionAssociationsDelete() { return this.projectService.isPermissionAssociationsDelete; }
  @Output() update = new EventEmitter<ProjectAssociation[]>();

  constructor(
    private formBuilder: FormBuilder,
    private projectAssociationService: ProjectAssociationApiService,
    private contactService: ContactApiService,
    private utilityService: UtilityService,
    private projectService: ProjectApiService,
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig
  ) { }

  async ngOnInit()
  {
    this.buildForm();
    await this.getContactOptions();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
      {
        await this.appSettingService.loadPresets();
      }
  
    const _groupOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_ASSOCIATION_GROUPS);
    if (_groupOptions)
    {
      this.groupOptions = _groupOptions.presetValue.split(',').map(x => x.toUpperCase()).sort((a,b)=>a.localeCompare(b));
      this.f.title.setValue(this.groupOptions[0],{emitEvent: false});
    }
  }

  refresh()
  {
    if (this.contactOptions.length == 0)
    {
      this.getContactOptions();
    }
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      contact: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      title: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
    });

    this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),

    );
  }

  async getContactOptions()
  {
    this.contactOptions = await firstValueFrom(this.contactService.get(this.contactFilter, '', 'fullName'));
  }

  filterContacts(property: string): any[]
  {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnContact(option?: Contact): string
  {
    return option ? option.name : '';
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  async onCreate()
  {

    if (!this.f['contact'].value || !this.f['contact'].value.id)
    {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a valid contact and try again!', 'error');
      return;
    }
    let _associate = new ProjectAssociation();

    _associate.title = this.f['title'].value;
    _associate.contactID = this.f['contact'].value.id;
    _associate.projectID = this.project.id;

    if (this.updateDatabase)
    {

     const data= await firstValueFrom(this.projectAssociationService.create(_associate));
        
          if (data)
          {
            this.associations.push(data);
            this.associations=this.associations.map(x=> Object.assign({},x));
          }
          this.utilityService.showSwalToast(      "Success!",
            "Save Successfull.",
          );
          this.form.reset();
          this.update.emit(this.associations);
          console.log(this.associations);
    } else
    {
      this.associations.push(_associate);
      this.update.emit(this.associations);
    }
  }

  async onDeleteAssociate(associate: ProjectAssociation)
  {
    if (associate)
    {
      if (this.updateDatabase)
      {
        await firstValueFrom(this.projectAssociationService.delete(associate.id))
            this.associations = this.associations.filter(x => x.id !== associate.id);
            this.utilityService.showSwalToast(
              "Success!",
              "Delete Successfull.",
            );
            this.update.emit(this.associations);
       
      } else
      {
        this.associations = this.associations.filter(x => x.id !== associate.id);
        this.update.emit(this.associations);
      }
    }
  }

  onOpenContactDialog(contact: ProjectAssociationListItem)
  {this.projectAssociationService.openDialog(ContactDialogComponent, contact);
  }

  getAssociationByGroup(group:string){
    return this.associations.filter(x=>x.title==group);  
  }
}
