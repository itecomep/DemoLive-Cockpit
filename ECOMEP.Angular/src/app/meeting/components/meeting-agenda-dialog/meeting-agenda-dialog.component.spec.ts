import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaDialogComponent } from './meeting-agenda-dialog.component';

describe('MeetingAgendaDialogComponent', () => {
  let component: MeetingAgendaDialogComponent;
  let fixture: ComponentFixture<MeetingAgendaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeetingAgendaDialogComponent]
    });
    fixture = TestBed.createComponent(MeetingAgendaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
