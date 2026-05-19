import { TestBed } from '@angular/core/testing';

import { TeamTargetPointApiService } from './team-target-point-api.service';

describe('TeamTargetPointApiService', () => {
  let service: TeamTargetPointApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamTargetPointApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
