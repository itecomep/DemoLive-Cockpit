import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaTaskDialogComponent } from './meeting-agenda-task-dialog.component';

describe('MeetingAgendaTaskDialogComponent', () => {
  let component: MeetingAgendaTaskDialogComponent;
  let fixture: ComponentFixture<MeetingAgendaTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingAgendaTaskDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAgendaTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
