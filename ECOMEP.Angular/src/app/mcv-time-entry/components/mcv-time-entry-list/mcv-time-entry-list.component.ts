import { DatePipe, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import swal from "sweetalert2";
import { AppConfig } from 'src/app/app.config';
import { Contact } from 'src/app/contact/models/contact';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';

import { AuthService } from 'src/app/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TimeEntryApiService } from 'src/app/wf-task/services/time-entry-api.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'mcv-time-entry-list',
    templateUrl: './mcv-time-entry-list.component.html',
    styleUrls: ['./mcv-time-entry-list.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, MatButtonModule, MatTooltipModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, NgxMaterialTimepickerModule, DecimalPipe, DatePipe]
})
export class McvTimeEntryListComponent
{
  form!: FormGroup;
  wfTask!: WFTask;
  minDate: Date = new Date();
  startDate: Date = new Date();

  @Input('wfTask') set taskValue(value: WFTask)
  {
    if (value)
    {
      this.wfTask = value;
      // console.log(this.wfTask);
      if (this.wfTask.timeEntries.length !== 0)
      {
        this.wfTask.timeEntries = this.wfTask.timeEntries.sort((a, b) => (new Date(a.startDate)).getTime() - (new Date(b.startDate)).getTime()).map(x => { this.setMHrValues(x); return x; });
      } else
      {
        this.getTimeEntries();
      }
      this.buildForm();
    }
  }

  @Input() readonly: boolean = false;
  currentContact!: Contact;

  @Output() created = new EventEmitter<TimeEntryDto>();
  @Output() deleted = new EventEmitter<TimeEntryDto>();

  get f(): any { return this.form.controls; }
  get minutesGap(): number { return this.config.MEETING_MINUTES_GAP; }
  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private timeEntryService: TimeEntryApiService,
    private config: AppConfig,
    private utilityService: UtilityService,
    protected formBuilder: FormBuilder
  ) { }

  ngOnInit(): void
  {
    if (this.authService.currentUserStore)
      this.currentContact = this.authService.currentUserStore.contact;
    this.buildForm;
  }

  getTimeEntries()
  {
    this.timeEntryService.get([{ key: 'WFTaskID', value: this.wfTask.id.toString() }]).subscribe((data: TimeEntryDto[]) =>
    {
      this.wfTask.timeEntries = data.sort((a, b) => (new Date(a.startDate)).getTime() - (new Date(b.startDate)).getTime())
        .map(x => { this.setMHrValues(x); return x; });
    });
  }

  setMHrValues(item: TimeEntryDto)
  {
    var diff = ((item.endDate ? new Date(item.endDate) : new Date()).getTime() - new Date(item.startDate).getTime()) / 1000;
    diff /= (60 * 60);
    // console.log('mhr', diff);
    item.mHr = diff;
    item.vHr = diff * item.manValue;
  }

  removeTimeEntry(timeEntry: TimeEntryDto)
  {
    const _messageText = "Delete Time Entry: "
      + this.datePipe.transform(timeEntry.startDate, 'dd MMM y')
      + " "
      + this.datePipe.transform(timeEntry.startDate, 'HH:mm')
      + "-"
      + this.datePipe.transform(timeEntry.endDate, 'HH:mm');
    swal.fire({
      title: "Are you sure?",
      text: _messageText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "CANCEL",
      // buttonsStyling: false,
      // customClass: {
      //   confirmButton: '',
      //   cancelButton: 'btn btn-light',
      // },
    }).then(result =>
    {
      if (result.value)
      {
        this.timeEntryService.delete(timeEntry.id).subscribe((data) =>
        {
          this.wfTask.timeEntries = this.wfTask.timeEntries.filter(x => x.startDate !== timeEntry.startDate);
          this.deleted.emit(timeEntry);
        });
      } else if (result.dismiss === swal.DismissReason.cancel)
      {
        swal.fire({
          title: "Cancel!",
          text: "Your Action Cancelled.",
          icon: "warning",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000
        });

      }
    });
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      start: [''],
      fromTime: [''],
      toTime: ['']
    });

    this.f.start.setValue(this.minDate);
  }

  saveTimeEntries()
  {
    if (this.f.start.value)
    {
      this.startDate = this.f.start.value;
    } else
    {
      this.startDate = this.minDate;
    }

    this.timeEntryService.create({
      contactID: this.currentContact.id,
      startDate: this.utilityService.setTimeValue(this.startDate, this.f.fromTime.value),
      endDate: this.utilityService.setTimeValue(this.startDate, this.f.toTime.value),
      wfTaskID: this.wfTask.id
    }).subscribe((result) =>
    {
      if (result)
      {
        this.created.emit(result);
        this.wfTask.timeEntries.unshift(result);
      }
      // console.log(result);
    });
    this.form.reset();
  }
}
