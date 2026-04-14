import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WFTaskAnalysis } from '../../models/wf-task-analysis';

@Component({
  selector: 'task-analysis-assessment',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './task-analysis-assessment.component.html',
  styleUrls: ['./task-analysis-assessment.component.scss']
})
export class TaskAnalysisAssessmentComponent {
  @Input() item!: WFTaskAnalysis;
  @Input() isMobileView: boolean = false;
  @Input() hideEntity: boolean = false;
  @Input() showAll: boolean = false;
  @Input() total!: WFTaskAnalysis;
  @Input() isExpanded: boolean[] = [];
  @Input() i: number = 0;
  constructor() { }

  getAssessmentScore(value: any): any {
    let newVal = (value * 2);
    let res = [];
    for (let i = 0; i < newVal; i++) {
      res.push(i);
    }
    // console.log(res);
    return res;
  }
}

