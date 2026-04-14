import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePagedListComponent } from './leave-paged-list.component';

describe('LeavePagedListComponent', () => {
  let component: LeavePagedListComponent;
  let fixture: ComponentFixture<LeavePagedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LeavePagedListComponent]
    });
    fixture = TestBed.createComponent(LeavePagedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
