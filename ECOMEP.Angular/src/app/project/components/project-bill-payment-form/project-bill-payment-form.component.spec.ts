import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillPaymentFormComponent } from './project-bill-payment-form.component';

describe('ProjectBillPaymentFormComponent', () => {
  let component: ProjectBillPaymentFormComponent;
  let fixture: ComponentFixture<ProjectBillPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectBillPaymentFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBillPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
