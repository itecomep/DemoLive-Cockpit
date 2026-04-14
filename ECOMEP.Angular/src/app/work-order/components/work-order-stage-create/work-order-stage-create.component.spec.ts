import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderStageCreateComponent } from './work-order-stage-create.component';

describe('WorkOrderStageCreateComponent', () => {
  let component: WorkOrderStageCreateComponent;
  let fixture: ComponentFixture<WorkOrderStageCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkOrderStageCreateComponent]
    });
    fixture = TestBed.createComponent(WorkOrderStageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
