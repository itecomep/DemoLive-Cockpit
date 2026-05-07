// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import {
//   FormGroup,
//   FormBuilder,
//   Validators,
//   ReactiveFormsModule,
//   AbstractControl
// } from '@angular/forms';

// // import { Observable, debounceTime, map, firstValueFrom } from 'rxjs';
// import { Observable, debounceTime, map, firstValueFrom, forkJoin } from 'rxjs';

// // Angular Material
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';

// // Your Services & Models
// import { ContactApiService } from 'src/app/contact/services/contact-api.service';
// // import { ProjectInwardApiService } from '../../services/project-inward-api.service';
// import { ProjectInwardApiService } from '../project/services/project-inward-api.service';
// // import { ProjectInwardAttachmentApiService } from '../../services/project-inward-attachment-api.service';
// import { ProjectInwardAttachmentApiService } from '../project/services/project-inward-attachment-api.service';
// import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
// import { UtilityService } from 'src/app/shared/services/utility.service';
// import { AppConfig } from 'src/app/app.config';
// // import { ProjectInward } from '../../models/project-inward.model';
// import { ProjectInward } from '../project/models/project-inward.model';
// import { ActivatedRoute } from '@angular/router';


// // File Components
// import { McvFileUploadComponent } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
// import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
// import { HeaderComponent } from "../mcv-header/components/header/header.component";
// import { ProjectInwardAttachment } from '../project/models/project-inward.model';
// import { UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
// import { ProjectApiService } from '../project/services/project-api.service';
// import { startWith } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { AuthService } from 'src/app/auth/services/auth.service';
// import { ProjectInwardService } from './project-inward.service';
// @Component({
//   selector: 'app-project-inward-page',
//   standalone: true,
//   templateUrl: './project-inward-page.component.html',
//   styleUrls: ['./project-inward-page.component.scss'],
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatAutocompleteModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatIconModule,
//     McvFileUploadComponent,
//     McvFileComponent,
//     HeaderComponent,
//   ]
// })
// export class ProjectInwardPageComponent implements OnInit {

//   pageTitle = "Project Inward Form";

//   form!: FormGroup;
//   inward: ProjectInward = new ProjectInward();

//   filteredContacts$!: Observable<any[]>;
//   contactOptions: any[] = [];

//   inwardCategories: string[] = [];
//   blobConfig: any;
//   now = new Date();

//   uploadQueue: any[] = [];
  
//   projectID!: number; 
//   projectOptions: any[] = [];
// filteredProjects$!: Observable<any[]>;

//   constructor(
//     private fb: FormBuilder,
//     private contactService: ContactApiService,
//     private inwardService: ProjectInwardApiService,
//     private attachmentService: ProjectInwardAttachmentApiService,
//     private appSettingService: AppSettingMasterApiService,
//     private config: AppConfig,
//     private utilityService: UtilityService,
//     private route: ActivatedRoute,
//     private projectService: ProjectApiService,
//     private authService: AuthService  ,
//     private projectInwardService: ProjectInwardService
//   ) { }

  
// ngOnInit() {

//   this.buildForm();        // 1️⃣ form first
//   this.loadContacts();
//   this.loadCategories();


//    this.inward = new ProjectInward();
//   this.inward.attachments = [];
//   this.projectID = 1;

//   // ✅ SAFE MODEL INIT
//   this.inward = this.inward || new ProjectInward();
//   this.inward.attachments = this.inward.attachments || [];
//   this.uploadQueue = [];

//   setTimeout(() => {
//     this.blobConfig = {
//       container:
//         this.appSettingService.presets?.find(
//           x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS
//         )?.presetValue || 'entity-attachments',
//       folderPath: `${this.config.NAMEOF_ENTITY_PROJECT_INWARD}`
//     };

//     this.bindForm(); // ✅ IMPORTANT

//   }, 300);
// }

//   get f() {
//     return this.form.controls;
//   }

