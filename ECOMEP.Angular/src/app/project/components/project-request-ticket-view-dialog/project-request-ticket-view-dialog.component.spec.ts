import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRequestTicketViewDialogComponent } from './project-request-ticket-view-dialog.component';

describe('ProjectRequestTicketViewDialogComponent', () => {
  let component: ProjectRequestTicketViewDialogComponent;
  let fixture: ComponentFixture<ProjectRequestTicketViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectRequestTicketViewDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectRequestTicketViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
