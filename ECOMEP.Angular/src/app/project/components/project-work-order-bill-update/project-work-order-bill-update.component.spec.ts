import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkOrderBillUpdateComponent } from './project-work-order-bill-update.component';

describe('ProjectWorkOrderBillUpdateComponent', () => {
  let component: ProjectWorkOrderBillUpdateComponent;
  let fixture: ComponentFixture<ProjectWorkOrderBillUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectWorkOrderBillUpdateComponent]
    });
    fixture = TestBed.createComponent(ProjectWorkOrderBillUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