// buildForm() {
//   this.form = this.fb.group({
//     projectInput: [''],
//     title: [''],
//     contact: ['', Validators.required],
//     receivedDate: [new Date()],
//     message: [''],
//     category: [null, Validators.required]
//   });

//   // 👇 CONTACT (already there in your code)
//   this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
//     debounceTime(400),
//     map(value => value ? (typeof value === "string" ? value : value.name) : ''),
//     map(name => name ? this.filterContacts(name) : this.contactOptions.slice())
//   );
// this.filteredProjects$ = this.f['projectInput'].valueChanges.pipe(
//   startWith(''),
//   debounceTime(400),
//   map((value: any) => typeof value === 'string' ? value : value?.title || ''),
//   switchMap((value: string) => this.searchProjects(value))
// );
// }


// displayFnProject(option: any) {
//   return option
//     ? `${option.code} - ${option.title}`
//     : '';
// }
//   async loadContacts() {
//     this.contactOptions = await firstValueFrom(
//       this.contactService.get([], '', 'fullName')
//     );
//   }

//   filterContacts(value: string) {
//     if (!value) return this.contactOptions;

//     return this.contactOptions.filter(x =>
//       x.name.toLowerCase().includes(value.toLowerCase())
//     );
//   }

//   displayFnContact(option: any) {
//     return option ? `${option.name} (${option.email})` : '';
//   }
 
 
//  filterProjects(value: string) {
//   if (!value) return this.projectOptions;

//   const v = value.toLowerCase();

//    return this.projectOptions.filter(x =>
//     (x.code + ' ' + (x.title || '')).toLowerCase().includes(v)
//   );
// }

  

//   loadCategories() {
//   const interval = setInterval(() => {
//     if (this.appSettingService.presets?.length) {
//       const data = this.appSettingService.presets.find(
//         x => x.presetKey == this.config.PRESET_PROJECT_INWARD_CATEGORY_OPTIONS
//       )?.presetValue;

//       if (data) {
//         this.inwardCategories = data.split(',');
//       }

//       clearInterval(interval);
//     }
//   }, 100);
// }

//   getErrorMessage(control: AbstractControl) {
//     return this.utilityService.getErrorMessage(control);
//   }


// onUpload(uploads: UploadResult[]) {

//   const newAttachments = uploads.map(x => {
//     const obj = new ProjectInwardAttachment();

//     obj.filename = x.filename;
//     obj.size = x.size;
//     obj.contentType = x.contentType;
//     obj.guidname = x.blobPath;
//     obj.blobPath = x.blobPath;
//     obj.projectInwardID = -1;
//     obj.container = this.blobConfig.container;
//     obj.typeFlag = 0;
//     obj.url = x.url;

//     return obj;
//   });

  
//   this.inward.attachments = [
//     ...this.inward.attachments,
//     ...newAttachments
//   ];

//   this.uploadQueue.push(...uploads);
// }
//   async onDeleteAttachment(file: any, index: number) {
//     this.inward.attachments.splice(index, 1);
//   }

// async onSubmit() {

//   if (this.form.invalid) {
//     this.utilityService.showSweetDialog(
//       'Error',
//       'Please fill all required fields',
//       'error'
//     );
//     return;
//   }

//   const contact = this.f['contact'].value;

//   if (!contact?.id) {
//     this.utilityService.showSweetDialog(
//       'Error',
//       'Select valid contact',
//       'error'
//     );
//     return;
//   }

//   if (!this.inward.attachments || this.inward.attachments.length === 0) {
//     this.utilityService.showSweetDialog(
//       'Error',
//       'Upload at least one file',
//       'error'
//     );
//     return;
//   }

//   // ✅ FORM VALUES
//   this.inward.title = this.f['title'].value;
//   this.inward.projectInput = this.f['projectInput'].value;
//   this.inward.message = this.f['message'].value;
//   this.inward.receivedDate = this.f['receivedDate'].value;
//   this.inward.category = this.f['category'].value;

