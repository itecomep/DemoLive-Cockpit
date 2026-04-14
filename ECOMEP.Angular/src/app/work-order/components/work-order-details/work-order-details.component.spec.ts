import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDetailsComponent } from './work-order-details.component';

describe('WorkOrderDetailsComponent', () => {
  let component: WorkOrderDetailsComponent;
  let fixture: ComponentFixture<WorkOrderDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkOrderDetailsComponent]
    });
    fixture = TestBed.createComponent(WorkOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
