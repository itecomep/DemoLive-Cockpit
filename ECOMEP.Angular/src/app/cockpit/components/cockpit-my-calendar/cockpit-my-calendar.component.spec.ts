import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitMyCalendarComponent } from './cockpit-my-calendar.component';

describe('CockpitMyCalendarComponent', () => {
  let component: CockpitMyCalendarComponent;
  let fixture: ComponentFixture<CockpitMyCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CockpitMyCalendarComponent]
    });
    fixture = TestBed.createComponent(CockpitMyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
