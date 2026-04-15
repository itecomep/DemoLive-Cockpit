// import { Component, OnInit, inject } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from "@angular/forms";
// import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatInputModule } from "@angular/material/input";
// import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatButtonModule } from "@angular/material/button";
// import { MatIconModule } from "@angular/material/icon";

// import { UtilityService } from "src/app/shared/services/utility.service";
// import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
// import { AppConfig } from "src/app/app.config";

// import {
//   McvFileUploadComponent,
//   UploadResult,
// } from "src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component";
// import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
// import { McvFileUploadConfig } from "src/app/mcv-file/models/mcv-file-upload-config.model";
// import { MatMenuModule } from "@angular/material/menu";

// import { WorkFromHomeService } from "src/app/work-from-home/work-from-home.service";

// @Component({
//   selector: "app-work-from-home",
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatButtonModule,
//     MatIconModule,
//     McvFileUploadComponent,
//     McvFileComponent,
//     MatMenuModule,
//   ],
//   templateUrl: "./work-from-home.component.html",
//   styleUrls: ["./work-from-home.component.scss"],
// })
// export class WorkFromHomeComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private dialogRef = inject(MatDialogRef<WorkFromHomeComponent>);
//   private utilityService = inject(UtilityService);
//   private appSettingService = inject(AppSettingMasterApiService);
//   private config = inject(AppConfig);
//   private wfhService = inject(WorkFromHomeService);

//   form!: FormGroup;

//   blobConfig!: McvFileUploadConfig;
//   allowEdit = true;
//   selectedFiles: File[] = [];

//   currentEntity: any = {
//     attachments: [],
//   };

//   ngOnInit() {
//     this.buildForm();
//     this.loadBlobConfig();
//   }

//   // ================= FORM =================
//   buildForm() {
//     this.form = this.fb.group({
//       startDate: ["", Validators.required],
//       endDate: ["", Validators.required],
//       reason: ["", Validators.required],
//     });
//   }

//   // ================= BLOB CONFIG =================
//   async loadBlobConfig() {
//     if (!this.appSettingService.presets?.length) {
//       await this.appSettingService.loadPresets();
//     }

//     const preset = this.appSettingService.presets.find(
//       (x) => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS,
//     );

//     if (preset) {
//       this.blobConfig = new McvFileUploadConfig(
//         preset.presetValue,
//         "WORK_FROM_HOME",
//       );
//     }
//   }

//   // ================= FILE UPLOAD =================
//   onUpload(uploads: UploadResult[]) {
//     uploads.forEach((x: any) => {
//       this.currentEntity.attachments.push({
//         filename: x.filename,
//         url: x.url,
//       });
//     });

//     console.log("Attachments:", this.currentEntity.attachments);
//   }

//   // ================= REMOVE FILE =================
//   onDeleteAttachment(file: File) {
//     this.selectedFiles = this.selectedFiles.filter(f => f !== file);
//   }

//   // ================= SUBMIT =================
//       onSubmit() {
//         if (this.form.invalid) {
//           this.utilityService.showSwalToast(
//             "Error",
//             "Please fill all required fields",
//             "error"
//           );
//           return;
//         }

//         const formData = new FormData();

//         formData.append(
//           "startDate",
//           new Date(this.form.value.startDate).toISOString()
//         );

//         formData.append(
//           "endDate",
//           new Date(this.form.value.endDate).toISOString()
//         );

//         formData.append("reason", this.form.value.reason);

//         // ✅ SEND FILES
//         this.selectedFiles.forEach(file => {
//           formData.append("files", file);
//         });

//         this.wfhService.create(formData).subscribe({
//           next: () => {
//             this.utilityService.showSwalToast("", "Request Created!", "success");
//             this.dialogRef.close(true);
//           },
//           error: (err) => {
//             console.error(err);
//             this.utilityService.showSwalToast(
//               "Error",
//               "Something went wrong",
//               "error"
//             );
//           },
//         });
//       }

//   download(file: any) {
//     if (!file?.url) return;

//     const link = document.createElement("a");
//     link.href = file.url;
//     link.target = "_blank";
//     link.download = file.filename || "download";
//     link.click();
//   }

//   remove(file: any) {
//     if (!this.currentEntity?.attachments) return;

//     this.currentEntity.attachments = this.currentEntity.attachments.filter(
//       (f: any) => f !== file,
//     );
//   }

//   // ================= CLOSE =================
//   onClose() {
//     this.dialogRef.close();
//   }
//       onFileSelected(event: any) {
//       const files = event.target.files;

