import { Component, EventEmitter, Inject, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, firstValueFrom, debounceTime, distinctUntilChanged, map, forkJoin } from 'rxjs';

import { UtilityService } from 'src/app/shared/services/utility.service';

import { SitevisitAgenda } from '../../models/site-visit-agenda.model';
import { SitevisitAgendaAttachment } from '../../models/site-visit-agenda.model';
import { SiteVisit } from '../../models/site-visit.model';
import { SiteVisitAttendee } from '../../models/site-visit-attendee.model';
import { SiteVisitAttendeeApiService } from '../../services/site-visit-attendee-api.service';
import { SiteVisitAgendaApiService } from '../../services/site-visit-agenda-api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { SiteVisitAgendaAttachmentApiService } from '../../services/site-visit-agenda-attachment-api.service';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-site-visit-agenda-form',
  templateUrl: './site-visit-agenda-form.component.html',
  styleUrls: ['./site-visit-agenda-form.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgFor, MatOptionModule, MatDatepickerModule, MatTooltipModule, MatCheckboxModule, TextFieldModule, NgIf, McvFileUploadComponent, McvFileComponent, AsyncPipe]
})
export class SitevisitAgendaFormComponent implements OnInit {
  private readonly sitevisitAgendaApiService = inject(SiteVisitAgendaApiService);
  private readonly sitevisitAttendeeApiService = inject(SiteVisitAttendeeApiService);
  //--------FORM RELATED----------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);
  form!: FormGroup;
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  sitevisit!: SiteVisit;
  currentEntity: SitevisitAgenda = new SitevisitAgenda();

  autoUpdate: boolean = false;
  isCreateMode: boolean = false;
  attendeeOptions: SiteVisitAttendee[] = [];
  filteredActionByOptions$!: Observable<SiteVisitAttendee[]>;

  get dialogTitle() { return `${this.isCreateMode ? 'New' : 'Edit'} Agenda`; }
  get nameOfEntity() { return this.sitevisitAgendaApiService.nameOfEntity; }
  get SITE_VISIT_AGENDA_STATUSFLAG_PENDING() { return this.sitevisitAgendaApiService.SITE_VISIT_AGENDA_STATUSFLAG_PENDING; }
  get SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED() { return this.sitevisitAgendaApiService.SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED; }
  get SITE_VISIT_ATTENDEE_TYPEFLAG_TO() { return this.sitevisitAttendeeApiService.SITE_VISIT_ATTENDEE_TYPEFLAG_TO; }


