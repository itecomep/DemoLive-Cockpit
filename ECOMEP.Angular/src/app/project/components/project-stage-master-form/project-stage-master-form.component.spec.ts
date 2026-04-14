import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageMasterFormComponent } from './project-stage-master-form.component';

describe('ProjectStageMasterFormComponent', () => {
  let component: ProjectStageMasterFormComponent;
  let fixture: ComponentFixture<ProjectStageMasterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStageMasterFormComponent]
    });
    fixture = TestBed.createComponent(ProjectStageMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
