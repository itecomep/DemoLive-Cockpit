import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTargetFormComponent } from './project-target-form.component';

describe('ProjectTargetFormComponent', () => {
  let component: ProjectTargetFormComponent;
  let fixture: ComponentFixture<ProjectTargetFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectTargetFormComponent]
    });
    fixture = TestBed.createComponent(ProjectTargetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
