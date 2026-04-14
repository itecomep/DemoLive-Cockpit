import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAttachmentCreateDialogComponent } from './project-attachment-create-dialog.component';

describe('ProjectAttachmentCreateDialogComponent', () => {
  let component: ProjectAttachmentCreateDialogComponent;
  let fixture: ComponentFixture<ProjectAttachmentCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectAttachmentCreateDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectAttachmentCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
