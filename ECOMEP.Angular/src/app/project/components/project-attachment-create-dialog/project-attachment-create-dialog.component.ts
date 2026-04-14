import { Component, EventEmitter, Inject, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Contact, EmailOption } from 'src/app/contact/models/contact';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { ProjectAttachment } from '../../models/project.model';
import { MatInputModule } from '@angular/material/input';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { ProjectAttachmentApiService } from '../../services/project-attachment-api.service';

@Component({
  selector: 'app-project-attachment-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    TextFieldModule,
    MatDialogModule,
    MatInputModule,

    //Components
    McvFileUploadComponent,
    McvFileComponent
  ],
  templateUrl: './project-attachment-create-dialog.component.html',
  styleUrls: ['./project-attachment-create-dialog.component.scss']
})
export class ProjectAttachmentCreateDialogComponent implements OnInit {
  config = inject(AppConfig);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  contactService = inject(ContactApiService);
  appSettingService = inject(AppSettingMasterApiService);
  projectAttachmentService = inject(ProjectAttachmentApiService);
  dialogRef = inject(MatDialogRef<ProjectAttachmentCreateDialogComponent>);

  form!: FormGroup;
  projectID!: number;
  typeFlag!: number;
  title!:string;
  blobConfig!: any;
  contactOptions: EmailOption[] = [];
  attachments: ProjectAttachment[] = [];
  filteredContacts$!: Observable<any[]>;

  @Output() uploadComplete = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    if (data) {
      console.log(data);
      this.projectID = data.data.projectID;
      this.typeFlag = data.data.typeFlag;
      this.title = data.data.title;
    }
  }

  get f(): any { return this.form.controls }
  get isMobileView() { return this.utilityService.isMobileView }

  async ngOnInit() {
    this.getContactOptions();
    if (!this.form) {
      this.buildForm();
    }

    this.blobConfig = {
      container: this.appSettingService?.presets?.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)?.presetValue,
      folderPath: `${this.config.NAMEOF_ENTITY_PROJECT}`
    };
  }

  async getContactOptions() {
    this.contactOptions = (await firstValueFrom(this.contactService.getEmailOptions([], '', 'fullName'))).filter(x => x.email != undefined);
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      contact: new FormControl<''>('', { nonNullable: true, validators: [Validators.required] }),
      receivedDate: new FormControl<any>(new Date()),
    });

    this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice())
    );
  }

  displayFnContact(option?: EmailOption): string {
    return option ? `${option.name} (${option.email})` : '';
  }

  filterContacts(property: string): any[] {
    console.log(property);
    return this.contactOptions.filter((option: EmailOption) => option ? (option.name.toLowerCase().includes(property.toLowerCase()) || option.email.toLowerCase().includes(property.toLowerCase())) : false);
  }

  onClose() {
    this.dialogRef.close();
  }


  uploadQueue: ProjectAttachment[] = [];
  onUpload(uploads: UploadResult[]) {
    uploads.forEach(x => {
      let obj = new ProjectAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectID = this.projectID;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      obj.title = this.title;
      obj.receivedFromContactID = this.f['contact'].value.id;
      obj.receivedFromContactName = this.f['contact'].value.name;
      obj.receivedDate = this.f['receivedDate'].value;

      this.uploadQueue.push(obj);
      this.attachments.push(obj);
    });
  }

  onDeleteAttachment(item: ProjectAttachment) {
    if (item) {
      this.attachments = this.attachments.filter(obj => obj.uid !== item.uid);
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    if (!this.f['contact'].value || !this.f['contact'].value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a valid contact and try again!', 'error');
      return;
    }

    if (this.attachments.length == 0) {
      this.utilityService.showSweetDialog('No Attachments',
        'Please upload atleast one file and try again.', 'error'
      );
      return;
    }

    let _createRequests: Observable<any>[] = [];
    this.attachments.forEach(obj => {
      _createRequests.push(this.projectAttachmentService.create(obj));
    });
    this.attachments = [];
    forkJoin(_createRequests).subscribe(results => {
      console.log('createdAttachments', results);
      results.forEach(x => {
        this.attachments.push(x as ProjectAttachment);
      })
      this.dialogRef.close(this.attachments);
    });
  }
}