  constructor(
    private dialog: MatDialogRef<SitevisitAgendaFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      isCreateMode: boolean,
      autoUpdate: boolean,
      blobConfig: McvFileUploadConfig
      agenda?: SitevisitAgenda,
      sitevisit?: SiteVisit,

    }
  ) {
    if (data) {
      this.isCreateMode = data.isCreateMode;
      this.autoUpdate = data.autoUpdate;
      this.currentEntity = data.agenda ? data.agenda : new SitevisitAgenda();
      this.blobConfig = data.blobConfig;

      if (data.sitevisit) {
        this.sitevisit = data.sitevisit;
        this.attendeeOptions = data.sitevisit.attendees;
        this.currentEntity.sitevisitID = data.sitevisit.id;
      }
      this.buildForm();
    }
  }


  private touchForm() {
    //touch form inputs to show validation messages
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        // {1}
        const control = this.form.get(field); // {2}
        if (control)
          control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }
  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }
  //-----------------------------------//

  // blob upload //
  private readonly attachmentService = inject(SiteVisitAgendaAttachmentApiService);

  blobConfig!: McvFileUploadConfig;
  uploadQueue: SitevisitAgendaAttachment[] = [];
  onUpload(uploads: UploadResult[]) {
    uploads.forEach(x => {
      let obj = new SitevisitAgendaAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.sitevisitAgendaID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.currentEntity.typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      this.uploadQueue.push(obj);
      if (this.isCreateMode) {
        this.currentEntity.attachments.push(obj);
      }
    });

    if (!this.isCreateMode) {
      this.uploadFiles();
    }

  }

  private async uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach((obj: SitevisitAgendaAttachment) => {

      obj.sitevisitAgendaID = this.currentEntity.id;
      _createRequests.push(this.attachmentService.create(obj));
    });
    this.uploadQueue = [];

    const files = await firstValueFrom(forkJoin(_createRequests))

    this.currentEntity.attachments.push(...files);

  }

  getFilteredAttachments(attachments: SitevisitAgendaAttachment[], typeFlag: number, isMedia: boolean) {
    return this.attachmentService.getFilteredAttachments(attachments, typeFlag, isMedia);
  }
  async onDeleteAttachment(file: SitevisitAgendaAttachment) {
    this.currentEntity.attachments = this.currentEntity.attachments.filter(obj => obj.url !== file.url);
    if (this.autoUpdate) {
      await firstValueFrom(this.attachmentService.delete(file.id));
    }

  }


  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
  }
  onClose(e: any) {
    this.dialog.close(e);
  }
  dateFilter = (d: Date | null): boolean => {
    // Prevent Saturday and Sunday from being selected.
    // if (d.getDay() === 0) {
    //   return false;
    // }
    const day = (d || new Date());
    const date = new Date();
    date.setDate(date.getDate() - 1);

    if (day < date) {
      return false;
    }
    return true;
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(this.currentEntity.title, { validators: [Validators.required] }),
      subtitle: new FormControl<any>(this.currentEntity.subtitle, { validators: [Validators.required] }),
      comment: new FormControl<any>(this.currentEntity.comment),
      actionByAttendee: new FormControl<any>(null),
      actionBy: new FormControl<any>(this.currentEntity.actionBy),
      actionByContactID: new FormControl<any>(this.currentEntity.actionByContactID),
      dueDate: new FormControl<any>(this.currentEntity.dueDate),
      isResolved: new FormControl<any>(this.currentEntity.statusFlag == this.SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED),
    });

    this.f['actionByAttendee'].setValue(this.sitevisit.attendees.find(x => x.contactID === this.currentEntity.actionByContactID));

    this.filteredActionByOptions$ = this.f['actionByAttendee'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((value: string) =>
        value ? this.filterAttendee(value) : this.filterAttendee()
      )
    );



    this.form.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        // this.onSubmit();
      });
  }
  onResetDueDate() {
    this.f['dueDate'].setValue(null);
  }
  private filterAttendee(value?: string) {
    if (!value) {
      return this.attendeeOptions;
    }
    return this.attendeeOptions.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
  }

  displayFnActionBy(option?: any): string {
    return option ? option.name + " | " + option.company : '';
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }
    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    if (this.f['isResolved'].value == true) {
      this.currentEntity.statusFlag = this.SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED;
      this.currentEntity.actionBy = undefined;
      this.currentEntity.actionByContactID = undefined;
      this.currentEntity.dueDate = undefined;
    } else {
      this.currentEntity.statusFlag = this.SITE_VISIT_AGENDA_STATUSFLAG_PENDING;
      this.currentEntity.actionBy = this.f['actionByAttendee'].value ? (this.f['actionByAttendee'].value as SiteVisitAttendee).name : undefined;
      this.currentEntity.actionByContactID = this.f['actionByAttendee'].value ? (this.f['actionByAttendee'].value as SiteVisitAttendee).contactID : undefined;
    }
    if (this.isCreateMode) {
      if (this.autoUpdate) {
        this.currentEntity.sitevisitID = this.sitevisit.id;
        this.currentEntity = await firstValueFrom(this.sitevisitAgendaApiService.create(this.currentEntity, true));

        if (this.uploadQueue.length) {
          this.uploadFiles();
        }
        this.utilityService.showSwalToast('', 'Agenda Created Successfully!', 'success');
      }
      else {
        this.currentEntity.attachments.push(...this.uploadQueue);
      }
      this.form.reset();
    }
    else {
      if (this.autoUpdate) {
        this.currentEntity = await firstValueFrom(this.sitevisitAgendaApiService.update(this.currentEntity, true));

        if (this.uploadQueue.length) {
          this.uploadFiles();
        }
      }
      else {
        this.currentEntity.attachments.push(...this.uploadQueue);
      }
    }
    this.onClose(this.currentEntity);
  }


}


