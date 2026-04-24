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
import { AuthService } from "src/app/auth/services/auth.service";
import { AppPermissions } from "src/app/app.permissions";

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
    MatAutocompleteModule,
    MatOptionModule,
    McvFileComponent,
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

  private authService = inject(AuthService);
private permissions = inject(AppPermissions);

  form!: FormGroup;

  selectedFiles: File[] = [];
  allowEdit = true;

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
  // buildForm() {
  //   this.form = this.fb.group({
  //     applicationUser: [null],
  //     startDate: ["", Validators.required],
  //     endDate: ["", Validators.required],
  //     reason: ["", Validators.required],
  //   });
  // }

  buildForm() {
  const currentUser = this.wfhService["getCurrentUser"]();

  this.form = this.fb.group({
    applicationUser: [
      this.canSelectUser
        ? null
        : {
            id: currentUser.userId,
            name: currentUser.userName
          }
    ],
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
        "fullName",
      ),
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
                c.name.toLowerCase().includes(name.toLowerCase()),
              )
            : this.contactOptions.slice();
        }),
      );
  }

  // ================= DISPLAY =================
  displayFnContact(option: Contact | string): string {
    if (!option) return "";
    return typeof option === "string" ? option : option.name;
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
        "error",
      );
      return;
    }

    const formData = new FormData();
    const selectedUser: Contact = this.form.value.applicationUser;

    if (selectedUser && selectedUser.id) {
      formData.append("userId", selectedUser.id.toString());
      formData.append("userName", selectedUser.name);
    } else {
      const currentUser = this.wfhService["getCurrentUser"]();

      formData.append("userId", currentUser.userId.toString());
      formData.append("userName", currentUser.userName);
    }

    formData.append(
      "startDate",
      new Date(this.form.value.startDate).toISOString(),
    );
    formData.append("endDate", new Date(this.form.value.endDate).toISOString());
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
          "error",
        );
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  get canSelectUser(): boolean {
  return this.authService.isInAnyRole([this.permissions.HR_SELECT_USER]);
}
}
