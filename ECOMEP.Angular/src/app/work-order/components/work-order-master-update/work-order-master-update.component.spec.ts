import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderMasterUpdateComponent } from './work-order-master-update.component';

describe('WorkOrderMasterUpdateComponent', () => {
  let component: WorkOrderMasterUpdateComponent;
  let fixture: ComponentFixture<WorkOrderMasterUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkOrderMasterUpdateComponent]
    });
    fixture = TestBed.createComponent(WorkOrderMasterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
