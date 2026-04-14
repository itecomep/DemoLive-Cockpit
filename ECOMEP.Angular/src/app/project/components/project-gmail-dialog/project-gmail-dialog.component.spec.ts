import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGmailDialogComponent } from './project-gmail-dialog.component';

describe('ProjectGmailDialogComponent', () => {
  let component: ProjectGmailDialogComponent;
  let fixture: ComponentFixture<ProjectGmailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectGmailDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectGmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
