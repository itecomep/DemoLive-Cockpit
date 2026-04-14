import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaComponent } from './meeting-agenda.component';

describe('MeetingAgendaComponent', () => {
  let component: MeetingAgendaComponent;
  let fixture: ComponentFixture<MeetingAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingAgendaComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MeetingAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
