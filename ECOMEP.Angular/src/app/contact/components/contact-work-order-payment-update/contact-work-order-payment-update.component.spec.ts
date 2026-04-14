import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkOrderPaymentUpdateComponent } from './contact-work-order-payment-update.component';

describe('ContactWorkOrderPaymentUpdateComponent', () => {
  let component: ContactWorkOrderPaymentUpdateComponent;
  let fixture: ComponentFixture<ContactWorkOrderPaymentUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactWorkOrderPaymentUpdateComponent]
    });
    fixture = TestBed.createComponent(ContactWorkOrderPaymentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
