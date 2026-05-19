import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTargetPointFormComponent } from './project-target-point-form.component';

describe('ProjectTargetPointFormComponent', () => {
  let component: ProjectTargetPointFormComponent;
  let fixture: ComponentFixture<ProjectTargetPointFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectTargetPointFormComponent]
    });
    fixture = TestBed.createComponent(ProjectTargetPointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
