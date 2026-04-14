import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageDateUpdateDialogComponent } from './project-stage-date-update-dialog.component';

describe('ProjectStageDateUpdateDialogComponent', () => {
  let component: ProjectStageDateUpdateDialogComponent;
  let fixture: ComponentFixture<ProjectStageDateUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStageDateUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectStageDateUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
