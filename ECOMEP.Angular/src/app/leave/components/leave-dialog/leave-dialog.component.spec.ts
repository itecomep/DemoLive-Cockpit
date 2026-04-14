import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDialogComponent } from './leave-dialog.component';

describe('LeaveDialogComponent', () => {
  let component: LeaveDialogComponent;
  let fixture: ComponentFixture<LeaveDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LeaveDialogComponent]
    });
    fixture = TestBed.createComponent(LeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
