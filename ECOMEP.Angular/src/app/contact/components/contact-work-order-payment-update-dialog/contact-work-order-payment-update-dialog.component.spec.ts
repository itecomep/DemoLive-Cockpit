import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkOrderPaymentUpdateDialogComponent } from './contact-work-order-payment-update-dialog.component';

describe('ContactWorkOrderPaymentUpdateDialogComponent', () => {
  let component: ContactWorkOrderPaymentUpdateDialogComponent;
  let fixture: ComponentFixture<ContactWorkOrderPaymentUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactWorkOrderPaymentUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(ContactWorkOrderPaymentUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
