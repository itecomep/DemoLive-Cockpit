import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingVoucherComponent } from './meeting-voucher.component';

describe('MeetingVoucherComponent', () => {
  let component: MeetingVoucherComponent;
  let fixture: ComponentFixture<MeetingVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeetingVoucherComponent]
    });
    fixture = TestBed.createComponent(MeetingVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
