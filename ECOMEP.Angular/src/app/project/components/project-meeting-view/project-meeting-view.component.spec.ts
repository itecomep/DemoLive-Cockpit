import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMeetingViewComponent } from './project-meeting-view.component';

describe('ProjectMeetingViewComponent', () => {
  let component: ProjectMeetingViewComponent;
  let fixture: ComponentFixture<ProjectMeetingViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ProjectMeetingViewComponent]
});
    fixture = TestBed.createComponent(ProjectMeetingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
