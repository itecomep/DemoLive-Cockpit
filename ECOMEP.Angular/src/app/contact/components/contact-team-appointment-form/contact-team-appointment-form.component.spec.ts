import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamAppointmentFormComponent } from './contact-team-appointment-form.component';

describe('ContactTeamAppointmentFormComponent', () => {
  let component: ContactTeamAppointmentFormComponent;
  let fixture: ComponentFixture<ContactTeamAppointmentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactTeamAppointmentFormComponent]
});
    fixture = TestBed.createComponent(ContactTeamAppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
