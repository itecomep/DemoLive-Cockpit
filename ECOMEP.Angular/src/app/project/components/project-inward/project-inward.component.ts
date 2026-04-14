import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Project } from '../../models/project.model';
import { Contact, EmailOption } from 'src/app/contact/models/contact';
import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, map, startWith } from 'rxjs';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { ProjectInward, ProjectInwardAttachment } from '../../models/project-inward.model';
import { ProjectInwardApiService } from '../../services/project-inward-api.service';
import { McvActivityListComponent } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, DecimalPipe, DatePipe, AsyncPipe, CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProjectInwardDialogComponent } from '../project-inward-dialog/project-inward-dialog.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { ProjectInwardAttachmentApiService } from '../../services/project-inward-attachment-api.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { MatSelectModule } from '@angular/material/select';
import { McvGroupByPipe } from 'src/app/shared/pipes/mcv-group-by.pipe';

@Component({
  selector: 'app-project-inward',
  templateUrl: './project-inward.component.html',
  styleUrls: ['./project-inward.component.scss'],
  standalone: true,
  providers:[ McvGroupByPipe],
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    CommonModule,
    DecimalPipe,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatOptionModule,
    TextFieldModule,
    McvFileComponent,
    AsyncPipe,
    MatSelectModule,
    McvGroupByPipe,

    //Components
    McvActivityListComponent,
    McvFileUploadComponent,
  ]
})
export class ProjectInwardComponent {

  inwards: ProjectInward[] = [];
  contactOptions: EmailOption[] = [];
  contactFilter = [];
  filteredContacts$!: Observable<any[]>;
  project!: Project;
  updateDatabase: boolean = false;
  typeFlag: number = 0;

  form!: FormGroup;
  blobConfig: any;

