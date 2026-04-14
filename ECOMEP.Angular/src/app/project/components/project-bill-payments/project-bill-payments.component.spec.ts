import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillPaymentsComponent } from './project-bill-payments.component';

describe('ProjectBillPaymentsComponent', () => {
  let component: ProjectBillPaymentsComponent;
  let fixture: ComponentFixture<ProjectBillPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectBillPaymentsComponent]
    });
    fixture = TestBed.createComponent(ProjectBillPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
