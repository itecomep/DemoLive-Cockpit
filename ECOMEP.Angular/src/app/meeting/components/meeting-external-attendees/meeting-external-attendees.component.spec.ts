import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingExternalAttendeesComponent } from './meeting-external-attendees.component';

describe('MeetingExternalAttendeesComponent', () => {
  let component: MeetingExternalAttendeesComponent;
  let fixture: ComponentFixture<MeetingExternalAttendeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeetingExternalAttendeesComponent]
    });
    fixture = TestBed.createComponent(MeetingExternalAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
