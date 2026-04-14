import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Contact } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectAssociation } from '../../models/project-association.model';
import { Project } from '../../models/project.model';
import { ProjectApiService } from '../../services/project-api.service';
import { ProjectAssociationApiService } from '../../services/project-association-api.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';

@Component({
    selector: 'app-project-create-associations',
    templateUrl: './project-create-associations.component.html',
    styleUrls: ['./project-create-associations.component.scss'],
    standalone: true,
    imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgFor, MatOptionModule, MatIconModule, MatButtonModule, MatTooltipModule, AsyncPipe,MatSelectModule]
})
export class ProjectCreateAssociationsComponent implements OnInit
{
  form!: FormGroup;
  get f(): any
  { return this.form.controls; }

  contactOptions: Contact[] = [];
  contactFilter = [];
  filteredContacts$!: Observable<any[]>;

  project!: Project;
  associations: ProjectAssociation[] = [];

  isReadOnly: boolean = false;
  updateDatabase: boolean = false;
  groupOptions: string[] = [];
  @Input('config') set configValue(value: {
    isReadOnly: boolean,
    project: Project,
    associations: ProjectAssociation[],
    contactOptions?: Contact[],
    groupOptions?: string[],
    updateDatabase: boolean
  })
  {
    if (value)
    {
      this.isReadOnly = value.isReadOnly;
      this.project = value.project;
      this.associations = value.associations;
      this.groupOptions = value.groupOptions || [];
      this.updateDatabase = value.updateDatabase;
      if (value.contactOptions != null)
      {
        this.contactOptions = value.contactOptions;
      }
      this.refresh();
    }
  }
  get isPermissionEdit() { return this.projectService.isPermissionEdit; }
  @Output() update = new EventEmitter<ProjectAssociation[]>();

  constructor(
    private formBuilder: FormBuilder,
    private associateService: ProjectAssociationApiService,
    private contactService: ContactApiService,
    private utilityService: UtilityService,
    private projectService: ProjectApiService,
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig
  ) { }

  async ngOnInit()
  {
    this.buildForm();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
      {
        await this.appSettingService.loadPresets();
      }
    const _groupOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_ASSOCIATION_GROUPS);
    if (_groupOptions)
    {
      this.groupOptions = _groupOptions.presetValue.split(',').map(x => x.toUpperCase());
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

  getContactOptions()
  {
    this.contactService.get(this.contactFilter, '', 'fullName').subscribe(data => this.contactOptions = data);
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

  onCreateAssociate()
  {

    if (!this.f['contact'].value || !this.f['contact'].value.id)
    {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a valid contact and try again!', 'error');
      return;
    }
    let _associate = new ProjectAssociation();

    _associate.title = this.f['title'].value;
    _associate.contactID = this.f['contact'].value.id;
    _associate.contact = this.f['contact'].value;
    _associate.projectID = this.project.id;

    if (this.updateDatabase)
    {

      this.associateService.create(_associate).subscribe(
        (data: any) =>
        {
          if (data)
          {
            this.associations.push(data);
          }
          this.utilityService.showSwalToast(
            "Success!",
            "Save Successfull.",
          );
         
          this.update.emit(this.associations);
        }
      );
    } else
    {
      this.associations.push(_associate);
      this.update.emit(this.associations);
    }
    this.form.reset();
  }

  onDeleteAssociate(associate: ProjectAssociation)
  {
    if (associate)
    {
      if (this.updateDatabase)
      {
        this.associateService.delete(associate.id).subscribe(
          (data: any) =>
          {
            this.associations = this.associations.filter(x => x.id !== associate.id);
            this.utilityService.showSwalToast(
              "Success!",
              "Delete Successfull.",
            );
            this.update.emit(this.associations);
          }
        );
      } else
      {
        this.associations = this.associations.filter(x => x.id !== associate.id);
        this.update.emit(this.associations);
      }
    }
  }
}