  inwardCategories: string[] = [];
  get f()
  {
    return this.form.controls;
  }

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }
  @Input() title: string = 'Inward';

  @Input('config') set configValue(value: {
    isReadOnly: boolean,
    project: Project,
    contactOptions?: Contact[],
    updateDatabase: boolean,
    inwards: ProjectInward[],
    typeFlag: number,
  })
  {
    if (value)
    {
      this.typeFlag = value.typeFlag;
      this.project = value.project;
      this.inwards = value.inwards || [];
      this.updateDatabase = value.updateDatabase;
      if (value.contactOptions != null)
      {
        // this.contactOptions = value.contactOptions;
      }
      this.refresh();
    }
  }

  get PROJECT_INWARDS_TYPE_FLAG_INWARDS() { return this.projectInwardService.PROJECT_INWARDS_TYPE_FLAG_INWARDS; }
  get PROJECT_INWARDS_TYPE_FLAG_PHOTOS() { return this.projectInwardService.PROJECT_INWARDS_TYPE_FLAG_PHOTOS; }
  get PROJECT_INWARDS_TYPE_FLAG_REPORTS() { return this.projectInwardService.PROJECT_INWARDS_TYPE_FLAG_REPORTS; }
  @Input() isPermissionEdit: boolean = true;
  @Output() update = new EventEmitter<ProjectInward[]>();

  constructor(
    private contactService: ContactApiService,
    private projectInwardService: ProjectInwardApiService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private mcvfileUtilityService: McvFileUtilityService,
    private attachmentService: ProjectInwardAttachmentApiService,
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig
  )
  { }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    await this.getContactOptions();

    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    const categoryOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_INWARD_CATEGORY_OPTIONS)?.presetValue;

    if(categoryOptions){
      this.inwardCategories = categoryOptions.split(',')
    }

    this.blobConfig = {
      container: this.appSettingService?.presets?.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)?.presetValue,
      folderPath: `${this.config.NAMEOF_ENTITY_PROJECT_INWARD}`
    };
  }

  refresh()
  {
    if (this.contactOptions.length == 0)
    {
      this.getContactOptions();
    }
    if (this.inwards.length == 0)
    {
      this.getProjectInwards();
    } else
    {
      this.inwards.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
    }
  }

  async getContactOptions()
  {
    this.contactOptions = (await firstValueFrom(this.contactService.getEmailOptions(this.contactFilter, '', 'fullName'))).filter(x => x.email != undefined);
  }
  async getProjectInwards()
  {
    this.inwards = await firstValueFrom(this.projectInwardService.get([{ key: 'ProjectID', value: this.project.id.toString() },
    { key: 'typeFlag', value: this.typeFlag.toString() }
    ], ''));
    this.inwards.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
  }
  groupBy()
  {
    const groupedData = this.inwards.reduce((acc: any, curr: any) =>
    {
      const receivedDate = new Date(curr.receivedDate); // parse date string into a Date object
      const key = `${receivedDate.toLocaleDateString()} ${receivedDate.toLocaleTimeString()} | ${curr.receivedFromContactName}`;
      if (!acc[key])
      {
        acc[key] = [curr];
      } else
      {
        acc[key].push(curr);
      }
      return acc;
    }, {});
    // console.log(groupedData);

    return Object.keys(groupedData).map(key => ({
      key,
      value: groupedData[key]
    }));
    // console.log(this.filterAttachment);
  }

  async onCreate()
  {
    if (this.form.invalid)
      {
        this.utilityService.showSweetDialog('Invalid Form',
          'Please fill all required fields with valid data and try again.', 'error'
        );
        return;
      }
  
      if (!this.f['contact'].value || !this.f['contact'].value.id)
      {
        this.utilityService.showSwalToast('Invalid Contact!', 'Please select a valid contact and try again!', 'error');
        return;
      }
  
      if (this.inward.attachments.length == 0)
      {
        this.utilityService.showSweetDialog('No Attachments',
          'Please upload atleast one file and try again.', 'error'
        );
        return;
      }
  
  
      this.inward = new ProjectInward( this.form.getRawValue());
      this.inward.contactID = this.f['contact'].value ? this.f['contact'].value.id : null;
      this.inward.projectID = this.project.id;
      this.inward.typeFlag = this.typeFlag;
  
      this.inward = await firstValueFrom(this.projectInwardService.create(this.inward));
      await this.uploadFiles(this.inward);
      this.inwards.push(this.inward);
      this.inwards.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
      this.utilityService.showSwalToast('Success', `${this.title} created successfully`, 'success');
      this.update.emit(this.inwards);
      this.form.reset();
      this.inward = new ProjectInward();
  }

  onView(item: ProjectInward) {
    const dialogRef = this.projectInwardService.openDialog(ProjectInwardDialogComponent, {
      dialogTitle: `${this.title} | ${this.project.code}-${this.project.title}`,
      projectID: this.project.id,
      contactOptions: this.contactOptions,
      inward: item,
      isCreateMode: false,
      typeFlag: this.typeFlag,
      isEditMode: this.isPermissionEdit
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inwards = this.inwards.filter(x => x.id !== result.id);
        this.inwards.unshift(result);
      }
    });
  }

  getPhotos(attachments: ProjectInwardAttachment[])
  {
    return attachments.filter(x => x.thumbUrl != null).slice(0, 4);
  }

  onExportReport(reportName: string, size: string = 'a4')
  {
    if (this.project)
    {
      this.projectInwardService.exportReport(this.project?.uid, reportName, size);
    }
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null,{validators: [Validators.required]}),
      contact: new FormControl<''>('', { nonNullable: true, validators: [Validators.required] }),
      receivedDate: new FormControl<any>(new Date()),
      message: new FormControl<any>(null),
      category: new FormControl<any>(null,{validators: [Validators.required]})
    });

    this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );

  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  filterContacts(property: string): any[]
  {
    return this.contactOptions.filter((option: EmailOption) => option ? (option.name.toLowerCase().includes(property.toLowerCase()) || option.email.toLowerCase().includes(property.toLowerCase())) : false);
  }

  displayFnContact(option?: EmailOption): string
  {
    return option ? `${option.name} (${option.email})` : '';
  }

  inward=new ProjectInward();
  async onDeleteAttachment(item: ProjectInwardAttachment, index: number)
  {
    // if (!this.isCreateMode)
    // {
    //   await firstValueFrom(this.attachmentService.delete(item.id));
    // }
    this.inward.attachments.splice(index, 1);
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[])
  {
    //Creating a dummy object
    uploads.forEach(x =>
    {
      let obj = new ProjectInwardAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectInwardID = -1;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      this.inward.attachments.push(obj);
      this.uploadQueue.push(x);
      // console.log(this.uploadQueue);
    });
  }

  private async uploadFiles(entity: ProjectInward)
  {
    let _createRequests: Observable<ProjectInwardAttachment>[] = [];
    this.uploadQueue.forEach(x =>
    {
      let obj = new ProjectInwardAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectInwardID = entity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      // console.log(obj);
      _createRequests.push(this.attachmentService.create(obj));
    });
    this.uploadQueue = [];
    if (_createRequests.length != 0)
    {
     
          for (const request of _createRequests)
          {
            try
            {
              const result = await firstValueFrom(request);
              entity.attachments.push(result);
            } catch (error)
            {
              console.error('Error processing request:', error);
            }
          }
          // const results = await firstValueFrom(forkJoin(_createRequests));
          // entity.attachments.push(...results);
    }
  }


  getFilteredAttachments(attachments: ProjectInwardAttachment[], isMedia: boolean)
  {
    return isMedia ?
      attachments.filter(x => (this.mcvfileUtilityService.isImage(x.filename) || this.mcvfileUtilityService.isVideo(x.filename) || this.mcvfileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => !(this.mcvfileUtilityService.isImage(x.filename) || this.mcvfileUtilityService.isVideo(x.filename) || this.mcvfileUtilityService.isAudio(x.filename))
      );
  }
}
