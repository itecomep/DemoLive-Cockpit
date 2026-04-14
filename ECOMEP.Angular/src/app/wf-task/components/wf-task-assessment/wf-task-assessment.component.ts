import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';

import { AssessmentDto } from 'src/app/shared/models/assessment-dto';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from '../../services/wf-task-api.service';
import { AssessmentMasterDto } from 'src/app/shared/models/assessment-master-dto';
import { AssessmentApiService } from '../../services/assessment-api.service';
import { AssessmentMasterApiService } from '../../services/assessment-master-api.service';
import { ObservableInput, forkJoin } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { StarRatingComponent } from '../../../star-rating/components/star-rating/star-rating.component';
import { WftaskTitleBarComponent } from '../wftask-title-bar/wftask-title-bar.component';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-wf-task-assessment',
    templateUrl: './wf-task-assessment.component.html',
    styleUrls: ['./wf-task-assessment.component.scss'],
    standalone: true,
    imports: [NgIf, WftaskTitleBarComponent, NgFor, StarRatingComponent, MatButtonModule, MatTooltipModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, DecimalPipe]
})
export class WfTaskAssessmentComponent implements OnInit
{
  wfTask!: WFTask;

  @Input('wfTaskID') set taskID(id: number)
  {
    if (id)
    {
      this.refresh();
      this.getCurrentTask(id);
    }
  }

  @Input() saveButtonText: string = 'Save';
  @Input() saveButtonTooltip: string = 'Click to save';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() cancelButtonTooltip: string = 'Click to close the form';


  @Output() cancel = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() assessmentData = new EventEmitter<any>();

  form!: FormGroup;
  get f(): any { return this.form.controls; }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize()
  {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  assessments: AssessmentDto[] = [];
  totalPoints = 0;
  assessmentUploadIndex = 0;

  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    public utilityService: UtilityService,
    private assessmentMasterService: AssessmentMasterApiService,
    private assessmentService: AssessmentApiService,
    private wftaskService: WFTaskApiService
  ) { }

  ngOnInit()
  {

  }

  refresh()
  {
    this.buildForm();
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      comment: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] })
    });
  }
  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }
  getCurrentTask(id: number)
  {
    this.wftaskService.getById(id).subscribe(data =>
    {
      this.wfTask = data;
      this.wfTask.assessmentPoints = 10;
      this.wfTask.mHrAssessed = this.wfTask.mHrAssigned;
      if (this.wfTask.assessments.length != 0)
      {
        this.f.comment.setValue(this.wfTask.assessmentRemark);
      }
      this.getAssessmentMasters();
    });
  }

  getAssessmentMasters()
  {
    if (this.wfTask)
    {
      this.assessmentMasterService.get().subscribe(
        data =>
        {
          data.forEach((item: AssessmentMasterDto) =>
          {
            let _obj = new AssessmentDto();
            _obj.wfTaskID = this.wfTask.id,
              _obj.taskTitle = this.wfTask.title,
              _obj.contactID = this.wfTask.contactID,
              _obj.entity = this.wfTask.entity;
            _obj.entityID = this.wfTask.entityID;
            _obj.entityTitle = this.wfTask.entityTitle;
            _obj.points = item.points;
            _obj.category = item.category;
            let _exist = this.wfTask.assessments.find(x => x.category == item.category);
            if (_exist)
            {
              _obj.scoredPoints = _exist.scoredPoints * 2.0;
            }
            this.assessments.push(_obj);
          });


          this.calculateTotalPoints();
          this.calculateTotalScoredPoints();
        }
      );
    }
  }

  onRatingsChanged(e: any)
  {
    this.calculateTotalScoredPoints();
  }

  clearRatings(i: number)
  {
    this.assessments[i].scoredPoints = 0;
    this.calculateTotalScoredPoints();
  }

  private calculateTotalPoints()
  {
    let totalPoints = 0;
    this.assessments.forEach(item =>
    {
      if (item && item.points)
      {
        totalPoints = totalPoints + item.points;
      }
    });
    this.totalPoints = totalPoints;

  }

  private calculateTotalScoredPoints()
  {
    let totalScoredPoints = 0;
    this.assessments.forEach(item =>
    {
      if (item && item.scoredPoints)
      {
        totalScoredPoints += item.scoredPoints / 2.0;
      }
    });

    if (this.wfTask)
    {
      this.wfTask.assessmentPoints = totalScoredPoints;
      this.wfTask.mHrAssessed = this.wfTask.isPreAssignedTimeTask ?
        this.wfTask.mHrAssigned * (this.wfTask.assessmentPoints / this.totalPoints) :
        this.wfTask.mHrConsumed * (this.wfTask.assessmentPoints / this.totalPoints);
    }

    if (totalScoredPoints == 10)
    {
      this.f.comment.setValidators();
    } else
    {
      this.f.comment.setValidators([Validators.required]);
    }

    this.assessmentData.emit({task:this.wfTask, assessments: this.assessments});
  }

  onSubmitAndReAssign()
  {
    this.onSubmit();
  }
  onSubmit()
  {
    if (this.assessments.length == 0)
    {
      this.utilityService.showSweetDialog("Invalid!", "Assessment not done correctly please try again!", "error");
      return;
    }
    const requests: ObservableInput<any>[] = [];
    this.assessments.forEach((item: AssessmentDto) =>
    {
      item.wfTaskID = this.wfTask.id;
      item.scoredPoints = item.scoredPoints / 2.0;
      requests.push(this.assessmentService.create(item));
    });
    forkJoin(requests).subscribe(results =>
    {
      // this.wfTask.assessments = this.assessments;
      this.wfTask.assessmentRemark = this.f.comment.value;
      this.wftaskService.update(this.wfTask).subscribe((data: any) =>
      {
        this.update.emit(data);
      })
    });



    // forkJoin(_createRequests).subscribe(results => {
    //   this.update.emit(this.assessments);
    // });

  }

  onCancel()
  {
    this.cancel.emit();
  }
}
