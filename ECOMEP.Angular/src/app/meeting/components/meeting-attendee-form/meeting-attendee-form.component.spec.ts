import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAttendeeFormComponent } from './meeting-attendee-form.component';

describe('MeetingAttendeeFormComponent', () => {
  let component: MeetingAttendeeFormComponent;
  let fixture: ComponentFixture<MeetingAttendeeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingAttendeeFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MeetingAttendeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
