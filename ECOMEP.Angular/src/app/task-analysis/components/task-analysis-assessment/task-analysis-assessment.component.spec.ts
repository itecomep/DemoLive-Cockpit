import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAnalysisAssessmentComponent } from './task-analysis-assessment.component';

describe('TaskAnalysisAssessmentComponent', () => {
  let component: TaskAnalysisAssessmentComponent;
  let fixture: ComponentFixture<TaskAnalysisAssessmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskAnalysisAssessmentComponent]
    });
    fixture = TestBed.createComponent(TaskAnalysisAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
