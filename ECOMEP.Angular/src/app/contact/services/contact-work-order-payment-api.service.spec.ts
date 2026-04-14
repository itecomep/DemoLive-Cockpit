import { TestBed } from '@angular/core/testing';

import { ContactWorkOrderPaymentApiService } from './contact-work-order-payment-api.service';

describe('ContactWorkOrderPaymentApiService', () => {
  let service: ContactWorkOrderPaymentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactWorkOrderPaymentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
