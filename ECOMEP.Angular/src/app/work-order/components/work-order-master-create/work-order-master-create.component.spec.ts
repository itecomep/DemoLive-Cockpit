import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderMasterCreateComponent } from './work-order-master-create.component';

describe('WorkOrderMasterCreateComponent', () => {
  let component: WorkOrderMasterCreateComponent;
  let fixture: ComponentFixture<WorkOrderMasterCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkOrderMasterCreateComponent]
    });
    fixture = TestBed.createComponent(WorkOrderMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