//       if (!files || files.length === 0) return;

//       for (let i = 0; i < files.length; i++) {
//         this.selectedFiles.push(files[i]);
//       }
//     }

// }















// import { Component, OnInit, inject } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from "@angular/forms";
// import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatInputModule } from "@angular/material/input";
// import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatButtonModule } from "@angular/material/button";
// import { MatIconModule } from "@angular/material/icon";

// import { UtilityService } from "src/app/shared/services/utility.service";
// import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
// import { AppConfig } from "src/app/app.config";

// import {
//   McvFileUploadComponent,
//   UploadResult,
// } from "src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component";
// import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
// import { McvFileUploadConfig } from "src/app/mcv-file/models/mcv-file-upload-config.model";
// import { MatMenuModule } from "@angular/material/menu";

// import { WorkFromHomeService } from "src/app/work-from-home/work-from-home.service";

// @Component({
//   selector: "app-work-from-home",
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatButtonModule,
//     MatIconModule,
//     McvFileUploadComponent,
//     McvFileComponent,
//     MatMenuModule,
//   ],
//   templateUrl: "./work-from-home.component.html",
//   styleUrls: ["./work-from-home.component.scss"],
// })
// export class WorkFromHomeComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private dialogRef = inject(MatDialogRef<WorkFromHomeComponent>);
//   private utilityService = inject(UtilityService);
//   private appSettingService = inject(AppSettingMasterApiService);
//   private config = inject(AppConfig);
//   private wfhService = inject(WorkFromHomeService);

//   form!: FormGroup;

//   blobConfig!: McvFileUploadConfig;
//   allowEdit = true;
//   selectedFiles: File[] = [];

//   currentEntity: any = {
//     attachments: [],
//   };

//   // ================= INIT =================
//   ngOnInit() {
//     this.buildForm();
//     this.loadBlobConfig();

//     // ✅ Safe default application name (login user)
//     setTimeout(() => {
//       this.form.patchValue({
//         applicationName: this.getLoggedInUserName(),
//       });
//     });
//   }

//   // ================= FORM =================
//   buildForm() {
//     this.form = this.fb.group({
//       applicationName: [""], // editable field
//       startDate: ["", Validators.required],
//       endDate: ["", Validators.required],
//       reason: ["", Validators.required],
//     });
//   }

//   // ================= LOGIN USER NAME =================
//   getLoggedInUserName() {
//     return "Work From Home Request"; // replace with real login user API/service
//   }

//   // ================= BLOB CONFIG =================
//   async loadBlobConfig() {
//     if (!this.appSettingService.presets?.length) {
//       await this.appSettingService.loadPresets();
//     }

//     const preset = this.appSettingService.presets.find(
//       (x) => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS
//     );

//     if (preset) {
//       this.blobConfig = new McvFileUploadConfig(
//         preset.presetValue,
//         "WORK_FROM_HOME"
//       );
//     }
//   }

//   // ================= FILE UPLOAD =================
//   onUpload(uploads: UploadResult[]) {
//     uploads.forEach((x: any) => {
//       this.currentEntity.attachments.push({
//         filename: x.filename,
//         url: x.url,
//       });
//     });
//   }

//   // ================= REMOVE FILE =================
//   onDeleteAttachment(file: File) {
//     this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
//   }

//   // ================= SUBMIT =================
//   onSubmit() {
//     if (this.form.invalid) {
//       this.utilityService.showSwalToast(
//         "Error",
//         "Please fill all required fields",
//         "error"
//       );
//       return;
//     }

//     // ✅ FINAL APPLICATION NAME LOGIC
//     const typedName = this.form.value.applicationName?.trim();

//     const applicationName =
//       typedName && typedName.length > 0
//         ? typedName
//         : this.getLoggedInUserName();

//     const formData = new FormData();

//     formData.append("applicationName", applicationName);

//     formData.append(
//       "startDate",
//       new Date(this.form.value.startDate).toISOString()
//     );

//     formData.append(
//       "endDate",
//       new Date(this.form.value.endDate).toISOString()
//     );

//     formData.append("reason", this.form.value.reason);

//     this.selectedFiles.forEach((file) => {
//       formData.append("files", file);
//     });

//     this.wfhService.create(formData).subscribe({
//       next: () => {
//         this.utilityService.showSwalToast("", "Request Created!", "success");
//         this.dialogRef.close(true);
//       },
//       error: (err) => {
//         console.error(err);
//         this.utilityService.showSwalToast(
//           "Error",
//           "Something went wrong",
//           "error"
//         );
//       },
//     });
//   }

