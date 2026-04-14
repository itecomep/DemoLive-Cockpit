import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskAssessmentDialogComponent } from './wf-task-assessment-dialog.component';

describe('WfTaskAssessmentDialogComponent', () => {
  let component: WfTaskAssessmentDialogComponent;
  let fixture: ComponentFixture<WfTaskAssessmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfTaskAssessmentDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WfTaskAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
