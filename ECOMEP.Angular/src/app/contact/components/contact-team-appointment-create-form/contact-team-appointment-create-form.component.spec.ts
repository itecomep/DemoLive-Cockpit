import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamAppointmentCreateFormComponent } from './contact-team-appointment-create-form.component';

describe('ContactTeamAppointmentCreateFormComponent', () => {
  let component: ContactTeamAppointmentCreateFormComponent;
  let fixture: ComponentFixture<ContactTeamAppointmentCreateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactTeamAppointmentCreateFormComponent]
});
    fixture = TestBed.createComponent(ContactTeamAppointmentCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
