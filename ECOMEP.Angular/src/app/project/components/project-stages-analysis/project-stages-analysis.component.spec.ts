import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStagesAnalysisComponent } from './project-stages-analysis.component';

describe('ProjectStagesAnalysisComponent', () => {
  let component: ProjectStagesAnalysisComponent;
  let fixture: ComponentFixture<ProjectStagesAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStagesAnalysisComponent]
    });
    fixture = TestBed.createComponent(ProjectStagesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
