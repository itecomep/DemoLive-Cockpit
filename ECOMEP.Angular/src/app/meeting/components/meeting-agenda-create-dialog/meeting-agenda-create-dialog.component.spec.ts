import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaCreateDialogComponent } from './meeting-agenda-create-dialog.component';

describe('MeetingAgendaCreateDialogComponent', () => {
  let component: MeetingAgendaCreateDialogComponent;
  let fixture: ComponentFixture<MeetingAgendaCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeetingAgendaCreateDialogComponent]
    });
    fixture = TestBed.createComponent(MeetingAgendaCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
