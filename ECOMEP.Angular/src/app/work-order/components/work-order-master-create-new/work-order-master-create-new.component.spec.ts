import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderMasterCreateNewComponent } from './work-order-master-create-new.component';

describe('WorkOrderMasterCreateNewComponent', () => {
  let component: WorkOrderMasterCreateNewComponent;
  let fixture: ComponentFixture<WorkOrderMasterCreateNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkOrderMasterCreateNewComponent]
    });
    fixture = TestBed.createComponent(WorkOrderMasterCreateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