//   this.inward.contactID = contact?.id ?? null;

//   const project = this.f['projectInput'].value;

//   this.inward.projectID = project?.id ?? null;

//   this.inward.typeFlag = 0;

//   // ✅ CLEAN PAYLOAD
//   const payload = {
//     title: this.inward.title,
//     message: this.inward.message,
//     category: this.inward.category,
//     receivedDate: this.inward.receivedDate,
//     contactID: this.inward.contactID,
//     projectID: this.inward.projectID,
//     attachmentPath:
//       this.inward.attachments?.length > 0
//         ? this.inward.attachments[0].url
//         : null
//   };

//   console.log('CLEAN PAYLOAD:', payload);

//   try {

//     const saved = await firstValueFrom(
//       this.projectInwardService.create(payload)
//     );

//     console.log('SAVED SUCCESSFULLY', saved);

//     // ✅ SUCCESS MESSAGE
//     this.utilityService.showSweetDialog(
//       'Success',
//       'Data saved successfully',
//       'success'
//     );

//     // ✅ RESET FORM
//     this.form.reset();

//     this.form.patchValue({
//       receivedDate: new Date()
//     });

//     // ✅ CLEAR ATTACHMENTS
//     this.inward = new ProjectInward();
//     this.inward.attachments = [];

//     this.uploadQueue = [];

//   } catch (err) {

//     console.error('API ERROR:', err);

//     this.utilityService.showSweetDialog(
//       'Error',
//       'Failed to save data',
//       'error'
//     );
//   }
// }

//   private async uploadFiles(entity: ProjectInward) {
//     let requests: Observable<ProjectInwardAttachment>[] = [];

//     this.uploadQueue.forEach(x => {
//       const obj = new ProjectInwardAttachment();

//       obj.filename = x.filename;
//       obj.size = x.size;
//       obj.contentType = x.contentType;
//       obj.guidname = x.blobPath;
//       obj.blobPath = x.blobPath;
//       obj.projectInwardID = entity.id;
//       obj.container = this.blobConfig.container;
//       obj.typeFlag = 0;
//       obj.url = x.url;
//       obj.originalUrl = x.url;

//       requests.push(this.attachmentService.create(obj));
//     });

//     this.uploadQueue = [];

//     if (requests.length) {
//       const results = await firstValueFrom(forkJoin(requests)) as ProjectInwardAttachment[];
//       entity.attachments.push(...results);
//     }
//   }

//   private bindForm() {
//   this.form.patchValue({
//     title: this.inward.title,
//     message: this.inward.message,
//     receivedDate: this.inward.receivedDate,
//     category: this.inward.category,
//     contact: this.inward.contactID
//       ? this.contactOptions.find(x => x.id === this.inward.contactID)
//       : null
//   });
// }


// searchProjects(value: string): Observable<any[]> {

//   const filters: any[] = [
//     { key: 'statusFlag', value: '1' },
//     { key: 'statusFlag', value: '2' },
//     { key: 'statusFlag', value: '3' }
//   ];

 
//   if (
//     !this.authService.isRoleMaster &&
//     !this.projectService.isPermissionSpecialShowAll &&
//     this.authService.currentUserStore?.teams?.length
//   ) {

//     const teamIDs = this.authService.currentUserStore.teams
//       .map(x => x.id)
//       .join(',');

//     filters.push({
//       key: 'teamID',
//       value: teamIDs
//     });
//   }

//   return this.projectService.getPages(
//     0,
//     1000,
//     filters,
//     value,
//     'code desc'
//   ).pipe(
//     map(res => res?.list || [])
//   );
// }
// }





















import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';

