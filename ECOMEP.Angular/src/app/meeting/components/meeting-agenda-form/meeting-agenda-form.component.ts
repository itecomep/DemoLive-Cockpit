import { Component, EventEmitter, Inject, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, firstValueFrom, debounceTime, distinctUntilChanged, map, forkJoin } from 'rxjs';
import { MeetingAgenda, MeetingAgendaAttachment } from 'src/app/meeting/models/meeting-agenda.model';
import { MeetingAgendaApiService } from 'src/app/meeting/services/meeting-agenda-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Meeting } from '../../models/meeting.model';
import { MeetingAttendee } from '../../models/meeting-attendee.model';
import { MeetingAttendeeApiService } from '../../services/meeting-attendee-api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { MeetingAgendaAttachmentApiService } from '../../services/meeting-agenda-attachment-api.service';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-meeting-agenda-form',
  templateUrl: './meeting-agenda-form.component.html',
  styleUrls: ['./meeting-agenda-form.component.scss'],
  standalone: true,
  imports: [MatButtonModule,CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgFor, MatOptionModule, MatDatepickerModule, MatTooltipModule, MatCheckboxModule, TextFieldModule, NgIf, McvFileUploadComponent, McvFileComponent, AsyncPipe]
})
export class MeetingAgendaFormComponent implements OnInit {
  private readonly meetingAgendaApiService = inject(MeetingAgendaApiService);
  private readonly meetingAttendeeApiService = inject(MeetingAttendeeApiService);
  //--------FORM RELATED----------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);
  form!: FormGroup;
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  meeting!: Meeting;
  currentEntity: MeetingAgenda = new MeetingAgenda();

  autoUpdate: boolean = false;
  isCreateMode: boolean = false;
  attendeeOptions: MeetingAttendee[] = [];
  filteredActionByOptions$!: Observable<MeetingAttendee[]>;

  get dialogTitle() { return `${this.isCreateMode ? 'New' : 'Edit'} Agenda`; }
  get nameOfEntity() { return this.meetingAgendaApiService.nameOfEntity; }
  get MEETING_AGENDA_STATUSFLAG_PENDING() { return this.meetingAgendaApiService.MEETING_AGENDA_STATUSFLAG_PENDING; }
  get MEETING_AGENDA_STATUSFLAG_RESOLVED() { return this.meetingAgendaApiService.MEETING_AGENDA_STATUSFLAG_RESOLVED; }
  get MEETING_ATTENDEE_TYPEFLAG_TO() { return this.meetingAttendeeApiService.MEETING_ATTENDEE_TYPEFLAG_TO; }


  constructor(
    private dialog: MatDialogRef<MeetingAgendaFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      isCreateMode: boolean,
      autoUpdate: boolean,
      blobConfig: McvFileUploadConfig
      agenda?: MeetingAgenda,
      meeting?: Meeting,
      typeFlag?: number
    }
  ) {
    if (data) {
      console.log(data);
      this.isCreateMode = data.isCreateMode;
      this.autoUpdate = data.autoUpdate;
      this.currentEntity = data.agenda ? data.agenda : new MeetingAgenda();
      this.blobConfig = data.blobConfig;

      if (data.meeting) {
        this.meeting = data.meeting;
        this.attendeeOptions = data.meeting.attendees;
        this.currentEntity.meetingID = data.meeting.id;
      }
      
      if (data.typeFlag !== undefined) {
        this.currentEntity.typeFlag = data.typeFlag;
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
  private readonly attachmentService = inject(MeetingAgendaAttachmentApiService);

  blobConfig!: McvFileUploadConfig;
  uploadQueue: MeetingAgendaAttachment[] = [];
  onUpload(uploads: UploadResult[]) {
    uploads.forEach(x => {
      let obj = new MeetingAgendaAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.meetingAgendaID = this.currentEntity.id;
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
    this.uploadQueue.forEach((obj: MeetingAgendaAttachment) => {

      obj.meetingAgendaID = this.currentEntity.id;
      _createRequests.push(this.attachmentService.create(obj));
    });
    this.uploadQueue = [];

    const files = await firstValueFrom(forkJoin(_createRequests))

    this.currentEntity.attachments.push(...files);

  }

  getFilteredAttachments(attachments: MeetingAgendaAttachment[], typeFlag: number, isMedia: boolean) {
    return this.attachmentService.getFilteredAttachments(attachments, typeFlag, isMedia);
  }
  async onDeleteAttachment(file: MeetingAgendaAttachment) {
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
      subtitle: new FormControl<any>(this.currentEntity.subtitle),
      comment: new FormControl<any>(this.currentEntity.comment),
      actionByAttendee: new FormControl<any>(null),
      actionBy: new FormControl<any>(this.currentEntity.actionBy),
      actionByContactID: new FormControl<any>(this.currentEntity.actionByContactID),
      dueDate: new FormControl<any>(this.currentEntity.dueDate),
      isResolved: new FormControl<any>(this.currentEntity.statusFlag == this.MEETING_AGENDA_STATUSFLAG_RESOLVED),
    });

    if (this.currentEntity.actionByContactID) {
      this.f['actionByAttendee'].setValue(this.attendeeOptions.find(x => x.contactID === this.currentEntity.actionByContactID));
    }

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
      this.currentEntity.statusFlag = this.MEETING_AGENDA_STATUSFLAG_RESOLVED;
      this.currentEntity.actionBy = undefined;
      this.currentEntity.actionByContactID = undefined;
      this.currentEntity.dueDate = undefined;
    } else {
      this.currentEntity.statusFlag = this.MEETING_AGENDA_STATUSFLAG_PENDING;
      this.currentEntity.actionBy = this.f['actionByAttendee'].value ? (this.f['actionByAttendee'].value as MeetingAttendee).name : undefined;
      this.currentEntity.actionByContactID = this.f['actionByAttendee'].value ? (this.f['actionByAttendee'].value as MeetingAttendee).contactID : undefined;
    }
    if (this.isCreateMode) {
      if (this.autoUpdate) {
        this.currentEntity.meetingID = this.meeting.id;
        this.currentEntity = await firstValueFrom(this.meetingAgendaApiService.create(this.currentEntity, true));

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
        this.currentEntity = await firstValueFrom(this.meetingAgendaApiService.update(this.currentEntity, true));

        if (this.uploadQueue.length) {
          this.uploadFiles();
        }
      }
      // else {
      //   this.currentEntity.attachments.push(...this.uploadQueue);
      // }
    }
    this.onClose(this.currentEntity);
  }
}


