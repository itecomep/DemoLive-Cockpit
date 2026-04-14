import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCalendarComponent } from './leave-calendar.component';

describe('LeaveCalendarComponent', () => {
  let component: LeaveCalendarComponent;
  let fixture: ComponentFixture<LeaveCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LeaveCalendarComponent]
    });
    fixture = TestBed.createComponent(LeaveCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
