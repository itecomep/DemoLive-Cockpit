import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkOrderBillComponent } from './project-work-order-bill.component';

describe('ProjectWorkOrderBillComponent', () => {
  let component: ProjectWorkOrderBillComponent;
  let fixture: ComponentFixture<ProjectWorkOrderBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectWorkOrderBillComponent]
    });
    fixture = TestBed.createComponent(ProjectWorkOrderBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
