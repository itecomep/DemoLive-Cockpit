import { TestBed } from '@angular/core/testing';

import { AllowedIpService } from './allowed-ip.service';

describe('AllowedIpService', () => {
  let service: AllowedIpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllowedIpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
