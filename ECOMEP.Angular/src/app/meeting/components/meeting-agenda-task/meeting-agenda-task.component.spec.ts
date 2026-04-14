import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaTaskComponent } from './meeting-agenda-task.component';

describe('MeetingAgendaTaskComponent', () => {
  let component: MeetingAgendaTaskComponent;
  let fixture: ComponentFixture<MeetingAgendaTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingAgendaTaskComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAgendaTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