//   // ================= CLOSE =================
//   onClose() {
//     this.dialogRef.close();
//   }

//   // ================= FILE SELECT =================
//   onFileSelected(event: any) {
//     const files = event.target.files;

//     if (!files || files.length === 0) return;

//     for (let i = 0; i < files.length; i++) {
//       this.selectedFiles.push(files[i]);
//     }
//   }

//   download(file: any) {
//     if (!file?.url) return;

//     const link = document.createElement("a");
//     link.href = file.url;
//     link.target = "_blank";
//     link.download = file.filename || "download";
//     link.click();
//   }

//   remove(file: any) {
//     if (!this.currentEntity?.attachments) return;

//     this.currentEntity.attachments = this.currentEntity.attachments.filter(
//       (f: any) => f !== file
//     );
//   }
// }














import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatOptionModule } from "@angular/material/core";

import { UtilityService } from "src/app/shared/services/utility.service";
import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
import { AppConfig } from "src/app/app.config";

import { WorkFromHomeService } from "src/app/work-from-home/work-from-home.service";

import { Contact } from "src/app/contact/models/contact";
import { ContactApiService } from "src/app/contact/services/contact-api.service";

import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  firstValueFrom,
} from "rxjs";

import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";

@Component({
  selector: "app-work-from-home",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,

    MatAutocompleteModule,   // ✅ FIX
    MatOptionModule,         // ✅ FIX

    McvFileComponent,        // ✅ FIX
  ],
  templateUrl: "./work-from-home.component.html",
  styleUrls: ["./work-from-home.component.scss"],
})
export class WorkFromHomeComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WorkFromHomeComponent>);
  private utilityService = inject(UtilityService);
  private appSettingService = inject(AppSettingMasterApiService);
  private config = inject(AppConfig);
  private wfhService = inject(WorkFromHomeService);
  private contactService = inject(ContactApiService);

  form!: FormGroup;

  selectedFiles: File[] = [];
  allowEdit = true;

  // contacts
  contactOptions: Contact[] = [];
  filteredContacts$!: Observable<Contact[]>;

  currentEntity: any = {
    attachments: [],
  };

  // ================= INIT =================
  async ngOnInit() {
    this.buildForm();
    await this.loadContacts();
  }

  // ================= FORM =================
  buildForm() {
    this.form = this.fb.group({
      applicationUser: [null, Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      reason: ["", Validators.required],
    });
  }

  // ================= CONTACT LOAD =================
  async loadContacts() {
    this.contactOptions = await firstValueFrom(
      this.contactService.get(
        [{ key: "usersOnly", value: "true" }],
        "",
        "fullName"
      )
    );

    this.filteredContacts$ = this.form
      .get("applicationUser")!
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => {
          const name = typeof value === "string" ? value : value?.name;

          return name
            ? this.contactOptions.filter((c) =>
                c.name.toLowerCase().includes(name.toLowerCase())
              )
            : this.contactOptions.slice();
        })
      );
  }

  // ================= DISPLAY =================
  // displayFnContact(option?: Contact): string {
  //   return option ? option.name : "";
  // }

  displayFnContact(option: Contact | string): string {
  if (!option) return "";

  return typeof option === "string"
    ? option
    : option.name;
}


  // ================= FILES =================
  onFileSelected(event: any) {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  onDeleteAttachment(file: File) {
    this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
  }

  // ================= SUBMIT =================
  onSubmit() {
    if (this.form.invalid) {
      this.utilityService.showSwalToast(
        "Error",
        "Fill required fields",
        "error"
      );
      return;
    }

    const selectedUser: Contact = this.form.value.applicationUser;

    const applicationName =
      selectedUser?.name || "Work From Home Request";

    const formData = new FormData();

    formData.append("applicationName", applicationName);
    formData.append(
      "applicationUserId",
      selectedUser?.id?.toString() || "0"
    );
    formData.append(
      "startDate",
      new Date(this.form.value.startDate).toISOString()
    );
    formData.append(
      "endDate",
      new Date(this.form.value.endDate).toISOString()
    );
    formData.append("reason", this.form.value.reason);

    this.selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    this.wfhService.create(formData).subscribe({
      next: () => {
        this.utilityService.showSwalToast("", "Request Created!", "success");
        this.dialogRef.close(true);
      },
      error: () => {
        this.utilityService.showSwalToast(
          "Error",
          "Something went wrong",
          "error"
        );
      },
    });
  }

  // ================= CLOSE =================
  onClose() {
    this.dialogRef.close();
  }
}