// import { Observable, debounceTime, map, firstValueFrom } from 'rxjs';
import { Observable, debounceTime, map, firstValueFrom, forkJoin } from 'rxjs';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Your Services & Models
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
// import { ProjectInwardApiService } from '../../services/project-inward-api.service';
import { ProjectInwardApiService } from '../project/services/project-inward-api.service';
// import { ProjectInwardAttachmentApiService } from '../../services/project-inward-attachment-api.service';
import { ProjectInwardAttachmentApiService } from '../project/services/project-inward-attachment-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppConfig } from 'src/app/app.config';
// import { ProjectInward } from '../../models/project-inward.model';
import { ProjectInward } from '../project/models/project-inward.model';
import { ActivatedRoute } from '@angular/router';


// File Components
import { McvFileUploadComponent } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { HeaderComponent } from "../mcv-header/components/header/header.component";
import { ProjectInwardAttachment } from '../project/models/project-inward.model';
import { UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { ProjectApiService } from '../project/services/project-api.service';
import { startWith } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProjectInwardService } from './project-inward.service';
@Component({
  selector: 'app-project-inward-page',
  standalone: true,
  templateUrl: './project-inward-page.component.html',
  styleUrls: ['./project-inward-page.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    McvFileUploadComponent,
    McvFileComponent,
    HeaderComponent,
  ]
})
export class ProjectInwardPageComponent implements OnInit {

  pageTitle = "Project Inward Form";

  form!: FormGroup;
  inward: ProjectInward = new ProjectInward();

  filteredContacts$!: Observable<any[]>;
  contactOptions: any[] = [];

  inwardCategories: string[] = [];
  blobConfig: any;
  now = new Date();

  uploadQueue: any[] = [];
  
  projectID!: number; 
  projectOptions: any[] = [];
filteredProjects$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactApiService,
    private inwardService: ProjectInwardApiService,
    private attachmentService: ProjectInwardAttachmentApiService,
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private projectService: ProjectApiService,
    private authService: AuthService  ,
    private projectInwardService: ProjectInwardService
  ) { }

  
ngOnInit() {

  this.buildForm();        // 1️⃣ form first
  this.loadContacts();
  this.loadCategories();


   this.inward = new ProjectInward();
  this.inward.attachments = [];
  this.projectID = 1;

  // ✅ SAFE MODEL INIT
  this.inward = this.inward || new ProjectInward();
  this.inward.attachments = this.inward.attachments || [];
  this.uploadQueue = [];

  setTimeout(() => {
    this.blobConfig = {
      container:
        this.appSettingService.presets?.find(
          x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS
        )?.presetValue || 'entity-attachments',
      folderPath: `${this.config.NAMEOF_ENTITY_PROJECT_INWARD}`
    };

    this.bindForm(); // ✅ IMPORTANT

  }, 300);
}

  get f() {
    return this.form.controls;
  }

buildForm() {
  this.form = this.fb.group({
    projectInput: [''],
    title: [''],
    contact: ['', Validators.required],
    receivedDate: [new Date()],
    message: [''],
    category: [null, Validators.required]
  });

  // 👇 CONTACT (already there in your code)
  this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
    debounceTime(400),
    map(value => value ? (typeof value === "string" ? value : value.name) : ''),
    map(name => name ? this.filterContacts(name) : this.contactOptions.slice())
  );
this.filteredProjects$ = this.f['projectInput'].valueChanges.pipe(
  startWith(''),
  debounceTime(400),
  map((value: any) => typeof value === 'string' ? value : value?.title || ''),
  switchMap((value: string) => this.searchProjects(value))
);
}


