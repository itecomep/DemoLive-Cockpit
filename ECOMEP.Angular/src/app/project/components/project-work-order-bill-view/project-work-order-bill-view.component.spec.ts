import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkOrderBillViewComponent } from './project-work-order-bill-view.component';

describe('ProjectWorkOrderBillViewComponent', () => {
  let component: ProjectWorkOrderBillViewComponent;
  let fixture: ComponentFixture<ProjectWorkOrderBillViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectWorkOrderBillViewComponent]
    });
    fixture = TestBed.createComponent(ProjectWorkOrderBillViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
