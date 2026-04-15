import { TestBed } from '@angular/core/testing';

import { HrModuleService } from './hr-module.service';

describe('HrModuleService', () => {
  let service: HrModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
