import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAttendanceComponent } from './my-attendance.component';

describe('MyAttendanceComponent', () => {
  let component: MyAttendanceComponent;
  let fixture: ComponentFixture<MyAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyAttendanceComponent]
    });
    fixture = TestBed.createComponent(MyAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
