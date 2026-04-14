import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';

import { AppConfig } from 'src/app/app.config';
import { Contact } from 'src/app/contact/models/contact';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, startWith } from 'rxjs';
import { ProjectInward, ProjectInwardAttachment } from '../../models/project-inward.model';
import { ProjectInwardAttachmentApiService } from '../../services/project-inward-attachment-api.service';
import { ProjectInwardApiService } from '../../services/project-inward-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ProjectApiService } from '../../services/project-api.service';

@Component({
  selector: 'app-project-inward-dialog',
  templateUrl: './project-inward-dialog.component.html',
  styleUrls: ['./project-inward-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatOptionModule,
    TextFieldModule,
    AsyncPipe,
    DatePipe,
    MatSelectModule,
    CommonModule,
    
    //Components
    McvFileUploadComponent,
    McvFileComponent,
  ]
})
export class ProjectInwardDialogComponent implements OnInit
{
  dialogTitle: string = "";
  form!: FormGroup;
  filteredContacts$!: Observable<any[]>;
  contactOptions: any[] = [];
  contactFilter = [];
  blobConfig: any;
  isEditMode: boolean = false;
  now = new Date();
  projectID!: number;
  inward: ProjectInward = new ProjectInward();
  isCreateMode: boolean = false;
  typeFlag: number = 0;
  inwardCategories: string[] = [];

  get f()
  {
    return this.form.controls;
  }

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }
  
  constructor(
    private dialogRef: MatDialogRef<ProjectInwardDialogComponent>,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private appSettingService: AppSettingMasterApiService,
    private attachmentService: ProjectInwardAttachmentApiService,
    private config: AppConfig,
    private contactService: ContactApiService,
    private projectService:ProjectApiService,
    private projectInwardService: ProjectInwardApiService,
    private mcvfileUtilityService: McvFileUtilityService,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  )
  {
    if (dialogData)
    {
      if (!this.form)
      {
        this.buildForm();
      }
      this.dialogTitle = dialogData.dialogTitle;
      this.projectID = dialogData.projectID;
      this.isEditMode = dialogData.isEditMode;
      this.contactOptions = dialogData.contactOptions;
      this.isCreateMode = dialogData.isCreateMode;
      this.inward = dialogData.inward ? dialogData.inward : new ProjectInward();
      this.typeFlag = dialogData.typeFlag;
      this.bindForm();
      if (!this.contactOptions || this.contactOptions.length == 0)
      {
        this.getContactOptions();
      }
    }
  }

  ngOnInit()
  {
    this.blobConfig = {
      container: this.appSettingService?.presets?.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)?.presetValue,
      folderPath: `${this.config.NAMEOF_ENTITY_PROJECT_INWARD}`
    };

    if (!this.form)
    {
      this.buildForm();
    }

    const categoryOptions = this.appSettingService.presets
    .find(x => x.presetKey == this.config.PRESET_PROJECT_INWARD_CATEGORY_OPTIONS)?.presetValue;

  if(categoryOptions){
    this.inwardCategories = categoryOptions.split(',')
  }
  }

  private bindForm()
  {
    this.form.patchValue(this.inward);
  }

  private async getContactOptions()
  {
    this.contactOptions = (await firstValueFrom(this.contactService.get(this.contactFilter, '', 'fullName'))).filter(x => x.email != undefined);
  }

  filterContacts(property: string): any[]
  {
    return this.contactOptions.filter((option: Contact) => option ? (option.name.toLowerCase().includes(property.toLowerCase()) || option.emails.find(x => x.email.toLowerCase().includes(property.toLowerCase()))) : false);
  }

  displayFnContact(option?: any): string
  {
    return option ? `${option.name} (${option.email})` : '';
  }

  buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null),
      contact: new FormControl<''>('', { nonNullable: true, validators: [Validators.required] }),
      receivedDate: new FormControl<any>(new Date()),
      message: new FormControl<any>(null),
      category: new FormControl<any>(null, { validators: [Validators.required] }),
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

  onClose()
  {
    this.dialogRef.close();
  }

  async onDeleteAttachment(item: ProjectInwardAttachment, index: number)
  {
    if (!this.isCreateMode)
    {
      await firstValueFrom(this.attachmentService.delete(item.id));
    }
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

      const results = await firstValueFrom(forkJoin(_createRequests));
      entity.attachments.push(...results);
    }
    this.dialogRef.close(entity);
  }

  async onSubmit()
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


    this.inward.title = this.f['title'].value;
    this.inward.message = this.f['message'].value;
    this.inward.receivedDate = this.f['receivedDate'].value;
    this.inward.contactID = this.f['contact'].value ? this.f['contact'].value.id : null;
    this.inward.category = this.f['category'].value;
    this.inward.projectID = this.projectID;
    this.inward.typeFlag = this.typeFlag;
    if (this.isCreateMode)
    {
      this.inward = await firstValueFrom(this.projectInwardService.create(this.inward));
      await this.uploadFiles(this.inward);
    } else
    {
      this.inward = Object.assign(this.inward, await firstValueFrom(this.projectInwardService.update(this.inward)));
      await this.uploadFiles(this.inward);
      this.dialogRef.close(this.inward);
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