displayFnProject(option: any) {
  return option
    ? `${option.code} - ${option.title}`
    : '';
}
  async loadContacts() {
    this.contactOptions = await firstValueFrom(
      this.contactService.get([], '', 'fullName')
    );
  }

  filterContacts(value: string) {
    if (!value) return this.contactOptions;

    return this.contactOptions.filter(x =>
      x.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  displayFnContact(option: any) {
    return option ? `${option.name} (${option.email})` : '';
  }
 
 
 filterProjects(value: string) {
  if (!value) return this.projectOptions;

  const v = value.toLowerCase();

   return this.projectOptions.filter(x =>
    (x.code + ' ' + (x.title || '')).toLowerCase().includes(v)
  );
}

  

  loadCategories() {
  const interval = setInterval(() => {
    if (this.appSettingService.presets?.length) {
      const data = this.appSettingService.presets.find(
        x => x.presetKey == this.config.PRESET_PROJECT_INWARD_CATEGORY_OPTIONS
      )?.presetValue;

      if (data) {
        this.inwardCategories = data.split(',');
      }

      clearInterval(interval);
    }
  }, 100);
}

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }


onUpload(uploads: UploadResult[]) {

  const newAttachments = uploads.map(x => {
    const obj = new ProjectInwardAttachment();

    obj.filename = x.filename;
    obj.size = x.size;
    obj.contentType = x.contentType;
    obj.guidname = x.blobPath;
    obj.blobPath = x.blobPath;
    obj.projectInwardID = -1;
    obj.container = this.blobConfig.container;
    obj.typeFlag = 0;
    obj.url = x.url;

    return obj;
  });

  
  this.inward.attachments = [
    ...this.inward.attachments,
    ...newAttachments
  ];

  this.uploadQueue.push(...uploads);
}
  async onDeleteAttachment(file: any, index: number) {
    this.inward.attachments.splice(index, 1);
  }

// async onSubmit() {

//   if (this.form.invalid) {
//     this.utilityService.showSweetDialog(
//       'Error',
//       'Please fill all required fields',
//       'error'
//     );
//     return;
//   }

//   const contact = this.f['contact'].value;

//   if (!contact?.id) {
//     this.utilityService.showSweetDialog(
//       'Error',
//       'Select valid contact',
//       'error'
//     );
//     return;
//   }

//   if (!this.inward.attachments || this.inward.attachments.length === 0) {
//     this.utilityService.showSweetDialog(
//       'Error',
//       'Upload at least one file',
//       'error'
//     );
//     return;
//   }

//   // ✅ FORM VALUES
//   this.inward.title = this.f['title'].value;
//   this.inward.projectInput = this.f['projectInput'].value;
//   this.inward.message = this.f['message'].value;
//   this.inward.receivedDate = this.f['receivedDate'].value;
//   this.inward.category = this.f['category'].value;

//   this.inward.contactID = contact?.id ?? null;

//   const project = this.f['projectInput'].value;

//   this.inward.projectID = project?.id ?? null;

//   this.inward.typeFlag = 0;

//   // ✅ CLEAN PAYLOAD
//   const payload = {
//     title: this.inward.title,
//     message: this.inward.message,
//     category: this.inward.category,
//     receivedDate: this.inward.receivedDate,
//     contactID: this.inward.contactID,
//     projectID: this.inward.projectID,
//     attachmentPath:
//       this.inward.attachments?.length > 0
//         ? this.inward.attachments[0].url
//         : null
//   };

//   console.log('CLEAN PAYLOAD:', payload);

//   try {

//     const saved = await firstValueFrom(
//       this.projectInwardService.create(payload)
//     );

//     console.log('SAVED SUCCESSFULLY', saved);

//     // ✅ SUCCESS MESSAGE
//     this.utilityService.showSweetDialog(
//       'Success',
//       'Data saved successfully',
//       'success'
//     );

//     // ✅ RESET FORM
//     this.form.reset();

//     this.form.patchValue({
//       receivedDate: new Date()
//     });

//     // ✅ CLEAR ATTACHMENTS
//     this.inward = new ProjectInward();
//     this.inward.attachments = [];

//     this.uploadQueue = [];

//   } catch (err) {

//     console.error('API ERROR:', err);

//     this.utilityService.showSweetDialog(
//       'Error',
//       'Failed to save data',
//       'error'
//     );
//   }
// }




async onSubmit() {

  if (this.form.invalid) {
    this.utilityService.showSweetDialog(
      'Error',
      'Please fill all required fields',
      'error'
    );
    return;
  }

  const contact = this.f['contact'].value;

  if (!contact?.id) {
    this.utilityService.showSweetDialog(
      'Error',
      'Select valid contact',
      'error'
    );
    return;
  }

  if (!this.inward.attachments || this.inward.attachments.length === 0) {
    this.utilityService.showSweetDialog(
      'Error',
      'Upload at least one file',
      'error'
    );
    return;
  }

  // ✅ FORM VALUES
  this.inward.title = this.f['title'].value;
  this.inward.projectInput = this.f['projectInput'].value;
  this.inward.message = this.f['message'].value;
  this.inward.receivedDate = this.f['receivedDate'].value;
  this.inward.category = this.f['category'].value;

  this.inward.contactID = contact?.id ?? null;

  const project = this.f['projectInput'].value;

  this.inward.projectID = project?.id ?? null;

  this.inward.typeFlag = 0;

  // ✅ FORMDATA
  const formData = new FormData();

  formData.append(
    'title',
    this.inward.title || ''
  );

  formData.append(
    'message',
    this.inward.message || ''
  );

  formData.append(
    'category',
    this.inward.category || ''
  );

  formData.append(
    'receivedDate',
    new Date(this.inward.receivedDate).toISOString()
  );

  formData.append(
    'contactID',
    this.inward.contactID?.toString() || ''
  );

  formData.append(
    'projectID',
    this.inward.projectID?.toString() || ''
  );

  // ✅ ADD FILES
  this.uploadQueue.forEach((file: any) => {

    if (file.file) {

      formData.append(
        'files',
        file.file,
        file.filename
      );
    }
  });

  console.log('FORM DATA READY');

  try {

    const saved = await firstValueFrom(
      this.projectInwardService.create(formData)
    );

    console.log('SAVED SUCCESSFULLY', saved);

    // ✅ SUCCESS
    this.utilityService.showSweetDialog(
      'Success',
      'Data saved successfully',
      'success'
    );

    // ✅ RESET FORM
    this.form.reset();

    this.form.patchValue({
      receivedDate: new Date()
    });

    // ✅ CLEAR ATTACHMENTS
    this.inward = new ProjectInward();
    this.inward.attachments = [];

    this.uploadQueue = [];

  } catch (err) {

    console.error('API ERROR:', err);

    this.utilityService.showSweetDialog(
      'Error',
      'Failed to save data',
      'error'
    );
  }
}

  private async uploadFiles(entity: ProjectInward) {
    let requests: Observable<ProjectInwardAttachment>[] = [];

    this.uploadQueue.forEach(x => {
      const obj = new ProjectInwardAttachment();

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

      requests.push(this.attachmentService.create(obj));
    });

    this.uploadQueue = [];

    if (requests.length) {
      const results = await firstValueFrom(forkJoin(requests)) as ProjectInwardAttachment[];
      entity.attachments.push(...results);
    }
  }

  private bindForm() {
  this.form.patchValue({
    title: this.inward.title,
    message: this.inward.message,
    receivedDate: this.inward.receivedDate,
    category: this.inward.category,
    contact: this.inward.contactID
      ? this.contactOptions.find(x => x.id === this.inward.contactID)
      : null
  });
}


searchProjects(value: string): Observable<any[]> {

  const filters: any[] = [
    { key: 'statusFlag', value: '1' },
    { key: 'statusFlag', value: '2' },
    { key: 'statusFlag', value: '3' }
  ];

 
  if (
    !this.authService.isRoleMaster &&
    !this.projectService.isPermissionSpecialShowAll &&
    this.authService.currentUserStore?.teams?.length
  ) {

    const teamIDs = this.authService.currentUserStore.teams
      .map(x => x.id)
      .join(',');

    filters.push({
      key: 'teamID',
      value: teamIDs
    });
  }

  return this.projectService.getPages(
    0,
    1000,
    filters,
    value,
    'code desc'
  ).pipe(
    map(res => res?.list || [])
  );
}
}