import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveListItemComponent } from './leave-list-item.component';

describe('LeaveListItemComponent', () => {
  let component: LeaveListItemComponent;
  let fixture: ComponentFixture<LeaveListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LeaveListItemComponent]
    });
    fixture = TestBed.createComponent(LeaveListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
