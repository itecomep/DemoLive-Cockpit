import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamAppointmentListComponent } from './contact-team-appointment-list.component';

describe('ContactTeamAppointmentListComponent', () => {
  let component: ContactTeamAppointmentListComponent;
  let fixture: ComponentFixture<ContactTeamAppointmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactTeamAppointmentListComponent]
});
    fixture = TestBed.createComponent(ContactTeamAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
