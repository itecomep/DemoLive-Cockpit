import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaFileComponent } from './meeting-agenda-file.component';

describe('MeetingAgendaFileComponent', () => {
  let component: MeetingAgendaFileComponent;
  let fixture: ComponentFixture<MeetingAgendaFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingAgendaFileComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAgendaFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
