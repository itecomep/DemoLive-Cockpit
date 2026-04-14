import { TestBed } from '@angular/core/testing';

import { ContactWorkOrderPaymentAttachmentApiService } from './contact-work-order-payment-attachment-api.service';

describe('ContactWorkOrderPaymentAttachmentApiService', () => {
  let service: ContactWorkOrderPaymentAttachmentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactWorkOrderPaymentAttachmentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
