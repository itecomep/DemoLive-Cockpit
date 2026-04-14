import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamAppointmentComponent } from './contact-team-appointment.component';

describe('ContactTeamAppointmentComponent', () => {
  let component: ContactTeamAppointmentComponent;
  let fixture: ComponentFixture<ContactTeamAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactTeamAppointmentComponent]
});
    fixture = TestBed.createComponent(ContactTeamAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
