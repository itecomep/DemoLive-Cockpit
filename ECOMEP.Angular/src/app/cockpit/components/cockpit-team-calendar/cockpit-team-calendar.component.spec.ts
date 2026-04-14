import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitTeamCalendarComponent } from './cockpit-team-calendar.component';

describe('CockpitTeamCalendarComponent', () => {
  let component: CockpitTeamCalendarComponent;
  let fixture: ComponentFixture<CockpitTeamCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CockpitTeamCalendarComponent]
    });
    fixture = TestBed.createComponent(CockpitTeamCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
