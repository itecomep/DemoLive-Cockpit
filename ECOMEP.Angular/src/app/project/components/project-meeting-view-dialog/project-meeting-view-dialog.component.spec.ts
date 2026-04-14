import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMeetingViewDialogComponent } from './project-meeting-view-dialog.component';

describe('ProjectMeetingViewDialogComponent', () => {
  let component: ProjectMeetingViewDialogComponent;
  let fixture: ComponentFixture<ProjectMeetingViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectMeetingViewDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectMeetingViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
