import { TestBed } from '@angular/core/testing';

import { ContactWorkOrderApiService } from './contact-work-order-api.service';

describe('ContactWorkOrderApiService', () => {
  let service: ContactWorkOrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactWorkOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
