import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DatePipe, NgTemplateOutlet, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, Inject, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { take, Observable, debounceTime, distinctUntilChanged, switchMap, of, map, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Project } from 'src/app/project/models/project.model';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { SiteVisitApiService } from '../../services/site-visit-api.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { SiteVisit } from '../../models/site-visit.model';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';

@Component({
  selector: 'app-site-visit-create',
  templateUrl: './site-visit-create.component.html',
  styleUrls: ['./site-visit-create.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    NgTemplateOutlet,
    MatIconModule,
    MatDialogModule,
    NgIf,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatAutocompleteModule,
    NgFor,
    MatOptionModule,
    AsyncPipe
  ]
})
export class SitevisitCreateComponent implements OnInit {
  //--------FORM RELATED----------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);

  form!: FormGroup
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  private readonly ngZone = inject(NgZone);
  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;
  private triggerResize()
  {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1)).subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }
  private touchForm()
  {
    //touch form inputs to show validation messages
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        // {1}
        const control = this.form.get(field); // {2}
        if (control)
          control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }
  getErrorMessage(control?: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }
  //-----------------------------------//

  private readonly datePipe = inject(DatePipe);
  private readonly authService = inject(AuthService);
  private readonly entityService = inject(SiteVisitApiService);
  private readonly projectApiService = inject(ProjectApiService);
  private readonly config = inject(AppConfig);
  private readonly wfTaskService = inject(WFTaskApiService);
  private readonly meetingService = inject(MeetingApiService);

  currentEntity: SiteVisit = new SiteVisit();
  alertMessage: string = "";
  isShowAlert: boolean = false;
  selectedProject!: Project;
  filteredProjects$!: Observable<Project[]>;
  filteredSubjectOptions$!: Observable<any>;
  subjectOptions: string[] = [];
  isShowDateMismatchError: boolean = false;
  subjectTypeOptions: string[] = [this.config.NAMEOF_ENTITY_PROJECT];

  get minutesGap(): number { return this.config.SITE_VISIT_MINUTES_GAP; }
  get minTime() { return this.config.SITE_VISIT_MIN_TIME; }
  get maxTime() { return this.config.SITE_VISIT_MAX_TIME; }

  get dialogTitle() { return `New ${this.nameOfEntity}`; }
  get nameOfEntity() { return this.entityService.nameOfEntity; }
  get isPermissionCreateEvent() { return this.entityService.isPermissionCreateEvent; }
  // get isPermissionSpecialEdit() { return this.entityService.isPermissionSpecialEdit; }
  // get isPermissionSpecialDelete() { return this.entityService.isPermissionSpecialDelete; }


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SitevisitCreateComponent>,
  )
  { }

  ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }
    if (this.isPermissionCreateEvent)
    {
      this.subjectTypeOptions.push("Event")
    }
    this.refresh();
  }

  onClose(e: any)
  {
    this.dialogRef.close();
  }

  refresh()
  {
    if (!this.form)
    {
      this.buildForm();
    } else
    {
      // this.resetForm();
    }

    if (this.subjectOptions.length == 0)
    {
      this.getSubjectOptions();
    }
  }


  buildForm()
  {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      subjectType: new FormControl<any>(this.subjectTypeOptions[0], { validators: [Validators.required] }),
      project: new FormControl<any>(null),
      startDate: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      startTime: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      endDate: new FormControl<any>(null, { validators: [Validators.required] }),
      endTime: new FormControl<any>(null, { validators: [Validators.required] }),
      location: new FormControl<any>(null, { validators: [Validators.required] })
    });

    this.f['subjectType'].setValue(this.subjectTypeOptions[0]);
    this.onSubjectTypeChanged();
    this.f['startDate'].setValue(new Date());

    this.f['startTime'].setValue(this.utilityService.getTimeValue(new Date(), this.minutesGap));
    let _end = new Date()
    _end.setHours(_end.getHours() + 1);
    this.f['endDate'].setValue(_end);
    this.f['endTime'].setValue(this.utilityService.getTimeValue(_end, this.minutesGap));

    this.f['subjectType'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) =>
    {
      if (value)
      {
        this.onSubjectTypeChanged();
      }
    });

    this.f['startDate'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) =>
    {
      if (value)
      {
        this.f['endDate'].setValue(this.f['startDate'].value);
        // this.validateDates();
      }
    });

    this.f['endDate'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) =>
    {
      if (value)
      {
        this.validateDates();

      }
    });

    this.f['startTime'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) =>
    {
      if (value)
      {
        this.validateDates();
      }
    });
    this.f['endTime'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) =>
    {
      if (value)
      {
        this.validateDates();

      }
    });

    this.filteredProjects$ = this.f['project'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getProjectOptions(name as string) : of([])),
    );

    this.filteredSubjectOptions$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => typeof value === 'string' ? value : (value != null ? value : null)),
      map(name => name ? this._filterSubject(name as string) : this.subjectOptions.slice()),
    );

    this.touchForm();
  }

  private getProjectOptions(search: string): Observable<string[]>
  {
    return this.projectApiService.getPages(0, 20, [
    ], search).pipe(map(data => data ? data.list.map((x: Project) => x) : []));
  }

  private _filterSubject(property: string): any[]
  {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnProject(option?: any): string
  {
    return option ? option.code + "-" + option.title : '';
  }

  displayFnSubject(option?: any): string
  {
    return option ? option : '';
  }

  onProjectSelected(project: Project)
  {
    if (project)
    {
      this.selectedProject = project;
      this.f['location'].setValue(this.selectedProject.location);
    }
  }

  private async getSubjectOptions()
  {
    this.subjectOptions = await firstValueFrom(this.meetingService.getFieldOptions('title'));
  }


  onSubjectTypeChanged()
  {

    if (this.f['subjectType'].value == 'Event')
    {
      this.f['title'].reset();
      this.f['project'].reset();
      this.f['title'].setValidators([Validators.required, Validators.minLength(3)]);
      this.f['project'].setValidators();
    } {
      this.f['title'].reset();
      this.f['project'].reset();
      this.f['title'].setValidators();
      this.f['project'].setValidators([Validators.required, Validators.minLength(3)]);
    }
  }

  private validateDates(): boolean
  {
    if (this.f['startDate'].value && this.f['endDate'].value
      && this.f['startTime'].value && this.f['endTime'].value)
    {
      let startDate = this.utilityService.setTimeValue(this.f['startDate'].value, this.f['startTime'].value);
      let endDate = this.utilityService.setTimeValue(this.f['endDate'].value, this.f['endTime'].value);
      if (startDate > endDate)
      {
        let _end = new Date(startDate);
        _end.setHours(_end.getHours() + 1);
        this.f['endDate'].setValue(_end);
        this.f['endTime'].setValue(this.utilityService.getTimeValue(_end, this.minutesGap));
        return true;
      }
    }

    if (this.f['endDate'] && this.f['startDate'])
    {
      const start = (new Date(this.f['startDate'].value)).getDate();
      const end = (new Date(this.f['endDate'].value)).getDate();

      this.isShowAlert = false;
      if (end > start)
      {

        this.alertMessage = `It seems that the chosen duration ${this.datePipe.transform(this.f['startDate'].value, 'dd MMM yyyy')} - ${this.datePipe.transform(this.f['endDate'].value, 'dd-MMM-yyyy')} exceeds 24 hours. Kindly double-check and make any required adjustments.`;
        this.isShowAlert = true;
        // this.utilityService.showSweetDialog('Duplicate Name', this.firstNameHint, 'warning');

      }
    }
    return false;
  }

  async onSubmit()
  {
    if (this.form.invalid)
    {
      this.touchForm();
      console.log(this.form);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }
    this.currentEntity.projectID = this.selectedProject ? this.selectedProject.id : undefined;
    this.currentEntity.typeFlag = this.config.SITE_VISIT_TYPEFLAG_SITE_VISIT;
    this.currentEntity.location = this.f['location'].value;
    this.currentEntity.startDate = this.utilityService.setTimeValue(this.f['startDate'].value, this.f['startTime'].value);
    this.currentEntity.endDate = this.utilityService.setTimeValue(this.f['endDate'].value, this.f['endTime'].value);
    this.currentEntity.contactID = this.authService.currentUserStore ? this.authService.currentUserStore.contact.id : 0;

    if (this.f['subjectType'].value == 'Project' && !this.selectedProject)
    {
      {
        this.utilityService.showSwalToast('Incomplete Data',
          'Please select project from the list.', 'error'
        );
        return
      }
    }

    this.currentEntity.title = this.f['subjectType'].value == 'Event' ?
      this.f['title'].value
      : `${this.selectedProject.code}-${this.selectedProject.title}`;


    const _messageText = `Create New ${this.nameOfEntity}: ${this.currentEntity.title} | ${this.datePipe.transform(this.currentEntity.startDate, 'dd MMM yyyy HH:mm')} - ${this.datePipe.transform(this.currentEntity.endDate, 'dd MMM yyyy HH:mm')}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () =>
      {

        this.currentEntity = await firstValueFrom(this.entityService.create(this.currentEntity));
        this.utilityService.showSwalToast(
          'Success!',
          'Save successful.',
        );
        this.entityService.refreshList();
        this.wfTaskService.refreshList();
        this.dialogRef.close(this.currentEntity);
      });
  }
}

