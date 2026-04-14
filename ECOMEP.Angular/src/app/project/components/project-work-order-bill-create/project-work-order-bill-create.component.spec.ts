import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkOrderBillCreateComponent } from './project-work-order-bill-create.component';

describe('ProjectWorkOrderBillCreateComponent', () => {
  let component: ProjectWorkOrderBillCreateComponent;
  let fixture: ComponentFixture<ProjectWorkOrderBillCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectWorkOrderBillCreateComponent]
    });
    fixture = TestBed.createComponent(ProjectWorkOrderBillCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
