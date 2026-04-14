import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStagesCreateComponent } from './project-stages-create.component';

describe('ProjectStagesCreateComponent', () => {
  let component: ProjectStagesCreateComponent;
  let fixture: ComponentFixture<ProjectStagesCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStagesCreateComponent]
    });
    fixture = TestBed.createComponent(ProjectStagesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
