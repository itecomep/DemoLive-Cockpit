import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillAnalysisComponent } from './project-bill-analysis.component';

describe('ProjectBillAnalysisComponent', () => {
  let component: ProjectBillAnalysisComponent;
  let fixture: ComponentFixture<ProjectBillAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectBillAnalysisComponent]
    });
    fixture = TestBed.createComponent(ProjectBillAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
