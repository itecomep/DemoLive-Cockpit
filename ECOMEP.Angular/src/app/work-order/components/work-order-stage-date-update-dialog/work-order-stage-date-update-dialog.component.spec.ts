import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderStageDateUpdateDialogComponent } from './work-order-stage-date-update-dialog.component';

describe('WorkOrderStageDateUpdateDialogComponent', () => {
  let component: WorkOrderStageDateUpdateDialogComponent;
  let fixture: ComponentFixture<WorkOrderStageDateUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkOrderStageDateUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(WorkOrderStageDateUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
