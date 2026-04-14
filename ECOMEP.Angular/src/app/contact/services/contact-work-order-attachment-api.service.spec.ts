import { TestBed } from '@angular/core/testing';

import { ContactWorkOrderAttachmentApiService } from './contact-work-order-attachment-api.service';

describe('ContactWorkOrderAttachmentApiService', () => {
  let service: ContactWorkOrderAttachmentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactWorkOrderAttachmentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
