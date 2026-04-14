import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStagesUpdateComponent } from './project-stages-update.component';

describe('ProjectStagesUpdateComponent', () => {
  let component: ProjectStagesUpdateComponent;
  let fixture: ComponentFixture<ProjectStagesUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStagesUpdateComponent]
    });
    fixture = TestBed.createComponent(ProjectStagesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
