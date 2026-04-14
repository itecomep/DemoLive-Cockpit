import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkOrderPaymentCreateComponent } from './contact-work-order-payment-create.component';

describe('ContactWorkOrderPaymentCreateComponent', () => {
  let component: ContactWorkOrderPaymentCreateComponent;
  let fixture: ComponentFixture<ContactWorkOrderPaymentCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactWorkOrderPaymentCreateComponent]
    });
    fixture = TestBed.createComponent(ContactWorkOrderPaymentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
