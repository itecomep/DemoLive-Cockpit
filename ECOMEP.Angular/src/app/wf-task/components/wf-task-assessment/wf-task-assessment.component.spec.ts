import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskAssessmentComponent } from './wf-task-assessment.component';

describe('WfTaskAssessmentComponent', () => {
  let component: WfTaskAssessmentComponent;
  let fixture: ComponentFixture<WfTaskAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfTaskAssessmentComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WfTaskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
